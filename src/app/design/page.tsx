"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Design = dynamic(() => import("../../components/Pages/Design"), {
  ssr: false,
});

export default function DesignPage() {
  return (
    <Suspense>
      <Design />
    </Suspense>
  );
}
