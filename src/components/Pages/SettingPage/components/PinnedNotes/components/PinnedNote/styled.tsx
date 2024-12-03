import { styled } from "@mui/material/styles";
import { Typography, Box, ListItem, Avatar } from "@mui/material";
import { grey } from "@mui/material/colors";

const ITEM_AVATAR_HEIGHT = 54;
const ITEM_AVATAR_WIDTH = 86;

export const StyledIdItem = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "300px",
  fontSize: "12px",
  lineHeight: "19px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "250px",
  },
}));

export const StyledDateItem = styled(Typography)(() => ({
  fontSize: "12px",
  lineHeight: "19px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

export const StyledSummary = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 2,
  textOverflow: "ellipsis",
  maxWidth: "355px",
  fontSize: "12px",
  lineHeight: "19px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "250px",
  },
}));

export const StyledItemWrap = styled(ListItem)(({ theme }) => ({
  background: "#fff",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
  px: 0,
  borderBottom: "1px solid #ececec",
  display: "flex",
  gap: "8px",
  padding: 8,
  border: 0,
  borderRadius: theme.shape.borderRadius,
  flexDirection: "column",
  width: "100%",
  position: "relative",
}));

export const StyledItemWrapDiv = styled(Box)(({ theme }) => ({
  background: "#fff",
  px: 0,
  borderBottom: "1px solid #ececec",
  display: "flex",
  gap: "8px",
  padding: 8,
  flexDirection: "column",
  width: "100%",
  position: "relative",
}));

export const StyledItemAvatar = styled(Avatar)(() => ({
  height: ITEM_AVATAR_HEIGHT,
  width: ITEM_AVATAR_WIDTH,
}));

export const StyledItemNoAvatar = styled(Box)(({ theme }) => ({
  flex: `0 0 ${ITEM_AVATAR_WIDTH}px`,
  background: grey[300],
  display: "flex",
  height: ITEM_AVATAR_HEIGHT,
  width: ITEM_AVATAR_WIDTH,
  borderRadius: theme.shape.borderRadius,
  fontSize: 30,
  color: "#fff",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledItemHead = styled(Box)(() => ({
  display: "flex",
  gap: "10px",
}));

export const StyledTitleItem = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 3,
  textOverflow: "ellipsis",
  fontWeight: "bold",
  fontSize: "14px",
  lineHeight: "18px",
}));
