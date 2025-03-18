import { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { reorderTasks, changeTaskStage } from "../../store/taskSlice";
import { Task, StageOptions } from "../../types";
import TaskComponent from "../Task/Task";
import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoopIcon from "@mui/icons-material/Loop";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import "./Stage.css";

interface StageProps {
  stage: StageOptions;
  tasks: Task[];
}

const getStageIcon = (stage: StageOptions) => {
  const icons = {
    [StageOptions.PENDING]: <PanoramaFishEyeIcon color="disabled" />,
    [StageOptions.PROGRESS]: <LoopIcon color="info" />,
    [StageOptions.COMPLETE]: <CheckCircleIcon color="success" />,
  };

  return icons[stage] ?? null;
};

const getStageChipColor = (stage: StageOptions) => {
  const icons = {
    [StageOptions.PENDING]: "#ededed",
    [StageOptions.PROGRESS]: "#faf9c3",
    [StageOptions.COMPLETE]: "#c3fac4",
  };

  return icons[stage] ?? null;
};

const Stage = ({ stage, tasks }: StageProps) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(
        reorderTasks({
          sourceIndex: dragIndex,
          destinationIndex: hoverIndex,
          stage,
        })
      );
    },
    [dispatch, stage]
  );

  const [, drop] = useDrop<
    { id: string; index: number; stage: StageOptions },
    void,
    unknown
  >({
    accept: "TASK",
    hover: (draggedItem) => {
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
      <div
        className="columnChip"
        style={{ backgroundColor: getStageChipColor(stage) }}
      >
        {getStageIcon(stage)}{" "}
        <Typography variant="subtitle2">{stage}</Typography>
      </div>

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
