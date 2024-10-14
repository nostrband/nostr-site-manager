import { styled } from "@mui/material/styles";
import { Typography, Box, ListItem, Avatar } from "@mui/material";

export const StyledIdItem = styled(Typography)(({theme}) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "355px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "250px",
  },
}));

export const StyledSummary = styled(Typography)(({theme}) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 2,
  textOverflow: "ellipsis",
  maxWidth: "355px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "250px",
  },
}));

export const StyledTitleItem = styled(Typography)(({theme}) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: "bold",
  maxWidth: "355px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "250px",
  },
}));

export const StyledWrapInfo = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  alignItems: "flex-start",
  width: "100%",
}));

export const StyledSecondaryAction = styled(Box)(() => ({
  position: "absolute",
  right: "0",
  bottom: "5px",
}));

export const StyledItemWrap = styled(ListItem)(({ theme }) => ({
  px: 0,
  borderBottom: "1px solid #ececec",
  display: "flex",
  gap: "10px",
  paddingRight: 0,
  paddingLeft: 0,
  paddingBottom: 10,
  alignItems: "flex-start !importnat",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

export const StyledItemAvatar = styled(Avatar)(({ theme }) => ({
  height: "70px",
  width: "100px",
  marginBottom: "auto",
  [theme.breakpoints.down("sm")]: {
    height: "100px",
    width: "100%",
  },
}));
