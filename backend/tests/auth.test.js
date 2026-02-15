import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

let authToken;

describe("AUTH API", () => {

  // Generate unique email every test run
  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "Password123"
  };

  // ===============================
  // REGISTER
  // ===============================
  describe("POST /api/auth/register", () => {

    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message");
    });

  });

  // ===============================
  // LOGIN
  // ===============================
  describe("POST /api/auth/login", () => {

    it("should login and return token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");

      authToken = res.body.token;
    });

  });

});

export { authToken };
