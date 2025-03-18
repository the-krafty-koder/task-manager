import { Modal, Box } from "@mui/material";
import TaskForm from "./TaskForm";
import { Task } from "../../types";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  initialTask: Task | null;
  onEdit: (task: Task) => void;
}

const TaskModal = ({ open, onClose, initialTask, onEdit }: EditModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid rgb(0,0,0,0.3)",
          boxShadow: 24,
          p: 4,
        }}
      >
        <TaskForm
          initialTask={initialTask}
          onSubmit={(editedTask) => onEdit(editedTask)}
          onCancel={onClose}
        />
      </Box>
    </Modal>
  );
};

export default TaskModal;
