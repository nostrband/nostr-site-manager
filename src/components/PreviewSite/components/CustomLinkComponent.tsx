"use client";
import { forwardRef } from "react";
import Link, { LinkProps } from "next/link";

interface CustomLinkComponentProps extends Omit<LinkProps, "href"> {
  href: LinkProps["href"];
  isPublic?: boolean;
}

export const CustomLinkComponent = forwardRef<
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
