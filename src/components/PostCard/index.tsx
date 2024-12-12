"use client";

import { SearchPost, submitPost } from "@/services/nostr/content";
import {
  StyledAvatrAuthor,
  StyledCard,
  StyledCardContent,
  StyledCardDescription,
  StyledCardMedia,
  StyledCardNoImage,
  StyledCardText,
  StyledCardTitle,
  StyledCardWrapAuthor,
  StyledDate,
  StyledLink,
  StyledPostAuthorName,
  StyledStatus,
} from "./styled";
import { usePathname } from "next/navigation";
import { memo, MouseEvent, useEffect, useState } from "react";
import useImageLoader from "@/hooks/useImageLoader";
import { format, parseISO } from "date-fns";
import { BrokenBigIcon, CheckCircleIcon, IconPerson, PlusIcon } from "../Icons";
import { Avatar, Box, Chip, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

export const PostCard = memo(
  ({ post, siteId }: { post: SearchPost; siteId: string }) => {
    const { title, id, feature_image, url, created_at, event, tags } = post;

    const pathname = usePathname();
    const { isLoaded: isLoadedImage } = useImageLoader(feature_image);

    const link = `${pathname}/${id}`;
    const date = parseISO(created_at);

    const datePost = format(date, "MMM dd, yyyy");

    const timePost = format(date, "HH:hh");

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const [isAdded, setAdded] = useState<boolean>(false);

    const [progress, setProgress] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleClick = (
      e: MouseEvent<HTMLButtonElement>,
      isAdded: boolean,
    ) => {
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
            sendRequest(isAdded);
          }
        }, 100);

        setTimer(newTimer);
      }
    };

    const sendRequest = async (isAdded: boolean) => {
      setIsWaiting(false);
      setProgress(0);
      setIsSending(true);

      try {
        await submitPost(siteId, {
          id: id,
          author: event.pubkey,
          kind: event.kind!,
          url: "",
          remove: isAdded,
        });

        setAdded((prev) => !prev);
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StyledStatus>
                <CheckCircleIcon color="inherit" />
                Auto-submitted
              </StyledStatus>
              <LoadingButton
                sx={{
                  marginLeft: "auto",
                  background: isWaiting
                    ? "initial"
                    : isAdded
                      ? "rgba(255, 62, 217, 0.5)"
                      : "initial",
                }}
                loading={isSending}
                disabled={isSending}
                variant="outlined"
                color="decorate"
                onClick={(e) => handleClick(e, isAdded)}
                startIcon={
                  isWaiting ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      variant="determinate"
                      value={progress}
                    />
                  ) : isAdded ? (
                    <Avatar
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
              </LoadingButton>
            </Box>
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

            <Box>
              {tags.map((tag, idx) => (
                <Chip
                  label={tag.name}
                  key={idx}
                  size="medium"
                  sx={{
                    marginRight: "10px",
                  }}
                />
              ))}
            </Box>

            <StyledCardWrapAuthor>
              <StyledAvatrAuthor src="#">
                <IconPerson fontSize="inherit" />
              </StyledAvatrAuthor>
              <StyledPostAuthorName>Test name</StyledPostAuthorName>
            </StyledCardWrapAuthor>
          </StyledCardContent>
        </StyledLink>
      </StyledCard>
    );
  },
);

PostCard.displayName = "PostCard";
