"use client";
import { SearchPost, submitPost } from "@/services/nostr/content";
import {
  StyledAddButton,
  StyledAvatrAuthor,
  StyledCard,
  StyledCardContent,
  StyledCardDescription,
  StyledCardHead,
  StyledCardMedia,
  StyledCardNoImage,
  StyledCardText,
  StyledCardTitle,
  StyledCardWrapAuthor,
  StyledDate,
  StyledLink,
  StyledPostAuthorName,
  StyledStatus,
  StyledTags,
} from "./styled";
import { memo, MouseEvent, useEffect, useState } from "react";
import useImageLoader from "@/hooks/useImageLoader";
import { format, parseISO } from "date-fns";
import { BrokenBigIcon, CheckCircleIcon, IconPerson, PlusIcon } from "../Icons";
import { Avatar, Chip, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import { StyledTooltip } from "../Tooltip/styled";

export const PostCard = memo(
  ({
    post,
    siteId,
    updatePost,
  }: {
    post: SearchPost;
    siteId: string;
    updatePost: (post: SearchPost) => void;
  }) => {
    const {
      title,
      id,
      feature_image,
      url,
      created_at,
      event,
      tags,
      submitterPubkey,
      submitterProfile,
      primary_author,
      autoSubmitted,
    } = post;

    const { isLoaded: isLoadedImage } = useImageLoader(feature_image);

    const link = `/admin/${siteId}/posts/${id}`;

    const date = parseISO(created_at);

    const datePost = format(date, "MMM dd, yyyy");

    const timePost = format(date, "HH:hh");

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const isAdded = Boolean(submitterPubkey);

    const [progress, setProgress] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (isWaiting) {
        if (timer) {
          clearInterval(timer);
        }
        setIsWaiting(false);
        setProgress(0);
      } else {
        setIsWaiting(true);
        let progressValue = 0;
        const newTimer = setInterval(() => {
          progressValue += 3.333;

          setProgress(progressValue);

          if (progressValue >= 100) {
            clearInterval(newTimer);
            sendRequest();
          }
        }, 100);

        setTimer(newTimer);
      }
    };

    const sendRequest = async () => {
      setIsWaiting(false);
      setProgress(0);
      setIsSending(true);

      try {
        const submitPostResult = await submitPost(siteId, {
          id: id,
          author: event.pubkey,
          kind: event.kind!,
          url: "",
          remove: isAdded,
        });
        if (isAdded) {
          updatePost({ ...post, ...submitPostResult });
        } else {
          updatePost({ ...post, ...submitPostResult });
        }
      } catch (e: any) {
        console.log("error", e);
        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      } finally {
        setIsSending(false);
      }
    };

    useEffect(() => {
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [timer]);

    return (
      <StyledCard>
        <StyledLink component={Link} href={link}>
          <StyledCardContent>
            <StyledCardHead>
              {autoSubmitted && (
                <StyledTooltip
                  placement="bottom"
                  title="This post is automatically added from your Nostr app"
                  arrow
                >
                  <StyledStatus>
                    <CheckCircleIcon color="inherit" />
                    Auto-submitted
                  </StyledStatus>
                </StyledTooltip>
              )}
              <StyledAddButton
                isSending={isSending}
                isWaiting={isWaiting}
                isAdded={isAdded}
                loading={isSending}
                disabled={isSending}
                variant="outlined"
                color="decorate"
                onClick={handleClick}
                size="small"
                startIcon={
                  isSending ? undefined : isWaiting ? (
                    <CircularProgress
                      color="inherit"
                      size={16}
                      variant="determinate"
                      value={progress}
                    />
                  ) : isAdded ? (
                    <Avatar
                      src={submitterProfile?.profile?.picture}
                      sx={{
                        border: "1px solid #fff",
                        height: "20px",
                        width: "20px",
                        fontSize: "12px !important",
                      }}
                    >
                      <IconPerson fontSize="inherit" />
                    </Avatar>
                  ) : (
                    <PlusIcon color="inherit" fontSize="inherit" />
                  )
                }
              >
                {isWaiting ? "Cancel" : isAdded ? "Added" : "Add"}
              </StyledAddButton>
            </StyledCardHead>
            {isLoadedImage && feature_image ? (
              <StyledCardMedia
                component="img"
                image={feature_image}
                alt={title || url}
              />
            ) : (
              <StyledCardNoImage>
                <BrokenBigIcon fontSize="inherit" sx={{ margin: "auto" }} />
              </StyledCardNoImage>
            )}

            <StyledDate variant="body2">
              <span>{datePost}</span>
              <span>{timePost}</span>
            </StyledDate>

            <StyledCardText>
              <StyledCardTitle>{title}</StyledCardTitle>
              <StyledCardDescription variant="body2">
                {event.content}
              </StyledCardDescription>
            </StyledCardText>

            <StyledTags>
              {tags.map((tag, idx) => (
                <Chip label={tag.name} key={idx} size="medium" />
              ))}
            </StyledTags>

            <StyledCardWrapAuthor>
              <StyledAvatrAuthor
                src={
                  primary_author?.profile_image
                    ? primary_author?.profile_image
                    : "#"
                }
              >
                <IconPerson fontSize="inherit" />
              </StyledAvatrAuthor>
              <StyledPostAuthorName>
                {primary_author?.name}
              </StyledPostAuthorName>
            </StyledCardWrapAuthor>
          </StyledCardContent>
        </StyledLink>
      </StyledCard>
    );
  },
);

PostCard.displayName = "PostCard";
