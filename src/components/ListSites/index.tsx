"use client";
import * as React from "react";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { StyledListWrap } from "@/components/ListSites/styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { Grid } from "@mui/material";
import { PreviewSite } from "@/components/PreviewSite";

type ListSitesType = {
  data: ReturnSettingsSiteDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const pathAdmin = useFirstPathElement();

  return (
    <StyledListWrap>
      <Grid
        sx={{ width: "100%", marginTop: "40px" }}
        container
        spacing={{ xs: "24px", md: "30px" }}
      >
        {data.map((el, i) => {
          return (
            <Grid key={i} item xs={12} sm={6} lg={4}>
              <PreviewSite
                id={el.id}
                path={pathAdmin}
                icon={el.icon}
                logo={el.logo}
                name={el.name}
                title={el.title}
                url={el.url}
                image={el.image}
                description={el.description}
                accentColor={el.accentColor}
                contributors={el.contributors}
              />
            </Grid>
          );
        })}
      </Grid>
    </StyledListWrap>
  );
};
