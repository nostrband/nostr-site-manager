"use client";
import { Design } from "@/components/Pages/Design";
import { Suspense } from "react";

export default function DesignPage() {
  return (
    <Suspense>
      <Design />
    </Suspense>
  );
}
