"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Landing = dynamic(() => import("../components/Pages/Landing"), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <Suspense>
      <Landing />
    </Suspense>
  );
}
