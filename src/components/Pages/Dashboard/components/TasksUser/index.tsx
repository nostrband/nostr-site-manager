import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useCallback, useEffect, useState } from "react";
import {
  StyledDescription,
  StyledDivider,
  StyledTabPanel,
  StyledTabs,
  StyledTitle,
  StyledWrap,
} from "./styled";
import { TabContext, TabList } from "@mui/lab";
import { Tab } from "@mui/material";
import { CheckCircleIcon, FIleTextIcon } from "@/components/Icons";
import { ItemTask, TaskType } from "./components/ItemTask";
import { useRouter } from "next/navigation";

interface TasksUserProps {
  id: string;
}

const mockTasks: TaskType[] = [
  {
    text: "Title task",
    isCompleted: false,
    paymentPlan: "base",
    id: "838y3737",
  },
  {
    text: "Icon task",
    isCompleted: false,
    paymentPlan: "pro",
    id: "73g7f38",
  },
  {
    text: "Navigation task",
    isCompleted: false,
    paymentPlan: "base",
    id: "h37f3",
  },
  {
    text: "Theme task",
    isCompleted: false,
    paymentPlan: "base",
    id: "38jfhu",
  },
  {
    text: "Task 5",
    isCompleted: true,
    paymentPlan: "base",
    id: "734gf73f",
  },
];

export const TasksUser = ({ id }: TasksUserProps) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  const todoTasks = tasks.filter((el) => !el.isCompleted);
  const completedTasks = tasks.filter((el) => el.isCompleted);

  const [value, setValue] = useState<"todo" | "completed">("todo");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: "todo" | "completed",
  ) => {
    setValue(newValue);
  };

  const getTasks = useCallback((id: string) => {
    setLoading(true);
    setTimeout(() => {
      console.log(id);

      setTasks(mockTasks);
      setLoading(false);
    }, 100);
  }, []);

  const handleOpen = (idTask: string) => {
    const linkSettings = `/admin/${id}/settings?idTask=${idTask}`;

    router.push(linkSettings);
  };

  useEffect(() => {
    getTasks(id);
  }, [getTasks, id]);

  return (
    <StyledWrap>
      <StyledDivider />
      <StyledTitle>Your Task List Awaits!</StyledTitle>
      <StyledDescription variant="body2">
        Exploring new horizons: a journey of discovery
      </StyledDescription>
      {isLoading ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <StyledTabs>
          <TabContext value={value}>
            <TabList
              variant="fullWidth"
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              <Tab
                icon={<FIleTextIcon />}
                iconPosition="start"
                label="To do"
                value="todo"
              />
              <Tab
                icon={<CheckCircleIcon />}
                iconPosition="start"
                label="Completed"
                value="completed"
              />
            </TabList>
            <StyledTabPanel value="todo">
              {todoTasks.map((el, i) => {
                return <ItemTask key={i} task={el} onOpen={handleOpen} />;
              })}
            </StyledTabPanel>
            <StyledTabPanel value="completed">
              {completedTasks.map((el, i) => {
                return <ItemTask key={i} task={el} onOpen={handleOpen} />;
              })}
            </StyledTabPanel>
          </TabContext>
        </StyledTabs>
      )}
    </StyledWrap>
  );
};
