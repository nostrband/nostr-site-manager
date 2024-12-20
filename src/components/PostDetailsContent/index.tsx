"use client";
import { SearchPost, submitPost } from "@/services/nostr/content";
import {
  StyledAddButton,
  StyledAvatrAuthor,
  StyledCard,
  StyledCardDescription,
  StyledCardMedia,
  StyledCardNoImage,
  StyledCardText,
  StyledCardTitle,
  StyledCardTitleFeature,
  StyledCardWrapAuthor,
  StyledComingSoon,
  StyledDate,
  StyledPostAuthorName,
  StyledStatus,
  StyledStatusState,
  StyledStatusWrap,
  StyledTags,
  StyledTitlePage,
  StyledWrap,
} from "./styled";
import { memo, MouseEvent, useEffect, useState } from "react";
import useImageLoader from "@/hooks/useImageLoader";
import { format, parseISO } from "date-fns";
import {
  BrokenBigIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  IconPerson,
  InfoIcon,
  PlusIcon,
} from "@/components/Icons";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { StyledTooltip } from "@/components/Tooltip/styled";
import { useRouter } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";

export const PostDetailsContent = memo(
  ({ post: postData, siteId }: { post: SearchPost; siteId: string }) => {
    const [post, setPost] = useState(postData);
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
    } = post;

    const router = useRouter();

    const handleBack = () => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    };

    const updatePost = (post: SearchPost) => {
      setPost(post);
    };

    const { isLoaded: isLoadedImage } = useImageLoader(feature_image);

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
          updatePost({ ...post, submitterPubkey: "" });
        } else {
          updatePost({ ...post, submitterPubkey: "test" });
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
      <Container maxWidth="lg">
        <StyledWrap>
          <StyledTitlePage>
            <Button
              onClick={handleBack}
              color="primary"
              variant="text"
              sx={{ minWidth: "auto" }}
            >
              <ChevronLeftIcon />
            </Button>
            <span>{title}</span>
          </StyledTitlePage>
          <StyledCard>
            {isLoadedImage && feature_image ? (
              <StyledCardMedia
                component="img"
                isDesktop={isDesktop}
                image={feature_image}
                alt={title || url}
              />
            ) : (
              <StyledCardNoImage isDesktop={isDesktop}>
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
                {html}
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
          </StyledCard>

          <Grid
            container
            sx={{ paddingTop: "24px", paddingBottom: "24px" }}
            spacing={{ xs: "24px" }}
          >
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
                      title="This post is automatically added from your Nostr app"
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
        </StyledWrap>
      </Container>
    );
  }
);

PostDetailsContent.displayName = "PostDetailsContent";
