"use client";
import { fetchPost, SearchPost } from "@/services/nostr/content";
import { memo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSiteSettings } from "@/services/nostr/api";
import { PostDetailsContent } from "@/components/PostDetailsContent";
import { SpinerCircularProgress } from "@/components/Spiner";
import { SpinerWrapSites } from "../PostManagement/styled";

export const AddPostDetails = memo(() => {
  const params = useParams();
  const [post, setPost] = useState<SearchPost | undefined>(undefined);

  const getPost = async () => {
    if (!Array.isArray(params.id) && !Array.isArray(params.idAddPostDetails)) {
      const site = await getSiteSettings(params.id);

      console.log({ params: params.id });

      if (site) {
        const post = await fetchPost(site, params.idAddPostDetails);

        setPost(post);
      }
    }
  };

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

  return (
    <PostDetailsContent
      post={post}
      siteId={Array.isArray(params.id) ? "" : params.id}
    />
  );
});

AddPostDetails.displayName = "AddPostDetails";
