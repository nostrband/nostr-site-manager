"use client";
import { Alert, Container, Grid } from "@mui/material";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { Head } from "./components/Head";
import { Filter, FilterRef } from "./components/Filter";
import { useCallback, useRef, useState } from "react";
import { SearchPost } from "@/services/nostr/content";
import { SpinerCircularProgress } from "@/components/Spiner";
import {
  SpinerWrapSites,
  StyledEmptyBlock,
  StyledShowMore,
  StyledWrapListPosts,
} from "./styled";
import { NotFoundIcon } from "@/components/Icons";
import { PostCard } from "@/components/PostCard";
import { LoadingButton } from "@mui/lab";

export const PostManagement = () => {
  const { siteId } = useGetSiteId();
  const [isLoadingPosts, setloadingPosts] = useState(true);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const filterRef = useRef<FilterRef | null>(null);

  const linkToAddPost = `/admin/${siteId}/posts/add`;

  const handleLoadMore = () => {
    const lastPost = posts.at(-1);

    if (filterRef.current) {
      if (lastPost) {
        const createdAtDate = new Date(lastPost.created_at);
        const createdAtTime = createdAtDate.getTime() / 1000;

        filterRef.current.handleLoadMore(createdAtTime);
      }
    }
  };

  const isNotFound = posts.length === 0;

  const updatePost = useCallback(
    (post: SearchPost) => {
      setPosts((prev) =>
        prev.map((el) => {
          if (el.id === post.id) {
            return post;
          }

          return el;
        }),
      );
    },
    [setPosts],
  );

  return (
    <Container maxWidth="lg">
      <Head linkToAddPost={linkToAddPost} />

      <Filter
        linkToAddPost={linkToAddPost}
        setIsEmpty={setIsEmpty}
        handleLoadingMore={setLoadingMore}
        ref={filterRef}
        setPosts={setPosts}
        siteId={siteId}
        handleLoading={setloadingPosts}
        isLoading={isLoadingPosts}
      />

      {isNotFound && !isLoadingPosts && (
        <StyledEmptyBlock>
          <Alert icon={<NotFoundIcon fontSize="inherit" />} severity="warning">
            <b>Posts not found</b>
          </Alert>
        </StyledEmptyBlock>
      )}

      {isLoadingPosts && (
        <SpinerWrapSites>
          <SpinerCircularProgress />
        </SpinerWrapSites>
      )}

      {!isNotFound && !isLoadingPosts && (
        <StyledWrapListPosts>
          <Grid container spacing={{ xs: "24px" }}>
            {posts.map((post, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <PostCard
                    updatePost={updatePost}
                    siteId={siteId}
                    post={post}
                  />
                </Grid>
              );
            })}
          </Grid>
          <StyledShowMore>
            <LoadingButton
              disabled={isLoadingMore}
              loading={isLoadingMore}
              variant="outlined"
              color="decorate"
              fullWidth
              size="large"
              onClick={handleLoadMore}
            >
              {isEmpty ? "Try again" : "Load more"}
            </LoadingButton>
          </StyledShowMore>
        </StyledWrapListPosts>
      )}
    </Container>
  );
};
