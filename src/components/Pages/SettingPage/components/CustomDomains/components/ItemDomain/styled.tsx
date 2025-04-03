import { styled } from "@mui/material/styles";
import { Box, Typography, TypographyProps } from "@mui/material";

export const StyledDomain = styled((props: TypographyProps) => {
  return <Typography variant="body5" {...props} />;
})();

export const StyledItemDomain = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
}));
