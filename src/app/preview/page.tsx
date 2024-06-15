"use client";
import { Preview } from "@/components/Pages/Preview";
import { Suspense } from 'react'
export default function PreviewPage() {
  return <Suspense><Preview /></Suspense>;
}
