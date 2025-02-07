"use client";
import { SearchPost, submitPost } from "@/services/nostr/content";
import {
  StyledAddButton,
  StyledAvatrAuthor,
  StyledButtonCollapse,
  StyledCard,
  StyledCardDescription,
  StyledCardMedia,
  StyledCardText,
  StyledCardTitle,
  StyledCardTitleFeature,
  StyledCardVideo,
  StyledCardWrapAuthor,
  StyledComingSoon,
  StyledDate,
  StyledPostAuthorName,
  StyledStatus,
  StyledStatusState,
  StyledStatusWrap,
  StyledTags,
  StyledTypePost,
} from "./styled";
import { memo, MouseEvent, useEffect, useState } from "react";
import useImageLoader from "@/hooks/useImageLoader";
import { format, parseISO } from "date-fns";
import {
  CheckCircleIcon,
  IconPerson,
  InfoIcon,
  PlusIcon,
} from "@/components/Icons";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { StyledTooltip } from "@/components/Tooltip/styled";
import useResponsive from "@/hooks/useResponsive";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { SUPPORTED_KIND_NAMES_SINGLE } from "@/consts";

export const PostDetailsContent = memo(
  ({
    post: postData,
    siteId,
    heightCardMedia,
    updateExternalPost,
  }: {
    post: SearchPost;
    siteId: string;
    heightCardMedia?: number;
    updateExternalPost?: (post: SearchPost) => void;
  }) => {
    const [post, setPost] = useState(postData);
    const [isShowMore, setShowMore] = useState(false);
    const isDesktop = useResponsive("up", "sm");

    const {
      title,
      html,
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
      videos,
    } = post;

    const handleShowMore = () => {
      setShowMore(true);
    };

    const updatePost = (post: SearchPost) => {
      setPost(post);

      if (updateExternalPost) {
        updateExternalPost(post);
      }
    };

    const { isLoaded: isLoadedImage } = useImageLoader(feature_image);

    const date = parseISO(created_at);

    const datePost = format(date, "MMM dd, yyyy");

    const timePost = format(date, "HH:hh");

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const isAdded = Boolean(submitterPubkey);

    const isVideos = Boolean(videos.length);

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

    const getLengthDescription = DOMPurify.sanitize(html ? html : "", {
      ALLOWED_TAGS: [],
    })
      .replace(/\s+/g, " ")
      .trim().length;

    const isCollapseText =
      (isDesktop && getLengthDescription > 1380) ||
      (!isDesktop && getLengthDescription > 340);
    const heightCollapseArea = isDesktop ? 440 : 220;

    useEffect(() => {
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [timer]);

    useEffect(() => {
      setPost(postData);
    }, [postData.submitterPubkey, postData.submitterProfile]);

    return (
      <>
        <StyledCard>
          {isLoadedImage && feature_image ? (
            <StyledCardMedia
              component="img"
              isDesktop={isDesktop}
              image={feature_image}
              alt={title || url}
              height={heightCardMedia}
            />
          ) : isVideos ? (
            <StyledCardVideo
              isDesktop={isDesktop}
              height={heightCardMedia}
              src={videos[0]+"#t=0.1"}
            />
          ) : null}

          <StyledDate variant="body2">
            <span>{datePost}</span>
            <span>{timePost}</span>

            {event.kind && (
              <StyledTypePost
                label={SUPPORTED_KIND_NAMES_SINGLE[event.kind]}
                color="secondary"
                size="small"
              />
            )}
          </StyledDate>

          <StyledCardText>
            <StyledCardTitle>{title}</StyledCardTitle>
            <StyledCardDescription variant="body2">
              {isCollapseText ? (
                <>
                  <Collapse in={isShowMore} collapsedSize={heightCollapseArea}>
                    {html ? parse(html) : html}
                  </Collapse>

                  {!isShowMore && (
                    <StyledButtonCollapse>
                      <Button
                        color="decorate"
                        variant="contained"
                        onClick={handleShowMore}
                      >
                        Show more
                      </Button>
                    </StyledButtonCollapse>
                  )}
                </>
              ) : (
                <>{html ? parse(html) : html}</>
              )}
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
            <StyledPostAuthorName>{primary_author?.name}</StyledPostAuthorName>
          </StyledCardWrapAuthor>
        </StyledCard>

        <Grid container sx={{ paddingTop: "24px" }} spacing={{ xs: "24px" }}>
          <Grid item xs={12} sm={6}>
            <StyledCard>
              <StyledCardTitleFeature>Post settings</StyledCardTitleFeature>
              <StyledAddButton
                fullWidth
                isSending={isSending}
                isWaiting={isWaiting}
                isAdded={isAdded}
                loading={isSending}
                disabled={isSending}
                variant="outlined"
                color="decorate"
                onClick={handleClick}
                size="large"
                startIcon={
                  isSending ? undefined : isWaiting ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
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

              {autoSubmitted && (
                <StyledStatusWrap>
                  <StyledStatusState variant="body2">State</StyledStatusState>
                  <StyledTooltip
                    placement="bottom"
                    title="This post is auto-submitted according to your Settings"
                    arrow
                  >
                    <StyledStatus>
                      <CheckCircleIcon color="inherit" />
                      Auto-submitted
                    </StyledStatus>
                  </StyledTooltip>
                </StyledStatusWrap>
              )}
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledCard>
              <StyledCardTitleFeature>
                Information and stats
              </StyledCardTitleFeature>
              <StyledComingSoon>
                <InfoIcon color="inherit" />
                Coming soon
              </StyledComingSoon>
            </StyledCard>
          </Grid>
        </Grid>
      </>
    );
  }
);

PostDetailsContent.displayName = "PostDetailsContent";
