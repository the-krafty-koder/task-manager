import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { reorderTasks, changeTaskStage } from "../../store/taskSlice";
import { Task, StageOptions } from "../../types";
import TaskComponent from "../Task/Task";
import { Stack, Typography } from "@mui/material";
import "./Stage.css";

interface StageProps {
  stage: StageOptions;
  tasks: Task[];
}

const Stage: React.FC<StageProps> = ({ stage, tasks }) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    dispatch(
      reorderTasks({
        sourceIndex: dragIndex,
        destinationIndex: hoverIndex,
        stage,
      })
    );
  };

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem: {
      id: string;
      index: number;
      stage: StageOptions;
    }) => {
      if (draggedItem.stage !== stage) {
        dispatch(changeTaskStage({ id: draggedItem.id, stage }));
        draggedItem.stage = stage;
        draggedItem.index = tasks.length;
      }
    },
  });

  drop(ref);

  return (
    <Stack ref={ref} className="column" spacing={2}>
      <Typography>{stage}</Typography>
      {tasks.map((task, index) => (
        <TaskComponent
          key={task.id}
          task={task}
          index={index}
          moveTask={moveTask}
        />
      ))}
    </Stack>
  );
};

export default Stage;
