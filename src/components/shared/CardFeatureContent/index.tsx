import { ReactNode } from "react";
import { StyledCard, StyledCardTitleFeature } from "../styled";

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
      <StyledCardTitleFeature>{title}</StyledCardTitleFeature>
      {children}
    </StyledCard>
  );
};
