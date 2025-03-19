import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Stage from "./Stage";
import { StageOptions, Task } from "../../types";
import taskReducer, { changeTaskStage } from "../../store/taskSlice";

const renderStage = (tasks: Task[] = [], stage = StageOptions.PENDING) => {
  const preloadedState = {
    tasks: { tasks: [] },
  };

  const store = configureStore({
    reducer: { tasks: taskReducer },
    preloadedState,
  });

  vi.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Stage stage={stage} tasks={tasks} />
      </DndProvider>
    </Provider>
  );

  return store;
};

describe("Stage Component", () => {
  it("renders stage title", () => {
    renderStage([], StageOptions.PROGRESS);
    expect(screen.getByText(StageOptions.PROGRESS)).toBeInTheDocument();
  });

  it("renders tasks", () => {
    const tasks: Task[] = [
      {
        id: "1",
        title: "Task 1",
        description: "Test",
        stage: StageOptions.PENDING,
      },
    ];
    renderStage(tasks);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  it("dispatches reorderTasks when a task moves within the same stage", async () => {
    const tasks: Task[] = [
      {
        id: "1",
        title: "Task 1",
        description: "Test",
        stage: StageOptions.PENDING,
      },
      {
        id: "2",
        title: "Task 2",
        description: "Test",
        stage: StageOptions.PENDING,
      },
    ];
    const store = renderStage(tasks, StageOptions.PENDING);

    const task1 = screen.getByText("Task 1");
    const task2 = screen.getByText("Task 2");

    fireEvent.dragStart(task1);
    fireEvent.dragOver(task2);
    fireEvent.drop(task2);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { id: "1", stage: "PENDING" } })
    );
  });

  it("moves a task between stages", async () => {
    const task: Task = {
      id: "1",
      title: "Task 1",
      description: "Test",
      stage: StageOptions.PENDING,
    };

    const preloadedState = {
      tasks: { tasks: [] },
    };

    const store = configureStore({
      reducer: { tasks: taskReducer },
      preloadedState,
    });

    vi.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Stage stage={StageOptions.PENDING} tasks={[task]} />
          <Stage stage={StageOptions.PROGRESS} tasks={[]} />
        </DndProvider>
      </Provider>
    );

    const taskElement = screen.getByText("Task 1");
    const targetStage = screen.getByText(StageOptions.PROGRESS);

    fireEvent.dragStart(taskElement);
    fireEvent.dragEnter(targetStage);
    fireEvent.drop(targetStage);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: changeTaskStage.type })
    );
  });
});
