import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";
import ConfirmationDialog from "./ConfirmationDialog";

describe("ConfirmationDialog", () => {
  it("renders when open is true", () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test Task"
      />
    );

    expect(screen.getByText("Confirm Delete?")).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete "Test Task"?')
    ).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmationDialog
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Test Task"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ConfirmationDialog
        open={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Test Task"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
