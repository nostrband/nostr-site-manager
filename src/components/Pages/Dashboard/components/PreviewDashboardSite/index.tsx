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
  StyledCardTitleWrap,
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
import { SUBSCRIPTION_PLAN } from "@/consts";
import { SubscriptionPlanBadge } from "@/components/shared/SubscriptionPlanBadge";

type PreviewDashboardSiteType = {
  actions?: ReactNode;
  settingsLink?: string;
  userPubkey?: string;
  subscriptionPlan: SUBSCRIPTION_PLAN;
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
  subscriptionPlan,
}: PreviewDashboardSitePropsType) {
  // put them all into the same bucket
  pubkeysContributors = useMemo(
    () => [...new Set([...pubkeysContributors, adminPubkey])],
    [pubkeysContributors, adminPubkey],
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
    (p) => p !== mainContributorPubkey,
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
          title={
            <StyledCardTitleWrap>
              <StyledCardTitle variant="h6">{title}</StyledCardTitle>
              <SubscriptionPlanBadge subscriptionPlan={subscriptionPlan} />
            </StyledCardTitleWrap>
          }
          subheader={
            <StyledCardSubHeader variant="body5">{url}</StyledCardSubHeader>
          }
        />
      </StyledCardHeaderWrap>

      {isLoadedImage ? (
        <StyledCardMedia component="img" image={image} alt={name} />
      ) : (
        <StyledCardAddImage
          LinkComponent={Link}
          // @ts-expect-error err
          href={`${settingsLink}#image`}
        >
          <AddImageIcon fontSize="inherit" />

          <StyledTextAddImage variant="body4">
            Add a site cover image
          </StyledTextAddImage>
        </StyledCardAddImage>
      )}

      <StyledWrapFooter sx={{ background: `${accentColor}` }}>
        {Boolean(description) && (
          <StyledCardContent>
            <StyledCardDescription
              variant="body5"
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
            <StyledCardAuthorName variant="h7">{mainName}</StyledCardAuthorName>
            <StyledCardAuthorStatus variant="body4">
              {mainContributorPubkey === adminPubkey ? "Admin" : "Contributor"}
              {isSeveralAuthor && (
                <StyledAvatarGroup max={3}>
                  {otherPubkeys.map((pubkey, i) => {
                    const profile = allContributors.find(
                      (c) => c.pubkey === pubkey,
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
