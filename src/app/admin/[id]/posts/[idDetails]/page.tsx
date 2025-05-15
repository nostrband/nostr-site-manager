"use client";
import dynamic from "next/dynamic";

const PostDetails = dynamic(
  () => import("../../../../../components/Pages/PostDetails"),
  {
    ssr: false,
  },
);

export default function PostDetailsPage() {
  return <PostDetails />;
}
