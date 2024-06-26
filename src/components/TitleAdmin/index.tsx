import { StyledTitleAdmin } from "@/components/TitleAdmin/styled";
import { ReactNode } from "react";

export const TitleAdmin = ({ children }: { children: ReactNode }) => {
  return <StyledTitleAdmin variant="h4">{children}</StyledTitleAdmin>;
};
