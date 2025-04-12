import { useState, FormEvent } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { Task, StageOptions } from "../../types";

interface TaskFormProps {
  initialTask: Task | null;
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
}

const TaskForm = ({ initialTask, onSubmit, onCancel }: TaskFormProps) => {
  const header = initialTask ? "View/Edit Task" : "Add Task";
  const [task, setTask] = useState(
    initialTask || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      stage: StageOptions.PENDING,
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6">{header}</Typography>
        <TextField
          label="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="stage-select-label">Stage</InputLabel>
          <Select
            value={task.stage}
            label="Stage"
            onChange={(e) =>
              setTask({ ...task, stage: e.target.value as StageOptions })
            }
          >
            {Object.values(StageOptions).map((stage) => (
              <MenuItem value={stage}>{stage}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          {onCancel && (
            <Button type="button" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default TaskForm;
