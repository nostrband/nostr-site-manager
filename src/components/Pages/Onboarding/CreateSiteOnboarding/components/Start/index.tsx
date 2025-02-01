import { Button } from "@mui/material";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import Link from "next/link";
import { SCREEN, TypesScreens } from "@/consts";

interface StartProps {
  setScreen: (screen: TypesScreens) => void;
}

export const Start = ({setScreen}: StartProps) => {
  const handleBuilding = () => {
    setScreen(SCREEN.BUILDING)
  }

  return (
    <>
      <StyledTitlePage>Hello Username, Let&apos;s Build a Sample Website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Unleash Your Creativity with Our Easy-to-Use Website Builder!
      </StyledDescriptionPage>
      <StyledActions>
        <Button
          LinkComponent={Link}
          href="/admin"
          fullWidth
          size="large"
          color="decorate"
          variant="outlined"
        >
          Skip
        </Button>
        <Button
          onClick={handleBuilding}
          fullWidth
          size="large"
          color="decorate"
          variant="contained"
        >
          Create a site
        </Button>
      </StyledActions>
    </>
  );
};
