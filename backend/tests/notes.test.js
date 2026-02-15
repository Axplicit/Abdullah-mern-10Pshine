// backend/tests/notes.test.js

import "../setup.js"; // ✅ ensures DB is ready before tests
import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("NOTES API", () => {
  let token;
  let createdNoteId;

  const testUser = {
    name: "Notes Test User",
    email: `notes_${Date.now()}@example.com`,
    password: "Password123",
  };

  const testNote = {
    title: "Test Note",
    content: "<p>This is a test note</p>",
  };

  // ===============================
  // Setup - register & login user
  // ===============================
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

  // ===============================
  // CREATE NOTE
  // ===============================
  describe("POST /api/notes", () => {
    it("should create a new note", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send(testNote);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("data");

      createdNoteId = res.body.data.id;
    });
  });

  // ===============================
  // GET NOTES
  // ===============================
  describe("GET /api/notes", () => {
    it("should return notes array", async () => {
      const res = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("data").that.is.an("array");
    });
  });

  // ===============================
  // UPDATE NOTE
  // ===============================
  describe("PUT /api/notes/:id", () => {
    it("should update a note", async () => {
      const res = await request(app)
        .put(`/api/notes/${createdNoteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Title",
          content: "<p>Updated content</p>",
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
    });
  });

  // ===============================
  // DELETE NOTE
  // ===============================
  describe("DELETE /api/notes/:id", () => {
    it("should delete a note", async () => {
      const res = await request(app)
        .delete(`/api/notes/${createdNoteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
    });
  });
});
