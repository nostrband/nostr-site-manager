import { styled } from "@mui/material/styles";
import { Box, Typography, TypographyProps } from "@mui/material";

export const StyledDomain = styled((props: TypographyProps) => {
  return <Typography variant="body2" {...props} />;
})({
  fontSize: 12,
  fontWeight: "400",
  lineHeight: "19px",
});

export const StyledItemDomain = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
}));
