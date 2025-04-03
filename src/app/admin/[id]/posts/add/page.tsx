"use client";
import React from "react";
import dynamic from "next/dynamic";

const AddPost = dynamic(
  () => import("../../../../../components/Pages/AddPost"),
  {
    ssr: false,
  },
);

export default function AddPostPage() {
  return <AddPost />;
}
