import { Button } from "@mui/material";
import { CustomDomainFormView } from "../../../CustomDomainFormView";
import { useState } from "react";
import { StyledDomain, StyledItemDomain } from "./styled";
import { MaxMinSizeIcon } from "@/components/Icons";

interface ItemDomainProps {
  domain: string;
  siteId: string;
  disabled: boolean;
}

export const ItemDomain = ({ domain, siteId, disabled }: ItemDomainProps) => {
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <StyledItemDomain>
        <StyledDomain>{domain}</StyledDomain>

        <Button
          onClick={handleOpen}
          disabled={disabled}
          variant="text"
          size="small"
          endIcon={<MaxMinSizeIcon color="inherit" fontSize="inherit" />}
        >
          Show DNS
        </Button>
      </StyledItemDomain>

      <CustomDomainFormView
        onClose={handleClose}
        isOpen={isOpen}
        siteId={siteId}
        domain={domain}
      />
    </>
  );
};
