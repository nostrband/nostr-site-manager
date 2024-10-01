"use client";
import * as React from "react";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import {
  StyledButtonAdd,
  StyledListWrap,
  StyledTitle,
} from "@/components/ListSites/styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { Grid } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { PreviewSite } from "@/components/PreviewSite";
import Link from "next/link";

type ListSitesType = {
  data: ReturnSettingsSiteDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const pathAdmin = useFirstPathElement();

  return (
    <>
      <StyledTitle variant="h4">
        Your websites
        <StyledButtonAdd
          LinkComponent={Link}
          href="/admin/add"
          color="decorate"
          variant="contained"
        >
          <span>Add website</span>
          <AddCircleOutlineOutlinedIcon fontSize="small" />
        </StyledButtonAdd>
      </StyledTitle>
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
    </>
  );
};
