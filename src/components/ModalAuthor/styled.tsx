import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledAuthor = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
}));
