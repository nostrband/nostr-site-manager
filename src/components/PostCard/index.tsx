"use client";
import { SearchPost, submitPost } from "@/services/nostr/content";
import {
  StyledAddButton,
  StyledAddButtonAvatar,
  StyledAvatrAuthor,
  StyledCard,
  StyledCardContent,
  StyledCardDescription,
  StyledCardHead,
  StyledCardMedia,
  StyledCardMediaWrap,
  StyledCardMediaZoom,
  StyledCardText,
  StyledCardTitle,
  StyledCardVideo,
  StyledCardVideoPlayButton,
  StyledCardVideoWrap,
  StyledCardWrapAuthor,
  StyledDate,
  StyledLink,
  StyledPostAuthorName,
  StyledStatus,
  StyledTags,
  StyledTypePost,
} from "./styled";
import { memo, MouseEvent, useEffect, useRef, useState } from "react";
import useImageLoader from "@/hooks/useImageLoader";
import { format, parseISO } from "date-fns";
import {
  CheckCircleIcon,
  IconPerson,
  PlayIcon,
  PlusIcon,
  SearchIcon,
} from "../Icons";
import { Chip, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import { StyledTooltip } from "../Tooltip/styled";
import { useSearchParams } from "next/navigation";
import { SUPPORTED_KIND_NAMES_SINGLE } from "@/consts";
import { PostDetailsModal } from "../PostDetailsModal";
import useResponsive from "@/hooks/useResponsive";
import { PhotoViewer } from "../PhotoViewer";

export const PostCard = memo(
  ({
    post,
    siteId,
    updatePost,
    backSlug,
  }: {
    post: SearchPost;
    siteId: string;
    updatePost: (post: SearchPost) => void;
    backSlug?: string;
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
      videos,
    } = post;

    const { isLoaded: isLoadedImage } = useImageLoader(feature_image);
    const params = useSearchParams();
    const queryParams = `${params.toString()}${backSlug ? `${params.size ? "&" : ""}backSlug=${backSlug}` : ""}`;
    const link = `/admin/${siteId}/posts/${id}${queryParams.length ? `?${queryParams}` : ""}`;
    const date = parseISO(created_at);
    const datePost = format(date, "MMM dd, yyyy");
    const timePost = format(date, "HH:hh");

    const isDesktop = useResponsive("up", "sm");

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isOpenPhoto, setOpenPhoto] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const srcVideo = isVisible ? `${videos[0]}#t=0.1` : "";

    const isAdded = Boolean(submitterPubkey);

    const isVideos = Boolean(videos.length);

    const isTitle = event.kind !== 1 && Boolean(title);

    const [progress, setProgress] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleOpenPost = (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      e.preventDefault();

      setOpenModal(true);
    };

    const handleCloseModalPost = () => {
      setOpenModal(false);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

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

    const handleOpenPhoto = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setOpenPhoto(true);
    };

    const handleClosePhoto = () => {
      setOpenPhoto(false);
    };

    useEffect(() => {
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }, [timer]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            setIsVisible(true);
          }
        },
        {
          rootMargin: "0px",
          threshold: 0.1,
        },
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }, []);

    return (
      <>
        <StyledCard>
          <StyledLink onClick={handleOpenPost} component={Link} href={link}>
            <StyledCardContent>
              <StyledCardHead>
                {autoSubmitted && (
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
                )}
                <StyledAddButton
                  isSending={isSending}
                  isWaiting={isWaiting}
                  isAdded={isAdded}
                  loading={isSending}
                  disabled={isSending}
                  variant="outlined"
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
                      <StyledAddButtonAvatar
                        src={submitterProfile?.profile?.picture}
                      >
                        <IconPerson fontSize="inherit" />
                      </StyledAddButtonAvatar>
                    ) : (
                      <PlusIcon color="inherit" fontSize="inherit" />
                    )
                  }
                >
                  {isWaiting ? "Cancel" : isAdded ? "Added" : "Add"}
                </StyledAddButton>
              </StyledCardHead>
              {isLoadedImage && feature_image ? (
                <StyledCardMediaWrap>
                  <StyledCardMedia
                    component="img"
                    image={feature_image}
                    isDesktop={isDesktop}
                    alt={title || url}
                  />
                  <StyledCardMediaZoom onClick={handleOpenPhoto} size="small">
                    <SearchIcon fontSize="inherit" />
                  </StyledCardMediaZoom>
                </StyledCardMediaWrap>
              ) : isVideos ? (
                <StyledCardVideoWrap isDesktop={isDesktop}>
                  <StyledCardVideoPlayButton>
                    <PlayIcon />
                  </StyledCardVideoPlayButton>
                  <StyledCardVideo
                    ref={videoRef}
                    preload="metadata"
                    src={srcVideo}
                  />
                </StyledCardVideoWrap>
              ) : null}

              <StyledDate component="div" variant="body5">
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

              {(isTitle || Boolean(event.content)) && (
                <StyledCardText>
                  {isTitle && (
                    <StyledCardTitle variant="h5">{title}</StyledCardTitle>
                  )}
                  {Boolean(event.content) && (
                    <StyledCardDescription component="div" variant="body3">
                      {event.content}
                    </StyledCardDescription>
                  )}
                </StyledCardText>
              )}

              {Boolean(tags.length) && (
                <StyledTags>
                  {tags.map((tag, idx) => (
                    <Chip label={tag.name} key={idx} size="medium" />
                  ))}
                </StyledTags>
              )}

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
                <StyledPostAuthorName variant="body1">
                  {primary_author?.name}
                </StyledPostAuthorName>
              </StyledCardWrapAuthor>
            </StyledCardContent>
          </StyledLink>
        </StyledCard>

        <PostDetailsModal
          siteId={siteId}
          post={post}
          link={link}
          isOpenModal={isOpenModal}
          handleCloseModalPost={handleCloseModalPost}
          updateExternalPost={updatePost}
        />

        {feature_image ? (
          <PhotoViewer
            isOpen={isOpenPhoto}
            src={feature_image}
            onClose={handleClosePhoto}
          />
        ) : null}
      </>
    );
  },
);

PostCard.displayName = "PostCard";
