import {
  StyledDescriptionPage,
  StyledTitlePage,
} from "../Pages/Onboarding/styled";
import { StyledAlert } from "./styled";
import { BuildLoader } from "../BuildLoader";

export const BuildingScreen = () => {
  return (
    <>
      <BuildLoader />
      <StyledTitlePage>We are making your sample website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        It takes 10-20 seconds to create a website, please stand by.
      </StyledDescriptionPage>
      <StyledAlert severity="info">
        We are populating the site with content from Nostr. You can change site
        settings and manage the content later on inside your dashboard.
      </StyledAlert>
    </>
  );
};
