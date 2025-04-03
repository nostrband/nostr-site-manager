import { ReactNode } from "react";
import { StyledCard } from "../styled";
import { Typography } from "@mui/material";

interface CardFeatureContentProps {
  title: string;
  children: ReactNode;
}

export const CardFeatureContent = ({
  title,
  children,
}: CardFeatureContentProps) => {
  return (
    <StyledCard>
      <Typography variant="h5">{title}</Typography>
      {children}
    </StyledCard>
  );
};
