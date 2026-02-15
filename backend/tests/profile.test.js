import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("PROFILE API", () => {
  let token;

  const testUser = {
    name: "Profile Test User",
    email: `profile_${Date.now()}@example.com`,
    password: "Password123",
  };

  // ==========================================
  // BEFORE ALL → Register + Login
  // ==========================================
  before(async () => {
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    token = loginRes.body.token;
  });

  // ==========================================
  // GET PROFILE
  // ==========================================
  describe("GET /api/auth/profile", () => {
    it("should return user profile", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);

      // Your controller returns user object directly
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("email");
      expect(res.body.email).to.equal(testUser.email);
    });
  });

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  describe("PUT /api/auth/profile", () => {
    it("should update user name", async () => {
      const res = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Name" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success");
      expect(res.body.success).to.equal(true);
    });
  });

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  describe("PUT /api/auth/change-password", () => {
    it("should change password successfully", async () => {
      const res = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: "NewPassword123",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success");
      expect(res.body.success).to.equal(true);
    });
  });
});
