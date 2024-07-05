"use client";
import * as React from "react";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { StyledListWrap } from "@/components/ListSites/styled";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from "@mui/material";
import { getContrastingTextColor } from "@/utils/contrasting-color";

type ListSitesType = {
  data: ReturnSettingsSiteDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const router = useRouter();
  const pathAdmin = useFirstPathElement();

  const handleSelect = (id: string) => {
    router.push(`${pathAdmin}/${id}`);
  };

  const getColor = (color: string | null) =>
    getContrastingTextColor(color ? color : "#fff");

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
              <Card
                sx={{ width: "100%", height: "100%" }}
                onClick={() => handleSelect(el.id)}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardHeader
                    avatar={<Avatar src={el.logo}>{el.name}</Avatar>}
                    title={<b>{el.title}</b>}
                  />
                  {Boolean(el.image) ? (
                    <CardMedia
                      component="img"
                      height="194"
                      image={el.image}
                      alt={el.name}
                    />
                  ) : (
                    <Box
                      sx={{
                        background: "#ececec",
                        display: "flex",
                        height: "194px",
                        width: "100%",
                      }}
                    >
                      <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
                    </Box>
                  )}
                  <Box sx={{ height: "100%", background: `${el.accentColor}` }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color={getColor(el.accentColor)}
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
                            color: getColor(el.accentColor),
                          }}
                        >
                          <b>{el.name || el.contributors[0]}</b>
                        </Box>
                      }
                      // subheader={
                      //   <Box
                      //     sx={{
                      //       color: getColor(el.accentColor),
                      //       opacity: 0.7,
                      //     }}
                      //   >
                      //     contributer
                      //   </Box>
                      // }
                    />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </StyledListWrap>
  );
};
