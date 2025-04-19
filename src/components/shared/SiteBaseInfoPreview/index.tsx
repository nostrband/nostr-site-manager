import { BrokenIcon } from "@/components/Icons";
import {
  StyledCardHeader,
  StyledCardSubHeader,
  StyledCardTitle,
} from "../PreviewSite/styled";
import { StyledAvatarSite } from "../styled";
import useImageLoader from "@/hooks/useImageLoader";

export type SiteBaseInfoPreviewProps = {
  siteInfo: {
    logo: string;
    name: string;
    title: string;
    url: string;
  };
};

export const SiteBaseInfoPreview = ({ siteInfo }: SiteBaseInfoPreviewProps) => {
  const { logo, name, title, url } = siteInfo;
  const { isLoaded: isLoadedLogo } = useImageLoader(logo);

  return (
    <StyledCardHeader
      avatar={
        isLoadedLogo ? (
          <StyledAvatarSite variant="square" src={logo}>
            {name}
          </StyledAvatarSite>
        ) : (
          <StyledAvatarSite variant="square">
            <BrokenIcon fontSize="inherit" />
          </StyledAvatarSite>
        )
      }
      title={<StyledCardTitle variant="h6">{title}</StyledCardTitle>}
      subheader={
        <StyledCardSubHeader variant="body5">{url}</StyledCardSubHeader>
      }
    />
  );
};
