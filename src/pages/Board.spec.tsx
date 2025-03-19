import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./Board";
import taskReducer, { setTasks } from "../store/taskSlice";
import { Task, StageOptions } from "../types";

const renderBoard = (preloadedTasks: Task[] = []) => {
  const preloadedState = {
    tasks: { tasks: preloadedTasks },
  };

  const store = configureStore({
    reducer: { tasks: taskReducer },
    preloadedState,
  });

  vi.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Board />
      </DndProvider>
    </Provider>
  );

  return store;
};

describe("Board Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders task stages", () => {
    renderBoard();

    Object.values(StageOptions).forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument();
    });
  });

  it("dispatches addTask when a task is submitted", () => {
    const store = renderBoard();

    const addButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
      target: { value: "New Task" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "tasks/addTask",
      })
    );
  });

  it("syncs tasks from localStorage on change", () => {
    const store = renderBoard();

    const newTasks: Task[] = [
      {
        id: "2",
        title: "Stored Task",
        description: "From localStorage",
        stage: StageOptions.PROGRESS,
      },
    ];

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "tasks",
        newValue: JSON.stringify(newTasks),
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(setTasks(newTasks));
  });
});
