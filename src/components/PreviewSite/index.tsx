"use client";
import { FC, memo, ReactNode, useCallback, useMemo } from "react";
import { Avatar, Box, IconButton } from "@mui/material";
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
  StyledCardAuthorStatus,
  StyledAvatarGroup,
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
import { parseProfileEvent } from "@/services/nostr/nostr";

type PreviewSiteType = {
  path?: string;
  isLink?: boolean;
  isPublic?: boolean;
  isLinkToOpenSite?: boolean;
  userPubkey?: string;
  id?: string;
};

export type PreviewSitePropsType = PreviewSiteType &
  Pick<
    ReturnSettingsSiteDataType,
    | "adminPubkey"
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
  logo,
  name,
  title,
  url,
  image,
  contributors: pubkeysContributors,
  accentColor,
  description,
  adminPubkey,
  userPubkey,
  isLink = true,
  isPublic = false,
  isLinkToOpenSite = true,
}: PreviewSitePropsType) {
  // put them all into the same bucket
  pubkeysContributors = useMemo(
    () => [...pubkeysContributors, adminPubkey],
    [pubkeysContributors, adminPubkey]
  );

  if (userPubkey && !pubkeysContributors.includes(userPubkey))
    userPubkey = undefined;

  const { isLoaded: isLoadedLogo } = useImageLoader(logo);
  const { isLoaded: isLoadedImage } = useImageLoader(image);
  const isSeveralAuthor = pubkeysContributors.length > 1;

  const allContributors = useContributors(pubkeysContributors);
  const mainContributorPubkey = userPubkey || adminPubkey;
  const otherPubkeys = pubkeysContributors.filter(
    (p) => p !== mainContributorPubkey
  );

  const main = allContributors.find((c) => c.pubkey === mainContributorPubkey);
  const mainProfile = parseProfileEvent(mainContributorPubkey, main);
  const mainAvatar = mainProfile.img;
  const mainName = mainProfile.name;

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
    [isLink, link]
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

          <StyledCardWrapAuthors>
            <Avatar src={mainAvatar} alt={mainName}>
              <IconPerson />
            </Avatar>
            <Box
              sx={{
                width: "100%",
                color: getContrastingTextColor(accentColor),
              }}
            >
              <StyledCardAuthorName>{mainName}</StyledCardAuthorName>
              <StyledCardAuthorStatus>
                {mainContributorPubkey === adminPubkey
                  ? "Admin"
                  : "Contributor"}
                {isSeveralAuthor && (
                  <StyledAvatarGroup max={3}>
                    {otherPubkeys.map((pubkey, i) => {
                      const profile = allContributors.find(
                        (c) => c.pubkey === pubkey
                      );
                      const info = parseProfileEvent(pubkey, profile);
                      return (
                        <Avatar key={i} alt={info.name} src={info.img || ""}>
                          <IconPerson fontSize="inherit" />
                        </Avatar>
                      );
                    })}
                  </StyledAvatarGroup>
                )}
              </StyledCardAuthorStatus>
            </Box>
          </StyledCardWrapAuthors>
        </StyledWrapFooter>
      </WrapCard>
    </StyledCard>
  );
});
