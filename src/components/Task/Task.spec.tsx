import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi, it, expect, describe } from "vitest";
import TaskComponent from "./Task";
import taskReducer, { editTask, deleteTask } from "../../store/taskSlice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StageOptions, Task } from "../../types";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "This is a test task description",
  stage: StageOptions.PENDING,
};

const preloadedState = {
  tasks: { tasks: [mockTask] },
};

const store = configureStore({
  reducer: { tasks: taskReducer },
  preloadedState,
});

vi.spyOn(store, "dispatch");

describe("TaskComponent", () => {
  it("renders task title and description", () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <TaskComponent task={mockTask} index={0} moveTask={vi.fn()} />
        </DndProvider>
      </Provider>
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test task description")
    ).toBeInTheDocument();
  });

  it("opens and closes the menu", async () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <TaskComponent task={mockTask} index={0} moveTask={vi.fn()} />
        </DndProvider>
      </Provider>
    );

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    await screen.findByText("View/Edit");
    await screen.findByText("Delete");

    fireEvent.click(screen.getByText("View/Edit"));

    await waitFor(() =>
      expect(screen.queryByText("Edit")).not.toBeInTheDocument()
    );
  });

  it("dispatches editTask when editing", async () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <TaskComponent task={mockTask} index={0} moveTask={vi.fn()} />
        </DndProvider>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));
    await screen.findByText("View/Edit");

    fireEvent.click(screen.getByText("View/Edit"));

    const titleInput = await screen.findByRole("textbox", { name: /title/i });
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        editTask(expect.objectContaining({ title: "Updated Task" }))
      );
    });
  });

  it("dispatches deleteTask when deleting", async () => {
    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <TaskComponent task={mockTask} index={0} moveTask={vi.fn()} />
        </DndProvider>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));
    await screen.findByText("Delete");

    fireEvent.click(screen.getByText("Delete"));

    await screen.findByText(/Are you sure you want to delete/i);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(deleteTask("1"));
    });
  });
});
