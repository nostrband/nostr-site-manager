"use client";
import { CreateSite } from "@/components/Pages/CreateSite";
import { Suspense } from "react";

export default function CreateSitePage() {
  return (
    <Suspense>
      <CreateSite />
    </Suspense>
  );
}
