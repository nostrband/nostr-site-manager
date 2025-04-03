import { StyledText, StyledTotalAmountDescription } from "./styled";
import { ReactNode } from "react";

interface ITotalAmountDescription {
  children: ReactNode;
  description: string;
}

export const TotalAmountDescription = ({
  children,
  description,
}: ITotalAmountDescription) => {
  return (
    <StyledTotalAmountDescription>
      <StyledText variant="body5">{description}</StyledText>

      {children}
    </StyledTotalAmountDescription>
  );
};
