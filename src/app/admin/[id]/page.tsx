"use client";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { siteId } = useGetSiteId();

  return redirect(`/admin/${siteId}/dashboard`);
}
