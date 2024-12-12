"use client";
import { Alert, Container, Grid } from "@mui/material";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { Head } from "./components/Head";
import { Filter } from "./components/Filter";
import { useState } from "react";
import { SearchPost } from "@/services/nostr/content";
import { SpinerCircularProgress } from "@/components/Spiner";
import {
  SpinerWrapSites,
  StyledEmptyBlock,
  StyledWrapListPosts,
} from "./styled";
import { NotFoundIcon } from "@/components/Icons";
import { PostCard } from "@/components/PostCard";

export const PostManagement = () => {
  const { siteId } = useGetSiteId();
  const [isLoadingPosts, setloadingPosts] = useState(true);
  const [posts, setPosts] = useState<SearchPost[]>([]);

  const isNotFound = posts.length === 0;

  return (
    <Container maxWidth="lg">
      <Head siteId={siteId} />

      <Filter
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
                  <PostCard siteId={siteId} post={post} />
                </Grid>
              );
            })}
          </Grid>
        </StyledWrapListPosts>
      )}
    </Container>
  );
};
