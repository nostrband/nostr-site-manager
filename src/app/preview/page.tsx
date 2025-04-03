"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Preview = dynamic(() => import("../../components/Pages/Preview"), {
  ssr: false,
});

export default function PreviewPage() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
