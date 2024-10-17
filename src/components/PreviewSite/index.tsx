"use client";
import {
  FC,
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

type PreviewSiteType = {
  path?: string;
  isLink?: boolean;
  isPublic?: boolean;
  isLinkToOpenSite?: boolean;
  id?: string;
};

type PreviewSitePropsType = PreviewSiteType &
  Pick<
    ReturnSettingsSiteDataType,
    | "icon"
    | "adminAvatar"
    | "adminName"
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
  isPublic?: boolean;
}

const CustomLinkComponent = forwardRef<
  HTMLAnchorElement,
  CustomLinkComponentProps
>(({ href, isPublic, ...props }, ref) => (
  <Link
    href={href}
    {...props}
    target={isPublic ? "_blank" : "_self"}
    ref={ref}
  />
));

CustomLinkComponent.displayName = "CustomLinkComponent";

export const PreviewSite = memo(function PreviewSite({
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
  adminAvatar = "",
  adminName = "",
  isLink = true,
  isPublic = false,
  isLinkToOpenSite = true,
}: PreviewSitePropsType) {
  const [isErrorLoadImage, setErrorLoadImage] = useState(false);
  const [isErrorLoadLogo, setErrorLoadLogo] = useState(false);
  const link = isPublic ? url : `${path}/${id}`;

  const WrapCard: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      return (
        <>
          {isLink ? (
            <StyledCardActionArea
              LinkComponent={isLink ? CustomLinkComponent : undefined}
              // @ts-expect-error
              href={isLink ? link : undefined}
              isPublic={isPublic}
            >
              {children}
            </StyledCardActionArea>
          ) : (
            <>{children}</>
          )}
        </>
      );
    },
    [isLink, isPublic, link],
  );

  useEffect(() => {
    const img = new Image();
    img.src = image;

    img.onload = () => {
      setErrorLoadImage(true);
    };

    img.onerror = () => {
      setErrorLoadImage(false);
    };
  }, [image]);

  useEffect(() => {
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      setErrorLoadLogo(true);
    };

    img.onerror = () => {
      setErrorLoadLogo(false);
    };
  }, [logo]);

  return (
    <StyledCard>
      <WrapCard>
        <StyledCardHeader
          avatar={
            isErrorLoadLogo ? (
              <StyledAvatarSite variant="square" src={logo}>
                {name[0]}
              </StyledAvatarSite>
            ) : (
              <StyledAvatarSite variant="square">
                <LanguageOutlinedIcon />
              </StyledAvatarSite>
            )
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
        {isErrorLoadImage ? (
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
            avatar={
              <Avatar src={isPublic ? adminAvatar : icon}>
                {isPublic ? adminName[0] : name[0]}
              </Avatar>
            }
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
                <b>{isPublic ? adminName : name}</b>
              </Box>
            }
          />
        </StyledWrapFooter>
      </WrapCard>
    </StyledCard>
  );
});
