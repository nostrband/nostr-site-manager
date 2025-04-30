import { SvgIcon } from "@mui/material";
import {
  StyledEmptyBlockIcon,
  StyledEmptyBlockText,
  StyledEmptyBlockWrap,
} from "./styled";
import { DataNotFoundTwoToneIcon } from "@/components/Icons";

interface EmptyBlockProps {
  text?: string;
  icon?: typeof SvgIcon;
}

export const EmptyBlock = ({ text, icon: Icon }: EmptyBlockProps) => {
  const textEmpty = text ? text : "Data Not Found";

  const iconEmpty = Icon ? <Icon /> : <DataNotFoundTwoToneIcon />;

  return (
    <StyledEmptyBlockWrap>
      <StyledEmptyBlockIcon>{iconEmpty}</StyledEmptyBlockIcon>

      <StyledEmptyBlockText variant="h5" color="secondary">
        {textEmpty}
      </StyledEmptyBlockText>
    </StyledEmptyBlockWrap>
  );
};
