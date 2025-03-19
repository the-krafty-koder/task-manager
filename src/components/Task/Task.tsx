import React, { useRef, useState, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteTask, editTask } from "../../store/taskSlice";
import "./Task.css";
import type { Task } from "../../types";

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

import TaskModal from "./TaskModal";
import ConfirmationDialog from "./ConfirmationDialog";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
interface TaskProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

const MAX_LENGTH = 40;

const StyledCard = styled(Card)({
  maxHeight: 200,
  borderRadius: 13,
  border: "1px solid rgba(0, 0, 0, 0.2)",
  backgroundColor: "#FFFFFF",
});

const StyledDiv = styled("div")<{ isDragging: boolean }>(({ isDragging }) => ({
  opacity: isDragging ? 0.5 : 1,
  marginBottom: "4px",
  cursor: "grab",
}));

const truncateText = (text: string, maxLength = MAX_LENGTH) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const TaskComponent = ({ task, index, moveTask }: TaskProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem: { index: number; id: string }) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [modals, setModals] = useState({ edit: false, delete: false });

  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(event.currentTarget);

  const closeMenu = () => setMenuAnchor(null);

  const openEditModal = useCallback(() => {
    setModals((prev) => ({ ...prev, edit: true }));
    closeMenu();
  }, [closeMenu]);

  const openDeleteModal = useCallback(() => {
    setModals((prev) => ({ ...prev, delete: true }));
    closeMenu();
  }, [closeMenu]);

  const handleEditTask = useCallback(
    (updatedTask: Task) => {
      dispatch(editTask(updatedTask));
      setModals((prev) => ({ ...prev, edit: false }));
    },
    [dispatch]
  );

  const handleConfirmDelete = useCallback(() => {
    dispatch(deleteTask(task.id));
    setModals((prev) => ({ ...prev, delete: false }));
  }, [dispatch, task.id]);

  return (
    <StyledDiv ref={ref} isDragging={isDragging}>
      <StyledCard>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="taskHeader"
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {task.title}
            </Typography>
            <IconButton onClick={openMenu}>
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={closeMenu}
            >
              <MenuItem onClick={openEditModal}>View/Edit</MenuItem>
              <MenuItem onClick={openDeleteModal}>Delete</MenuItem>
            </Menu>
          </Stack>

          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            {truncateText(task.description)}
          </Typography>
        </CardContent>
      </StyledCard>

      <TaskModal
        open={modals.edit}
        onClose={() => setModals({ ...modals, edit: false })}
        initialTask={task}
        onEdit={handleEditTask}
      />

      <ConfirmationDialog
        open={modals.delete}
        onClose={() => setModals({ ...modals, delete: false })}
        title={task.title}
        onConfirm={handleConfirmDelete}
      />
    </StyledDiv>
  );
};

export default TaskComponent;
