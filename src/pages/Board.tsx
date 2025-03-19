import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addTask, setTasks } from "../store/taskSlice";
import TaskModal from "../components/Task/TaskModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Stage from "../components/Stage/Stage";
import { StageOptions, Task } from "../types";
import "./Board.css";

const Board = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleSubmit = (task: Task) => {
    dispatch(addTask(task));
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "tasks") {
        const newTasks = JSON.parse(event.newValue || "[]");
        dispatch(setTasks(newTasks));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  const stagedTasks = useMemo(() => {
    return Object.values(StageOptions).map((stage) => ({
      stage,
      tasks: tasks.filter((task) => task.stage === stage),
    }));
  }, [tasks]);

  return (
    <div className="boardContainer">
      <Stack direction="row" justifyContent="end">
        <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>
          <Typography>Add task</Typography>
        </Button>
      </Stack>

      <TaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialTask={null}
        onEdit={handleSubmit}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="board">
          {stagedTasks.map(({ stage, tasks }) => (
            <Stage key={stage} stage={stage} tasks={tasks} />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

export default Board;
