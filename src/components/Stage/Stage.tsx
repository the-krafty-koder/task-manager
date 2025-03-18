import { Stack, Typography } from "@mui/material";
import Task from "../Task/Task";
import "./Stage.css";

interface StageProps {
  tasks: Task[];
  title: string;
}

const Stage = ({ tasks, title }: StageProps) => {
  return (
    <Stack spacing={2} className="column">
      <Typography>{title}</Typography>
      {tasks.map((task) => (
        <Task task={task} />
      ))}
    </Stack>
  );
};

export default Stage;
