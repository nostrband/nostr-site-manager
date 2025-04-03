import {
  StyledDescriptionPage,
  StyledTitlePage,
} from "../Pages/Onboarding/styled";
import { StyledAlert } from "./styled";
import { BuildLoader } from "../BuildLoader";

export const BuildingScreen = () => {
  return (
    <>
      <StyledTitlePage>Preparing your site</StyledTitlePage>
      <StyledDescriptionPage variant="body3">
        It takes 10-20 seconds, please wait
      </StyledDescriptionPage>
      <StyledAlert severity="info">
        We are populating the site with data from Nostr. You can change site
        settings and manage the content later from the site dashboard.
      </StyledAlert>
      <BuildLoader />
    </>
  );
};
