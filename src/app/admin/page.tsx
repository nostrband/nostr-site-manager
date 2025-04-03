"use client";

import dynamic from "next/dynamic";

const AdminPage = dynamic(() => import("../../components/Pages/Admin"), {
  ssr: false,
});

export default function Home() {
  return <AdminPage />;
}
