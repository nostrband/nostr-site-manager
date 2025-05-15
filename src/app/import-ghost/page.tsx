"use client";
import dynamic from "next/dynamic";

const GhostImport = dynamic(
  () => import("../../components/Pages/GhostImport"),
  {
    ssr: false,
  },
);

export default function GhostImportPage() {
  return <GhostImport />;
}
