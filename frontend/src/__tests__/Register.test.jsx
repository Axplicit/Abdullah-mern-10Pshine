import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Register from "../pages/Register";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    register: vi.fn(),
  }),
}));

describe("Register Page", () => {
  it("renders name, email and password fields", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders register button", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });
});
