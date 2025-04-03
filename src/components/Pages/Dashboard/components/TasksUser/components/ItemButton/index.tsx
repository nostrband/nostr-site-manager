import { ChevronLeftIcon, KeyIcon } from "@/components/Icons";
import {
  StyledIcon,
  StyledIconChevron,
  StyledText,
  StyledWrap,
} from "../styled";
import { CircularProgress } from "@mui/material";

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

      <StyledText>Connect keys</StyledText>

      <StyledIconChevron>
        <ChevronLeftIcon />
      </StyledIconChevron>
    </StyledWrap>
  );
};
