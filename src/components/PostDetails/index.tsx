"use client";
import { SearchPost } from "@/services/nostr/content";
import { StyledTitlePage } from "./styled";
import { memo } from "react";
import { ChevronLeftIcon } from "@/components/Icons";
import { Button, Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useBack } from "@/hooks/useBackPage";
import { PostDetailsContent } from "../PostDetailsContent";
import { StyledWrap } from "@/components/shared/styled";

export const PostDetails = memo(
  ({ post, siteId }: { post: SearchPost; siteId: string }) => {
    const { title } = post;

    const { back } = useBack();
    const params = useSearchParams();

    const handleBack = () => {
      const backSlug = params.get("backSlug");

      if (backSlug) {
        if (params.size) {
          back(`add?${params.toString()}`);

          return;
        }

        back("add");

        return;
      }

      if (params.size) {
        back(`?${params.toString()}`);

        return;
      }

      back();
    };

    return (
      <Container maxWidth="lg">
        <StyledWrap>
          <StyledTitlePage>
            <Button
              onClick={handleBack}
              variant="text"
              color="secondary"
              sx={{ minWidth: "auto" }}
            >
              <ChevronLeftIcon />
            </Button>
            <span>{title}</span>
          </StyledTitlePage>

          <PostDetailsContent post={post} siteId={siteId} />
        </StyledWrap>
      </Container>
    );
  },
);

PostDetails.displayName = "PostDetails";
