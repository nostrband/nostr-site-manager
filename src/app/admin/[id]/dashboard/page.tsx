"use client";
import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("../../../../components/Pages/Dashboard"),
  {
    ssr: false,
  },
);

export default function DashboardPage() {
  return <Dashboard />;
}
