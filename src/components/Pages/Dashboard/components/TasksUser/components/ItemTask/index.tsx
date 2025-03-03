import { CheckIcon, ChevronLeftIcon, CircleIcon } from "@/components/Icons";
import {
  StyledIcon,
  StyledIconChevron,
  StyledText,
  StyledWrap,
} from "../styled";
import { TaskType } from "@/types";

interface ItemTaskProps {
  task: TaskType;
  onOpen: (id: string) => void;
}

export const ItemTask = ({ task, onOpen }: ItemTaskProps) => {
  const { isCompleted, id } = task;
  const handleOpen = () => {
    if (!isCompleted) {
      onOpen(id);
    }
  };

  return (
    <StyledWrap isCompleted={isCompleted} onClick={handleOpen}>
      <StyledIcon isCompleted={isCompleted}>
        {isCompleted ? <CheckIcon /> : <CircleIcon />}
      </StyledIcon>

      <StyledText>{task.text}</StyledText>

      {!isCompleted && (
        <StyledIconChevron>
          <ChevronLeftIcon />
        </StyledIconChevron>
      )}
    </StyledWrap>
  );
};
