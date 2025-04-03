"use client";
import { fetchPost, SearchPost } from "@/services/nostr/content";
import { memo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSiteSettings } from "@/services/nostr/api";
import { PostDetails } from "@/components/PostDetails";
import { SpinerCircularProgress } from "@/components/Spiner";
import { SpinerWrapSites } from "../PostManagement/styled";

const PostDetailsPage = memo(() => {
  const params = useParams();
  const [post, setPost] = useState<SearchPost | undefined>(undefined);

  const getPost = async () => {
    if (!Array.isArray(params.id) && !Array.isArray(params.idDetails)) {
      const site = await getSiteSettings(params.id);

      if (site) {
        const post = await fetchPost(site, params.idDetails);

        setPost(post);
      }
    }
  };

  const siteId = Array.isArray(params.id) ? "" : params.id;

  useEffect(() => {
    getPost();
  }, []);

  if (!post) {
    return (
      <SpinerWrapSites>
        <SpinerCircularProgress />
      </SpinerWrapSites>
    );
  }

  return <PostDetails post={post} siteId={siteId} />;
});

PostDetailsPage.displayName = "PostDetailsPage";

export default PostDetailsPage;
