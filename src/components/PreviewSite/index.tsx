"use client";
import { FC, memo, ReactNode, useCallback } from "react";
import { Avatar, AvatarGroup, IconButton } from "@mui/material";
import {
  StyledCard,
  StyledWrapFooter,
  StyledCardActionArea,
  StyledCardNoImage,
  StyledCardHeader,
  StyledCardHeaderWrap,
  StyledCardSubHeader,
  StyledCardTitle,
  StyledCardMedia,
  StyledCardDescription,
  StyledCardContent,
  StyledCardWrapAuthors,
  StyledCardAuthorName,
} from "./styled";
import { StyledAvatarSite } from "@/components/shared/styled";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import useImageLoader from "@/hooks/useImageLoader";
import { CustomLinkComponent } from "./components/CustomLinkComponent";
import {
  BrokenBigIcon,
  BrokenIcon,
  IconLink,
  IconPerson,
} from "@/components/Icons";
import { nip19 } from "nostr-tools";
import useContributors from "@/hooks/useContributors";

type PreviewSiteType = {
  path?: string;
  isLink?: boolean;
  isPublic?: boolean;
  isLinkToOpenSite?: boolean;
  id?: string;
};

export type PreviewSitePropsType = PreviewSiteType &
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

export const PreviewSite = memo(function PreviewSite({
  id,
  path,
  icon,
  logo,
  name,
  title,
  url,
  image,
  contributors: pubkeysContributors,
  accentColor,
  description,
  adminAvatar = "",
  adminName = "",
  isLink = true,
  isPublic = false,
  isLinkToOpenSite = true,
}: PreviewSitePropsType) {
  const { isLoaded: isLoadedLogo } = useImageLoader(logo);
  const { isLoaded: isLoadedImage } = useImageLoader(image);
  const isSeveralAuthor = pubkeysContributors.length > 1;
  const contributors = useContributors(pubkeysContributors, isSeveralAuthor);
  const prepareContributors =
    contributors.length > 5 ? contributors.slice(0, 5) : contributors;
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
            >
              {children}
            </StyledCardActionArea>
          ) : (
            <>{children}</>
          )}
        </>
      );
    },
    [isLink, link],
  );

  return (
    <StyledCard isLink={isLink}>
      <WrapCard>
        <StyledCardHeaderWrap>
          <StyledCardHeader
            avatar={
              isLoadedLogo ? (
                <StyledAvatarSite variant="square" src={logo}>
                  {name[0]}
                </StyledAvatarSite>
              ) : (
                <StyledAvatarSite variant="square">
                  <BrokenIcon fontSize="inherit" />
                </StyledAvatarSite>
              )
            }
            title={<StyledCardTitle>{title}</StyledCardTitle>}
            subheader={<StyledCardSubHeader>{url}</StyledCardSubHeader>}
          />
          {isLinkToOpenSite && (
            <IconButton
              aria-label={`open site ${name}`}
              size="small"
              onClick={(e) => {
                e.stopPropagation();

                window.open(url);
              }}
              sx={{ color: "#696F7D" }}
            >
              <IconLink fontSize="inherit" />
            </IconButton>
          )}
        </StyledCardHeaderWrap>

        {isLoadedImage ? (
          <StyledCardMedia component="img" image={image} alt={name} />
        ) : (
          <StyledCardNoImage>
            <BrokenBigIcon fontSize="inherit" sx={{ margin: "auto" }} />
          </StyledCardNoImage>
        )}

        <StyledWrapFooter sx={{ background: `${accentColor}` }}>
          <StyledCardContent>
            <StyledCardDescription
              variant="body2"
              color={getContrastingTextColor(accentColor)}
            >
              {description}
            </StyledCardDescription>
          </StyledCardContent>

          {isSeveralAuthor ? (
            <StyledCardWrapAuthors>
              <AvatarGroup spacing={20.5}>
                {contributors.length
                  ? prepareContributors.map((el, i) => {
                      let meta = JSON.parse(el.content);

                      const npub = el.pubkey
                        ? nip19.npubEncode(el.pubkey).substring(0, 8) + "..."
                        : "";
                      const nameAuthor = meta.display_name || meta.name || npub;
                      const img = meta.picture || "";

                      return (
                        <Avatar key={i} alt={nameAuthor} src={img}>
                          <IconPerson />
                        </Avatar>
                      );
                    })
                  : pubkeysContributors.map((_, i) => {
                      return (
                        <Avatar key={i}>
                          <IconPerson />
                        </Avatar>
                      );
                    })}
              </AvatarGroup>
              <StyledCardAuthorName
                sx={{
                  color: getContrastingTextColor(accentColor),
                }}
              >
                {pubkeysContributors.length} authors
              </StyledCardAuthorName>
            </StyledCardWrapAuthors>
          ) : (
            <StyledCardWrapAuthors>
              <Avatar src={isPublic ? adminAvatar : icon}>
                <IconPerson />
              </Avatar>
              <StyledCardAuthorName
                sx={{
                  color: getContrastingTextColor(accentColor),
                }}
              >
                {isPublic ? adminName : name}
              </StyledCardAuthorName>
            </StyledCardWrapAuthors>
          )}
        </StyledWrapFooter>
      </WrapCard>
    </StyledCard>
  );
});
