import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import { StyledAppBar } from "@/components/Layout/Header/styled";
import useResponsive from "@/hooks/useResponsive";

interface IHeader {
  handleOpen: () => void;
}

export const Header = ({ handleOpen }: IHeader) => {
  const isDesktop = useResponsive("up", "lg");

  if (isDesktop) {
    return null;
  }

  return (
    <StyledAppBar isDesktop={isDesktop}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleOpen}
        >
          <MenuTwoToneIcon />
        </IconButton>
        <Box></Box>
      </Toolbar>
    </StyledAppBar>
  );
};
