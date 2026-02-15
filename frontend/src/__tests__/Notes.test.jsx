import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// 🔥 Proper axios mock (includes create)
vi.mock("axios", () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(() => Promise.resolve({ data: [] })),
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

// 🔥 Mock useAuth (VERY IMPORTANT)
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    token: "fake-token",
    user: { name: "Test User", email: "test@test.com" },
    logout: vi.fn(),
  }),
}));

import Notes from "../pages/Notes";

describe("Notes Page", () => {
  it("renders notes page", () => {
    render(
      <MemoryRouter>
        <Notes />
      </MemoryRouter>
    );

    expect(screen.getByText(/notes/i)).toBeInTheDocument();
  });
});
