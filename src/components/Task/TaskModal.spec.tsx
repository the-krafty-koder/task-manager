import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskModal from "./TaskModal";
import { StageOptions, Task } from "../../types";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  stage: StageOptions.PENDING,
};

describe("TaskModal", () => {
  it("renders when open is true", () => {
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        initialTask={mockTask}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("calls onEdit when the form is submitted", () => {
    const onEdit = vi.fn();
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        initialTask={mockTask}
        onEdit={onEdit}
      />
    );

    fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
      target: { value: "Updated Task" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Updated Task" })
    );
  });

  it("calls onClose when the cancel button is clicked", () => {
    const onClose = vi.fn();
    render(
      <TaskModal
        open={true}
        onClose={onClose}
        initialTask={mockTask}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
