import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DarkModeToggle from "../components/DarkModeToggle";

describe("Dark Mode Toggle", () => {
  it("renders toggle button", () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
