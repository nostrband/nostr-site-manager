"use client";
import { memo, ReactNode, useMemo } from "react";
import { Avatar, Box } from "@mui/material";
import {
  StyledCard,
  StyledWrapFooter,
  StyledCardHeader,
  StyledCardHeaderWrap,
  StyledCardSubHeader,
  StyledCardTitle,
  StyledCardMedia,
  StyledCardDescription,
  StyledCardContent,
  StyledCardWrapAuthors,
  StyledCardAuthorName,
  StyledAvatarGroup,
  StyledCardAuthorStatus,
} from "@/components/PreviewSite/styled";
import { StyledAvatarSite } from "@/components/shared/styled";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import useImageLoader from "@/hooks/useImageLoader";
import { AddImageIcon, BrokenIcon, IconPerson } from "@/components/Icons";
import { StyledCardAddImage, StyledTextAddImage } from "./styled";
import useContributors from "@/hooks/useContributors";
import Link from "next/link";
import { parseProfileEvent } from "@/services/nostr/nostr";

type PreviewDashboardSiteType = {
  actions?: ReactNode;
  settingsLink?: string;
  userPubkey?: string;
};

export type PreviewDashboardSitePropsType = PreviewDashboardSiteType &
  Pick<
    ReturnSettingsSiteDataType,
    | "description"
    | "contributors"
    | "adminPubkey"
    | "image"
    | "name"
    | "logo"
    | "accentColor"
    | "url"
    | "title"
  >;

export const PreviewDashboardSite = memo(function PreviewDashboardSite({
  logo,
  name,
  title,
  url,
  image,
  adminPubkey,
  userPubkey,
  contributors: pubkeysContributors,
  accentColor,
  description,
  actions,
  settingsLink,
}: PreviewDashboardSitePropsType) {
  // put them all into the same bucket
  pubkeysContributors = useMemo(
    () => [...pubkeysContributors, adminPubkey],
    [pubkeysContributors, adminPubkey]
  );

  // reset userPubkey if they're not a contributor
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

  return (
    <StyledCard>
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
      </StyledCardHeaderWrap>

      {isLoadedImage ? (
        <StyledCardMedia component="img" image={image} alt={name} />
      ) : (
        <StyledCardAddImage
          LinkComponent={(props) => <Link {...props} />}
          // @ts-expect-error
          href={`${settingsLink}#image`}
        >
          <AddImageIcon fontSize="inherit" />

          <StyledTextAddImage>Add a website cover image</StyledTextAddImage>
        </StyledCardAddImage>
      )}

      <StyledWrapFooter sx={{ background: `${accentColor}` }}>
        {Boolean(description) && (
          <StyledCardContent>
            <StyledCardDescription
              variant="body2"
              color={getContrastingTextColor(accentColor)}
            >
              {description}
            </StyledCardDescription>
          </StyledCardContent>
        )}

        <StyledCardWrapAuthors>
          <Avatar src={mainAvatar || ""} alt={mainName}>
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
              {mainContributorPubkey === adminPubkey ? "Admin" : "Contributor"}
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
      {actions}
    </StyledCard>
  );
});
