"use client";
import { Suspense } from "react";
import { Publishing } from "@/components/Pages/Publishing";

export default function PublishingPage() {
  return (
    <Suspense>
      <Publishing />
    </Suspense>
  );
}
