import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useCallback, useEffect, useState } from "react";
import {
  StyledDescription,
  StyledDivider,
  StyledEmptyTasks,
  StyledTabPanel,
  StyledTabs,
  StyledTitle,
  StyledWrap,
} from "./styled";
import { TabContext, TabList } from "@mui/lab";
import { Tab } from "@mui/material";
import { CheckCircleIcon, FIleTextIcon } from "@/components/Icons";
import { ItemTask } from "./components/ItemTask";
import { useRouter } from "next/navigation";
import { isNeedMigrateKey } from "@/services/nostr/migrate";
import { TaskType } from "@/types";
import { fetchTasks, setDoneTask } from "@/services/nostr/tasks";
import { MigrateTask } from "./components/MigrateTask";

interface TasksUserProps {
  siteId: string;
}

export const TasksUser = ({ siteId }: TasksUserProps) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  const todoTasks = tasks.filter((el) => !el.isCompleted);
  const completedTasks = tasks.filter((el) => el.isCompleted);

  const [value, setValue] = useState<"todo" | "completed">("todo");
  const [isGutter, setGutter] = useState(false);

  const isMoreThanLimitTodo = todoTasks.length > 3;
  const isMoreThanLimitCompleted = completedTasks.length > 3;

  const isEmptyTodo = todoTasks.length === 0;
  const isEmptyCompleted = completedTasks.length === 0;

  useEffect(() => {
    if (navigator.userAgent.indexOf("Windows") !== -1) {
      setGutter(true);
    }
  }, []);

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: "todo" | "completed"
  ) => {
    setValue(newValue);
  };

  const getTasks = useCallback(async (id: string) => {
    // FIXME use id to
    setLoading(true);
    const tasks = await fetchTasks(id);
    setTasks(tasks);
    setLoading(false);
  }, []);

  const handleOpen = (idTask: string, isCompleted: boolean) => {
    if (isCompleted) {
      const linkSettingsCompleted = `/admin/${siteId}/settings?idTaskCompleted=${idTask}`;

      router.push(linkSettingsCompleted);
    } else {
      setDoneTask(siteId, idTask);
      const linkSettings = `/admin/${siteId}/settings?idTask=${idTask}`;
      router.push(linkSettings);
    }
  };

  useEffect(() => {
    getTasks(siteId);
  }, [getTasks, siteId]);

  return (
    <StyledWrap>
      <StyledDivider />
      <StyledTitle>Let&apos;s Improve It!</StyledTitle>
      <StyledDescription variant="body2">
        One step at a time, slow but steady.
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
              aria-label="Tasks"
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
            <StyledTabPanel
              isMoreThanLimit={isMoreThanLimitTodo}
              isGutter={isGutter}
              value="todo"
            >
              {isNeedMigrateKey(siteId) && <MigrateTask siteId={siteId} />}

              {isEmptyTodo && (
                <StyledEmptyTasks variant="body2">
                  You&apos;ve completed all the tasks
                </StyledEmptyTasks>
              )}

              {todoTasks.map((el, i) => {
                return <ItemTask key={i} task={el} onOpen={handleOpen} />;
              })}
            </StyledTabPanel>
            <StyledTabPanel
              isMoreThanLimit={isMoreThanLimitCompleted}
              isGutter={isGutter}
              value="completed"
            >
              {isEmptyCompleted && (
                <StyledEmptyTasks variant="body2">
                  No completed tasks yet
                </StyledEmptyTasks>
              )}

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
