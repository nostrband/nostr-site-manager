"use client";
import { memo } from "react";
import { SearchPost } from "@/services/nostr/content";
import { PostDetailsContent } from "../PostDetailsContent";
import { StyledDialog, StyledDialogContent, StyledTitlePage } from "./styled";
import { Button } from "@mui/material";
import { CrossIcon, IconLink } from "../Icons";
import Link from "next/link";

export const PostDetailsModal = memo(
  ({
    post,
    siteId,
    isOpenModal,
    link,
    handleCloseModalPost,
    updateExternalPost,
  }: {
    post: SearchPost;
    siteId: string;
    isOpenModal: boolean;
    link: string;
    handleCloseModalPost: () => void;
    updateExternalPost?: (post: SearchPost) => void;
  }) => {
    return (
      <StyledDialog
        fullWidth
        open={isOpenModal}
        scroll="paper"
        onClose={handleCloseModalPost}
      >
        <StyledDialogContent>
          <StyledTitlePage>
            <span>{post.title}</span>
            <Button
              LinkComponent={Link}
              href={link}
              target="_blank"
              color="secondary"
              variant="text"
              sx={{ minWidth: "auto", marginLeft: "auto" }}
            >
              <IconLink />
            </Button>
            <Button
              onClick={handleCloseModalPost}
              color="secondary"
              variant="text"
              sx={{ minWidth: "auto" }}
            >
              <CrossIcon />
            </Button>
          </StyledTitlePage>

          <PostDetailsContent
            heightCardMedia={260}
            post={post}
            siteId={siteId}
            updateExternalPost={updateExternalPost}
          />
        </StyledDialogContent>
      </StyledDialog>
    );
  },
);

PostDetailsModal.displayName = "PostDetailsModal";
