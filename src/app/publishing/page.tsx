"use client";
import { Suspense } from "react";
import dynamic from 'next/dynamic'
 
const Publishing = dynamic(() => import('../../components/Pages/Publishing'), { ssr: false })

export default function PublishingPage() {
  return (
    <Suspense>
      <Publishing />
    </Suspense>
  );
}
