import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../pages/ResetPassword";

describe("Reset Password Page", () => {
  it("renders reset password heading", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
