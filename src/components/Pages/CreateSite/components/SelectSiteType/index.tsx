import { CheckCircleIcon, ChevronLeftIcon } from "@/components/Icons";
import { Box, Chip, Menu, MenuItem, Typography } from "@mui/material";
import { useRef, useState } from "react";
import {
  StyledMenuItemContent,
  StyledSelectButton,
  StyledSelectButtonSubText,
  StyledSelectButtonText,
} from "../../styled";
import {
  StyledTitle,
  StyledWrapBlock,
  StyledWrapChip,
} from "../StartScreen/styled";
import { LIST_SITE_TYPES } from "@/consts";
import { SelectTypeSite } from "@/types";

interface SelectSiteTypeProps {
  recomendType: SelectTypeSite;
  typeSite: SelectTypeSite;
  setTypeSite: (value: SelectTypeSite) => void;
}

export const SelectSiteType = ({
  recomendType,
  typeSite,
  setTypeSite,
}: SelectSiteTypeProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const buttonRef = useRef<HTMLElement>(null);

  const isRecomended = recomendType.type !== typeSite.type;

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectType = (value: SelectTypeSite) => {
    handleClose();
    setTypeSite(value);
  };

  return (
    <>
      <StyledWrapBlock ref={buttonRef} id="basic-button">
        <StyledTitle>Site Type</StyledTitle>

        <Typography typography={"body2"}>
          Pre-populate the site design theme and features to suit the chosen
          type. Can be adjusted later.
        </Typography>

        {isRecomended && (
          <StyledWrapChip>
            <Chip
              icon={<CheckCircleIcon fontSize="inherit" />}
              size="small"
              color="secondary"
              label={`Recomended: ${recomendType.typename}`}
            />
          </StyledWrapChip>
        )}

        <StyledSelectButton
          onClick={handleClick}
          fullWidth
          endIcon={<ChevronLeftIcon />}
          isOpen={isOpen}
          color="secondary"
        >
          <Box>
            <StyledSelectButtonText>{typeSite.typename}</StyledSelectButtonText>
            <StyledSelectButtonSubText variant="body2">
              {typeSite.description}
            </StyledSelectButtonSubText>
          </Box>
        </StyledSelectButton>
      </StyledWrapBlock>

      {buttonRef.current && (
        <Menu
          id="basic-menu"
          anchorEl={buttonRef.current}
          open={isOpen}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          slotProps={{
            paper: {
              sx: {
                maxHeight: "280px",
                marginTop: "8px",
                width: buttonRef.current
                  ? buttonRef.current.offsetWidth
                  : "auto",
              },
            },
          }}
        >
          {LIST_SITE_TYPES.map((el, i) => (
            <MenuItem key={i} onClick={() => handleSelectType(el)}>
              <StyledMenuItemContent>
                <StyledSelectButtonText>{el.typename}</StyledSelectButtonText>
                <StyledSelectButtonSubText variant="body2">
                  {el.description}
                </StyledSelectButtonSubText>
              </StyledMenuItemContent>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
