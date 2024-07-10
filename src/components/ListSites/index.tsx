"use client";
import * as React from "react";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import LaunchIcon from "@mui/icons-material/Launch";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import {
  StyledCard,
  StyledCardActionArea,
  StyledCardHeader,
  StyledCardNoImage,
  StyledListWrap,
  StyledWrapFooter,
} from "@/components/ListSites/styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { Box, CardContent, CardHeader, CardMedia, Grid } from "@mui/material";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import IconButton from "@mui/material/IconButton";
import {StyledAvatarSite} from "@/components/shared/styled";

type ListSitesType = {
  data: ReturnSettingsSiteDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const router = useRouter();
  const pathAdmin = useFirstPathElement();

  const handleSelect = (id: string) => {
    router.push(`${pathAdmin}/${id}`);
  };

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
              <StyledCard onClick={() => handleSelect(el.id)}>
                <StyledCardActionArea>
                  <StyledCardHeader
                    avatar={
                      <StyledAvatarSite variant="square" src={el.logo}>
                        {el.name}
                      </StyledAvatarSite>
                    }
                    title={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <b>{el.title}</b>{" "}
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();

                            window.open(el.url);
                          }}
                        >
                          <LaunchIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    }
                    subheader={<Box>{el.url}</Box>}
                  />
                  {Boolean(el.image) ? (
                    <CardMedia
                      component="img"
                      height="194"
                      image={el.image}
                      alt={el.name}
                      sx={{ flex: "0 0 194px" }}
                    />
                  ) : (
                    <StyledCardNoImage>
                      <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
                    </StyledCardNoImage>
                  )}
                  <StyledWrapFooter sx={{ background: `${el.accentColor}` }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color={getContrastingTextColor(el.accentColor)}
                        sx={{
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          wordWrap: "break-word",
                        }}
                      >
                        {el.description}
                      </Typography>
                    </CardContent>
                    <CardHeader
                      sx={{ marginTop: "auto" }}
                      avatar={
                        <Avatar src={el.icon}>{el.contributors[0]}</Avatar>
                      }
                      title={
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "140px",
                            color: getContrastingTextColor(el.accentColor),
                          }}
                        >
                          <b>{el.name || el.contributors[0]}</b>
                        </Box>
                      }
                    />
                  </StyledWrapFooter>
                </StyledCardActionArea>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>
    </StyledListWrap>
  );
};
