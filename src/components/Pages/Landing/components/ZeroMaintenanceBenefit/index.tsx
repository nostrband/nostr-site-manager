import {
  StyledLightBenefit,
  StyledTitleBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import { IconZeroMaintenance } from "@/components/Pages/Landing/components/ZeroMaintenanceBenefit/IconZeroMaintenance";
import { StyledIcon } from "@/components/Pages/Landing/components/ZeroMaintenanceBenefit/styled";

export const ZeroMaintenanceBenefit = () => {
  return (
    <StyledLightBenefit id="icon-zero-maintenance">
      <StyledTitleBlock>
        <span>Zero Maintenance.</span> No database to backup, no security issues
        to fix, no performance upgrades, it just works.
      </StyledTitleBlock>

      <StyledIcon>
        <IconZeroMaintenance />
      </StyledIcon>
    </StyledLightBenefit>
  );
};
