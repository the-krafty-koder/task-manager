import {
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import { StageOptions, type Task } from "../../types";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState } from "react";
import TaskModal from "./TaskModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteTask, editTask } from "../../store/taskSlice";

const MAX_LENGTH = 40;

const StyledCard = styled(Card)({
  width: 350,
  maxHeight: 200,
  borderRadius: 13,
  border: "1px solid rgba(0, 0, 0, 0.2)",
  backgroundColor: "#FFFFFF",
});

const getStageIcon = (stage: StageOptions) => {
  const icons = {
    [StageOptions.PENDING]: <PendingIcon color="disabled" />,
    [StageOptions.PROGRESS]: <LoopIcon color="info" />,
    [StageOptions.COMPLETE]: <CheckCircleIcon color="success" />,
  };

  return icons[stage] ?? null;
};

const truncateText = (text: string, maxLength = MAX_LENGTH) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setAnchorEl(null);
  };

  const onEdit = (task: Task) => {
    dispatch(editTask(task));
    setIsEditModalOpen(false);
  };
  const onConfirmDelete = () => {
    dispatch(deleteTask(task.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <StyledCard>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {getStageIcon(task.stage)}
              <Typography variant="subtitle2" fontWeight="bold">
                {task.title}
              </Typography>
            </Stack>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </Stack>

          <Typography
            variant="body2"
            sx={{ mt: 1, ml: 1, color: "text.secondary" }}
          >
            {truncateText(task.description)}
          </Typography>
        </CardContent>
      </StyledCard>

      <TaskModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTask={task}
        onEdit={onEdit}
      />

      <ConfirmationDialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={task.title}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default Task;
