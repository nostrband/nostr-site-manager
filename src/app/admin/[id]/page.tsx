"use client";
import { redirect, useParams } from "next/navigation";

export default function Dashboard() {
  const params = useParams();

  return redirect(`/admin/${params.id}/dashboard`);
}
