"use client";
import { FC, forwardRef, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import {
  StyledCard,
  StyledWrapFooter,
  StyledCardActionArea,
  StyledCardNoImage,
  StyledCardHeader,
} from "./styled";
import { StyledAvatarSite } from "@/components/shared/styled";
import LaunchIcon from "@mui/icons-material/Launch";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

type PreviewSiteType = {
  path?: string;
  isLink?: boolean;
  isPublick?: boolean;
  isLinkToOpenSite?: boolean;
  id?: string;
};

type PreviewSitePropsType = PreviewSiteType &
  Pick<
    ReturnSettingsSiteDataType,
    | "icon"
    | "description"
    | "contributors"
    | "image"
    | "name"
    | "logo"
    | "accentColor"
    | "url"
    | "title"
  >;

interface CustomLinkComponentProps extends Omit<LinkProps, "href"> {
  href: LinkProps["href"];
  isPublick?: boolean;
}

const CustomLinkComponent = forwardRef<
  HTMLAnchorElement,
  CustomLinkComponentProps
>(({ href, isPublick, ...props }, ref) => (
  <Link
    href={href}
    {...props}
    target={isPublick ? "_blank" : "_self"}
    ref={ref}
  />
));

CustomLinkComponent.displayName = "CustomLinkComponent";

export const PreviewSite = ({
  id,
  path,
  icon,
  logo,
  name,
  title,
  url,
  image,
  contributors,
  accentColor,
  description,
  isLink = true,
  isPublick = false,
  isLinkToOpenSite = true,
}: PreviewSitePropsType) => {
  const link = isPublick ? url : `${path}/${id}`;

  const WrapCard: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <>
        {isLink ? (
          <StyledCardActionArea
            LinkComponent={isLink ? CustomLinkComponent : undefined}
            // @ts-expect-error
            href={isLink ? link : undefined}
          >
            {children}
          </StyledCardActionArea>
        ) : (
          <>{children}</>
        )}
      </>
    );
  };

  return (
    <StyledCard>
      <WrapCard>
        <StyledCardHeader
          avatar={
            <StyledAvatarSite variant="square" src={logo}>
              {name}
            </StyledAvatarSite>
          }
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <b>{title}</b>{" "}
              {isLinkToOpenSite && (
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();

                    window.open(url);
                  }}
                >
                  <LaunchIcon fontSize="inherit" />
                </IconButton>
              )}
            </Box>
          }
          subheader={<Box>{url}</Box>}
        />
        {Boolean(image) ? (
          <CardMedia
            component="img"
            height="194"
            image={image}
            alt={name}
            sx={{ flex: "0 0 194px" }}
          />
        ) : (
          <StyledCardNoImage>
            <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
          </StyledCardNoImage>
        )}
        <StyledWrapFooter sx={{ background: `${accentColor}` }}>
          <CardContent>
            <Typography
              variant="body2"
              color={getContrastingTextColor(accentColor)}
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
              {description}
            </Typography>
          </CardContent>
          <CardHeader
            sx={{ marginTop: "auto" }}
            avatar={<Avatar src={icon}>{contributors[0]}</Avatar>}
            title={
              <Box
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "140px",
                  color: getContrastingTextColor(accentColor),
                }}
              >
                <b>{name || contributors[0]}</b>
              </Box>
            }
          />
        </StyledWrapFooter>
      </WrapCard>
    </StyledCard>
  );
};
