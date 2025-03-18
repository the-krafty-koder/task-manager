import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, StageOptions } from "../types";

const loadTasksFromLocalStorage = (): Task[] => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

const saveTasksToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: loadTasksFromLocalStorage(),
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      saveTasksToLocalStorage(state.tasks);
    },

    editTask: (state, action: PayloadAction<Task>) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = action.payload;
        saveTasksToLocalStorage(state.tasks);
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks);
    },

    changeTaskStage: (
      state,
      action: PayloadAction<{ id: string; stage: StageOptions }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) task.stage = action.payload.stage;
    },

    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      saveTasksToLocalStorage(state.tasks);
    },

    reorderTasks: (
      state,
      action: PayloadAction<{
        sourceIndex: number;
        destinationIndex: number;
        stage: StageOptions;
      }>
    ) => {
      const { sourceIndex, destinationIndex, stage } = action.payload;
      if (sourceIndex === destinationIndex) return;

      // Get tasks belonging to the specific stage
      const stageTasks = state.tasks.filter((task) => task.stage === stage);
      const sourceTask = stageTasks[sourceIndex];
      const destinationTask = stageTasks[destinationIndex];

      if (!sourceTask || !destinationTask) return;

      // Find actual indices in the full task list
      const sourceTaskIndex = state.tasks.findIndex(
        (task) => task.id === sourceTask.id
      );
      const destinationTaskIndex = state.tasks.findIndex(
        (task) => task.id === destinationTask.id
      );

      if (sourceTaskIndex === -1 || destinationTaskIndex === -1) return;

      // Move task in the state
      const updatedTasks = [...state.tasks];
      updatedTasks.splice(sourceTaskIndex, 1);
      updatedTasks.splice(destinationTaskIndex, 0, sourceTask);

      state.tasks = updatedTasks;
      saveTasksToLocalStorage(state.tasks);
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  changeTaskStage,
  setTasks,
  reorderTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
