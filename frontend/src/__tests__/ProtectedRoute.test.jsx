import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    token: "fake-token",
  }),
}));

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
