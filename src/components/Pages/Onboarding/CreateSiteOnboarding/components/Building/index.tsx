import {
  StyledAlert,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import { CircularProgress, Typography } from "@mui/material";
import { StyledBuildingProgress, StyledBuildingProgressText } from "../styled";

interface BuildingProps {
  progress: number;
}

export const Building = ({ progress }: BuildingProps) => {

  return (
    <>
      <StyledBuildingProgress>
        <CircularProgress
          color="decorate"
          variant="determinate"
          value={progress}
        />
        <StyledBuildingProgressText>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >{`${Math.round(progress)}%`}</Typography>
        </StyledBuildingProgressText>
      </StyledBuildingProgress>
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
