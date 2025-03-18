// import {
//   Card,
//   CardContent,
//   IconButton,
//   Menu,
//   MenuItem,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import PendingIcon from "@mui/icons-material/Pending";
// import LoopIcon from "@mui/icons-material/Loop";
// import { StageOptions, type Task } from "../../types";
// import ConfirmationDialog from "./ConfirmationDialog";
// import { useState } from "react";
// import TaskModal from "./TaskModal";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../store";
// import { deleteTask, editTask } from "../../store/taskSlice";

// const MAX_LENGTH = 40;

// const StyledCard = styled(Card)({
//   width: 350,
//   maxHeight: 200,
//   borderRadius: 13,
//   border: "1px solid rgba(0, 0, 0, 0.2)",
//   backgroundColor: "#FFFFFF",
// });

// const getStageIcon = (stage: StageOptions) => {
//   const icons = {
//     [StageOptions.PENDING]: <PendingIcon color="disabled" />,
//     [StageOptions.PROGRESS]: <LoopIcon color="info" />,
//     [StageOptions.COMPLETE]: <CheckCircleIcon color="success" />,
//   };

//   return icons[stage] ?? null;
// };

// const truncateText = (text: string, maxLength = MAX_LENGTH) =>
//   text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

// interface TaskProps {
//   task: Task;
// }
// const Task = ({ task }: TaskProps) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const dispatch = useDispatch<AppDispatch>();

//   const handleEditClick = () => {
//     setIsEditModalOpen(true);
//     setAnchorEl(null);
//   };

//   const handleDeleteClick = () => {
//     setIsDeleteModalOpen(true);
//     setAnchorEl(null);
//   };

//   const onEdit = (task: Task) => {
//     dispatch(editTask(task));
//     setIsEditModalOpen(false);
//   };
//   const onConfirmDelete = () => {
//     dispatch(deleteTask(task.id));
//     setIsDeleteModalOpen(false);
//   };

//   return (
//     <>
//       <StyledCard>
//         <CardContent>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Stack direction="row" spacing={1} alignItems="center">
//               {getStageIcon(task.stage)}
//               <Typography variant="subtitle2" fontWeight="bold">
//                 {task.title}
//               </Typography>
//             </Stack>
//             <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
//               <MoreVertIcon />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={() => setAnchorEl(null)}
//             >
//               <MenuItem onClick={handleEditClick}>Edit</MenuItem>
//               <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
//             </Menu>
//           </Stack>

//           <Typography
//             variant="body2"
//             sx={{ mt: 1, ml: 1, color: "text.secondary" }}
//           >
//             {truncateText(task.description)}
//           </Typography>
//         </CardContent>
//       </StyledCard>

//       <TaskModal
//         open={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         initialTask={task}
//         onEdit={onEdit}
//       />

//       <ConfirmationDialog
//         open={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title={task.title}
//         onConfirm={onConfirmDelete}
//       />
//     </>
//   );
// };

// export default Task;

import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StageOptions, Task } from "../../types";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteTask, editTask } from "../../store/taskSlice";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";

interface TaskProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

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

const TaskComponent = ({ task, index, moveTask }: TaskProps) => {
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
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginBottom: "4px",
        cursor: "grab",
      }}
    >
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
    </div>
  );
};

export default TaskComponent;
