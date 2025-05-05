import { Typography, TypographyProps } from "@mui/material";
import { StyledTotalAmount } from "./styled";

type TypographyVariant = TypographyProps["variant"];

interface ITotalAmount {
  size?: "large" | "medium" | "small";
  usd: number;
  sats?: number;
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
      {sats && (
        <Typography color="secondary" variant="body4">
          {new Intl.NumberFormat("en-US").format(sats)} {sat}
        </Typography>
      )}
    </StyledTotalAmount>
  );
};
