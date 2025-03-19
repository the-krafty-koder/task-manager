import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "./TaskForm";
import { StageOptions, Task } from "../../types";
import { describe, vi, expect, it } from "vitest";

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

describe("TaskForm", () => {
  it("renders correctly for adding a task", () => {
    render(<TaskForm initialTask={null} onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /title/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /description/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders correctly for editing a task", () => {
    const task: Task = {
      id: "123",
      title: "Test Task",
      description: "Test Description",
      stage: StageOptions.PROGRESS,
    };

    render(<TaskForm initialTask={task} onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
  });

  it("calls onSubmit with updated values", () => {
    render(<TaskForm initialTask={null} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /description/i }), {
      target: { value: "New Description" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Task",
        description: "New Description",
      })
    );
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <TaskForm
        initialTask={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
