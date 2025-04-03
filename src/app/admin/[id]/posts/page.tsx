"use client";
import dynamic from "next/dynamic";

const PostManagement = dynamic(
  () => import("../../../../components/Pages/PostManagement"),
  {
    ssr: false,
  },
);

export default function PostManagementPage() {
  return <PostManagement />;
}
