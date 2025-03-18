import { Button, Stack, Typography } from "@mui/material";
import Task from "../components/Task/Task";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addTask, setTasks } from "../store/taskSlice";
import TaskModal from "../components/Task/TaskModal";
import "./Home.css";
import Stage from "../components/Stage/Stage";
import { StageOptions } from "../types";

type CategorizedTasks = {
  pendingTasks: Task[];
  progressTasks: Task[];
  completeTasks: Task[];
};

const categorizeTasks = (tasks: Task[]) => {
  const results: CategorizedTasks = {
    pendingTasks: [],
    progressTasks: [],
    completeTasks: [],
  };
  for (let task of tasks) {
    switch (task.stage) {
      case StageOptions.PENDING:
        results.pendingTasks.push(task);
        break;
      case StageOptions.PROGRESS:
        results.progressTasks.push(task);
        break;
      case StageOptions.COMPLETE:
        results.completeTasks.push(task);
        break;
    }
  }
  return results;
};
const Home = () => {
  const [isAddModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { pendingTasks, progressTasks, completeTasks } = categorizeTasks(tasks);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (task: Task) => {
    dispatch(addTask(task));
    handleCloseAddModal();
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "tasks") {
        const newTasks = JSON.parse(event.newValue || "[]");
        dispatch(setTasks(newTasks));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return (
    <>
      <Stack direction="row" justifyContent="end">
        <Button
          size="medium"
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={handleAddTask}
        >
          <Typography>Add task</Typography>
        </Button>
        <TaskModal
          open={isAddModalOpen}
          onClose={handleCloseAddModal}
          initialTask={null}
          onEdit={handleSubmit}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-evenly">
        <Stage tasks={pendingTasks} title="Pending"></Stage>
        <Stage tasks={progressTasks} title="Progress"></Stage>
        <Stage tasks={completeTasks} title="Complete"></Stage>
      </Stack>
    </>
  );
};

export default Home;
