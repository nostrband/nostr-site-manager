import { ChevronLeftIcon, KeyIcon } from "@/components/Icons";
import { StyledIcon, StyledIconChevron, StyledWrap } from "../styled";
import { CircularProgress, Typography } from "@mui/material";

interface ItemButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ItemButton = ({ onClick, isLoading }: ItemButtonProps) => {
  const handleClick = () => {
    if (!isLoading) {
      onClick();
    }
  };

  return (
    <StyledWrap onClick={handleClick}>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <StyledIcon>
          <KeyIcon />
        </StyledIcon>
      )}

      <Typography variant="subtitle4">Connect keys</Typography>

      <StyledIconChevron>
        <ChevronLeftIcon />
      </StyledIconChevron>
    </StyledWrap>
  );
};
