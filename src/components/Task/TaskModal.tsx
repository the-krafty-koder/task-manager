import { Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TaskForm from "./TaskForm";
import { Task } from "../../types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  initialTask: Task | null;
  onEdit: (task: Task) => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid rgba(0, 0, 0, 0.3)",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const TaskModal = ({ open, onClose, initialTask, onEdit }: TaskModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBox>
        <TaskForm
          initialTask={initialTask}
          onSubmit={onEdit}
          onCancel={onClose}
        />
      </StyledBox>
    </Modal>
  );
};

export default TaskModal;
