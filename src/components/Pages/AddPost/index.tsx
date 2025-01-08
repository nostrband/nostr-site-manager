"use client";
import { Alert, Container, Grid } from "@mui/material";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { Head } from "./components/Head";
import { Filter } from "./components/Filter";
import { useCallback, useState } from "react";
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

export const AddPost = () => {
  const { siteId } = useGetSiteId();
  const [isLoadingPosts, setloadingPosts] = useState(true);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [isSearchResult, setSearchResult] = useState(false);

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
      <Head isSearchResult={isSearchResult} />

      <Filter
        setPosts={setPosts}
        siteId={siteId}
        handleLoading={setloadingPosts}
        isLoading={isLoadingPosts}
        setSearchResult={setSearchResult}
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
              variant="contained"
              color="decorate"
              fullWidth
              size="large"
            >
              Load more
            </LoadingButton>
          </StyledShowMore>
        </StyledWrapListPosts>
      )}
    </Container>
  );
};
