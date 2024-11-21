"use client";
import { memo, ReactNode } from "react";
import { Avatar, AvatarGroup } from "@mui/material";
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
} from "@/components/PreviewSite/styled";
import { StyledAvatarSite } from "@/components/shared/styled";
import { getContrastingTextColor } from "@/utils/contrasting-color";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import useImageLoader from "@/hooks/useImageLoader";
import { AddImageIcon, BrokenIcon, IconPerson } from "@/components/Icons";
import { nip19 } from "nostr-tools";
import { StyledCardAddImage, StyledTextAddImage } from "./styled";
import useContributors from "@/hooks/useContributors";
import Link from "next/link";

type PreviewDashboardSiteType = {
  actions?: ReactNode;
  settingsLink?: string;
};

export type PreviewDashboardSitePropsType = PreviewDashboardSiteType &
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

export const PreviewDashboardSite = memo(function PreviewDashboardSite({
  icon,
  logo,
  name,
  title,
  url,
  image,
  contributors: pubkeysContributors,
  accentColor,
  description,
  actions,
  settingsLink,
}: PreviewDashboardSitePropsType) {
  const { isLoaded: isLoadedLogo } = useImageLoader(logo);
  const { isLoaded: isLoadedImage } = useImageLoader(image);
  const isSeveralAuthor = pubkeysContributors.length > 1;
  const contributors = useContributors(pubkeysContributors, isSeveralAuthor);
  const prepareContributors =
    contributors.length > 5 ? contributors.slice(0, 5) : contributors;

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
            <Avatar src={icon}>
              <IconPerson />
            </Avatar>
            <StyledCardAuthorName
              sx={{
                color: getContrastingTextColor(accentColor),
              }}
            >
              {name}
            </StyledCardAuthorName>
          </StyledCardWrapAuthors>
        )}
      </StyledWrapFooter>

      {actions}
    </StyledCard>
  );
});
