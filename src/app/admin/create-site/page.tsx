"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateSite = dynamic(
  () => import("../../../components/Pages/CreateSite"),
  {
    ssr: false,
  },
);

export default function CreateSitePage() {
  return (
    <Suspense>
      <CreateSite />
    </Suspense>
  );
}
