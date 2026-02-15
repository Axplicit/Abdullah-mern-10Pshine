// backend/tests/password.test.js

import "../setup.js"; // ✅ ensures DB tables are ready
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("PASSWORD RESET API (OTP Flow)", () => {

  const testUser = {
    name: "OTP Test User",
    email: `otp_${Date.now()}@example.com`,
    password: "OldPassword123"
  };

  const newPassword = "NewPassword123";
  let otpCode;

  // ===============================
  // REGISTER USER
  // ===============================
  before(async () => {
    await request(app)
      .post("/api/auth/register")
      .send(testUser);
  });

  // ===============================
  // FORGOT PASSWORD
  // ===============================
  describe("POST /api/auth/forgot-password", () => {

    it("should generate OTP and store it", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testUser.email });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");

      // Fetch updated user from DB
      const user = await User.findOne({ where: { email: testUser.email } });

      expect(user).to.exist;
      expect(user.resetOtp).to.exist;
      expect(user.resetOtpExpires).to.exist;

      otpCode = user.resetOtp;
    });

  });

  // ===============================
  // RESET PASSWORD USING OTP
  // ===============================
  describe("POST /api/auth/reset-password", () => {

    it("should reset password using OTP", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          email: testUser.email,
          otp: otpCode,
          password: newPassword
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
    });

  });

  // ===============================
  // LOGIN WITH NEW PASSWORD
  // ===============================
  describe("POST /api/auth/login (after reset)", () => {

    it("should login with new password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: newPassword
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
    });

  });

});
