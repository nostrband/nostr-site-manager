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
  StyledWrap,
  StyledWrapListPosts,
} from "./styled";
import { NotFoundIcon } from "@/components/Icons";
import { PostCard } from "@/components/PostCard";
import { LoadingButton } from "@mui/lab";

export const AddPost = () => {
  const { siteId } = useGetSiteId();
  const [isLoadingPosts, setloadingPosts] = useState(true);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [isSearchResult, setSearchResult] = useState(false);
  const filterRef = useRef<FilterRef | null>(null);

  const isNotFound = posts.length === 0;

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
      <StyledWrap>
        <Head isSearchResult={isSearchResult} />

        <Filter
          setIsEmpty={setIsEmpty}
          handleLoadingMore={setLoadingMore}
          ref={filterRef}
          setPosts={setPosts}
          siteId={siteId}
          handleLoading={setloadingPosts}
          isLoading={isLoadingPosts}
          setSearchResult={setSearchResult}
        />

        {isNotFound && !isLoadingPosts && (
          <StyledEmptyBlock>
            <Alert
              icon={<NotFoundIcon fontSize="inherit" />}
              severity="warning"
            >
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
            {[posts[41], posts[42], posts[43]].map((post, index) => {
              return (
                <PostCard
                  key={index}
                  updatePost={updatePost}
                  siteId={siteId}
                  post={post}
                  backSlug="add"
                />
              );
            })}

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
      </StyledWrap>
    </Container>
  );
};
