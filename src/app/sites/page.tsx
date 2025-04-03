"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Sites = dynamic(() => import("../../components/Pages/Sites"), {
  ssr: false,
});

export default function SitesPage() {
  return (
    <Suspense>
      <Sites />
    </Suspense>
  );
}
