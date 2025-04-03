"use client";
import dynamic from "next/dynamic";

const SettingPage = dynamic(
  () => import("../../../../components/Pages/SettingPage"),
  {
    ssr: false,
  },
);

export default function Settings() {
  return <SettingPage />;
}
