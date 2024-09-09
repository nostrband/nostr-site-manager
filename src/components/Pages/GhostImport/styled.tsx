import { styled, Typography } from "@mui/material";

export const StyledTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  margin: "40px 0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "30px",
    margin: "0",
  },
}));
