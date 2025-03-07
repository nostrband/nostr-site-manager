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
import { ItemTask } from "./components/ItemTask";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import {
  isNeedMigrateKey,
  migrateToConnectedKey,
} from "@/services/nostr/migrate";
import { ItemButton } from "./components/ItemButton";
import { TaskType } from "@/types";
import { fetchTasks, setDoneTask } from "@/services/nostr/tasks";

interface TasksUserProps {
  id: string;
}

export const TasksUser = ({ id }: TasksUserProps) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoadingConnectKeys, setLoadingConnectKeys] = useState(false);

  const todoTasks = tasks.filter((el) => !el.isCompleted);
  const completedTasks = tasks.filter((el) => el.isCompleted);

  const [value, setValue] = useState<"todo" | "completed">("todo");
  const [isGutter, setGutter] = useState(false);

  const isMoreThanLimitTodo = todoTasks.length > 3;
  const isMoreThanLimitCompleted = completedTasks.length > 3;

  useEffect(() => {
    if (navigator.userAgent.indexOf("Windows") !== -1) {
      setGutter(true);
    }
  }, []);

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: "todo" | "completed",
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
      const linkSettingsCompleted = `/admin/${id}/settings?idTaskCompleted=${idTask}`;

      router.push(linkSettingsCompleted);
    } else {
      setDoneTask(id, idTask);
      const linkSettings = `/admin/${id}/settings?idTask=${idTask}`;
      router.push(linkSettings);
    }
  };

  const handleConnectKeys = async () => {
    setLoadingConnectKeys(true);

    try {
      const newSiteId = await migrateToConnectedKey(id);
      enqueueSnackbar("Keys connected!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      
      setTimeout(() => {
        setLoadingConnectKeys(false);

        router.push(`/admin/${newSiteId}`);
      }, 500);
    } catch (e: any) {
      setLoadingConnectKeys(false);

      console.log("error", e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
    }
  };

  useEffect(() => {
    getTasks(id);
  }, [getTasks, id]);

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
              {isNeedMigrateKey(id) && (
                <ItemButton
                  isLoading={isLoadingConnectKeys}
                  onClick={handleConnectKeys}
                />
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
