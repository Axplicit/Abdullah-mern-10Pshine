import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// 🔥 Proper axios mock (includes create)
vi.mock("axios", () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(() => Promise.resolve({ data: {} })),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        put: vi.fn(() => Promise.resolve({ data: {} })),
        delete: vi.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }),
    },
  };
});

// 🔥 Mock useAuth so it doesn't crash
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    token: "fake-token",
    user: { name: "Test User", email: "test@test.com" },
    logout: vi.fn(),
    setUser: vi.fn(),
  }),
}));

import Profile from "../pages/Profile";

describe("Profile Page", () => {
  it("renders profile page", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});
