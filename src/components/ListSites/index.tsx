"use client";

import { Grid } from "@mui/material";
import { StyledGrid } from "./styled";
import { PreviewSite } from "@/components/PreviewSite";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { memo } from "react";
import { userPubkey } from "@/services/nostr/nostr";

export const ListSites = memo(function ListSites({
  data,
  isLinkToOpenSite = false,
  isLink = true,
  isPublic = true,
  isAuth = false,
  path = "",
}: {
  data: ReturnSettingsSiteDataType[] | undefined;
  isLink?: boolean;
  isPublic?: boolean;
  isLinkToOpenSite?: boolean;
  path?: string;
  isAuth?: boolean;
}) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <StyledGrid container spacing={{ xs: "16px", sm: "24px" }}>
      {data.map((el, i) => {
        return (
          <Grid key={i} item xs={12} sm={6} lg={4}>
            <PreviewSite
              id={el.id}
              path={path}
              logo={el.logo}
              name={el.name}
              title={el.title}
              url={el.url}
              image={el.image}
              description={el.description}
              accentColor={el.accentColor}
              contributors={el.contributors}
              adminPubkey={el.adminPubkey}
              userPubkey={isAuth ? userPubkey : undefined}
              isPublic={isPublic}
              isLink={isLink}
              isLinkToOpenSite={isLinkToOpenSite}
            />
          </Grid>
        );
      })}
    </StyledGrid>
  );
});
