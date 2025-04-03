import { Typography, TypographyProps } from "@mui/material";
import { StyledTotalAmount } from "./styled";

type TypographyVariant = TypographyProps["variant"];

interface ITotalAmount {
  size?: "large" | "medium" | "small";
  usd: string;
  sats: string;
}

export const TotalAmount = ({ size = "large", usd, sats }: ITotalAmount) => {
  const usdSizeMap: Record<
    "large" | "medium" | "small",
    NonNullable<TypographyVariant>
  > = {
    large: "h4",
    medium: "h5",
    small: "subtitle3",
  };

  const usdSize = usdSizeMap[size];

  const sat = size === "large" ? "SAT" : "sat";

  return (
    <StyledTotalAmount>
      <Typography component="div" variant={usdSize}>
        {usd} USD
      </Typography>
      <Typography color="secondary" variant="body4">
        {sats} {sat}
      </Typography>
    </StyledTotalAmount>
  );
};
