import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addTask, setTasks } from "../store/taskSlice";
import TaskModal from "../components/Task/TaskModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Stage from "../components/Stage/Stage";
import { StageOptions } from "../types";
import type { Task } from "../types";
import "./Home.css";

const Home = () => {
  const [isAddModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleSubmit = (task: Task) => {
    dispatch(addTask(task));
    setIsModalOpen(false);
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
          variant="contained"
          className="addTaskButton"
          onClick={() => setIsModalOpen(true)}
        >
          <Typography>Add task</Typography>
        </Button>
        <TaskModal
          open={isAddModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTask={null}
          onEdit={handleSubmit}
        />
      </Stack>
      <DndProvider backend={HTML5Backend}>
        <div className="board">
          {Object.values(StageOptions).map((stage) => (
            <Stage
              key={stage}
              stage={stage}
              tasks={tasks.filter((task) => task.stage === stage)}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
};

export default Home;
