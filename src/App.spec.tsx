import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import taskReducer from "./store/taskSlice";

import App from "./App";
import { StageOptions } from "./types";

describe("App Component", () => {
  it("renders app correctly", () => {
    const preloadedState = {
      tasks: { tasks: [] },
    };

    const store = configureStore({
      reducer: { tasks: taskReducer },
      preloadedState,
    });

    render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Provider>
    );

    expect(screen.getByText("Task manager")).toBeInTheDocument();
    Object.values(StageOptions).forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument();
    });
  });
});
