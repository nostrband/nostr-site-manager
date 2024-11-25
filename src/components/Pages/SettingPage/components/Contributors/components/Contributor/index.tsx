"use client";
import { IconPerson } from "@/components/Icons";
import useImageLoader from "@/hooks/useImageLoader";
import { Avatar } from "@mui/material";
import { memo } from "react";

export const ContributorAvatar = memo(
  ({ alt, src }: { alt: string; src: string }) => {
    const { isLoaded } = useImageLoader(src);

    return (
      <>
        {isLoaded ? (
          <Avatar src={src} alt={alt} />
        ) : (
          <Avatar alt={alt}>
            <IconPerson fontSize="inherit" />
          </Avatar>
        )}
      </>
    );
  },
);

ContributorAvatar.displayName = "ContributorAvatar";
