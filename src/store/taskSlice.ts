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
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
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
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index].stage = action.payload.stage;
      }
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

      const stageTasks = state.tasks.filter((task) => task.stage === stage);

      if (sourceIndex === destinationIndex) return;

      const sourceTask = stageTasks[sourceIndex];
      const destinationTask = stageTasks[destinationIndex];

      if (!sourceTask || !destinationTask) return;

      const sourceTaskIndexInAllTasks = state.tasks.findIndex(
        (task) => task.id === sourceTask.id
      );
      const destinationTaskIndexInAllTasks = state.tasks.findIndex(
        (task) => task.id === destinationTask.id
      );

      if (
        sourceTaskIndexInAllTasks === -1 ||
        destinationTaskIndexInAllTasks === -1
      )
        return;

      const newTasks = [...state.tasks];
      newTasks.splice(sourceTaskIndexInAllTasks, 1);
      newTasks.splice(destinationTaskIndexInAllTasks, 0, sourceTask);

      state.tasks = newTasks;
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
