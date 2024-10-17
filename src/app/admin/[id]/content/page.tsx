"use client";
import { ContentManagement } from "@/components/Pages/ContentManagement";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { useParams } from "next/navigation";

export default function ContentManagementPage() {
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data } = useSettingsSite(siteId);

  if (!data) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return <ContentManagement siteData={data} />;
}
