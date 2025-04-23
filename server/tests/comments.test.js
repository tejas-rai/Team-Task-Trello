// server/tests/comments.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app     = require("../server");
const db      = require("./db");

let adminToken, memberToken, teamId, taskId, commentId;

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe("Comments API", () => {
  beforeEach(async () => {
    // Register & login admin + member
    await request(app).post("/api/auth/register").send({
      name: "Admin", email: "admin@c.com", password: "pw", role: "admin"
    });
    await request(app).post("/api/auth/register").send({
      name: "Member", email: "member@c.com", password: "pw", role: "member"
    });
    const aRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@c.com", password: "pw" });
    adminToken = aRes.body.token;
    const mRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "member@c.com", password: "pw" });
    memberToken = mRes.body.token;

    // Create team & add member
    const teamRes = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "QA Team" });
    teamId = teamRes.body.team._id;
    await request(app)
      .post(`/api/teams/${teamId}/users`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ userId: mRes.body.user.id });

    // Create a task assigned to member
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Commentable Task",
        description: "",
        dueDate: "2025-09-15",
        priority: "Low",
        team: teamId,
        assignedTo: mRes.body.user.id
      });
    taskId = taskRes.body.task._id;
  });

  it("should allow adding and retrieving comments", async () => {
    // Member adds a comment
    const addRes = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ taskId, text: "First comment" });
    expect(addRes.statusCode).toBe(201);
    expect(addRes.body.comment).toHaveProperty("_id");
    expect(addRes.body.comment.text).toBe("First comment");
    commentId = addRes.body.comment._id;

    // Admin retrieves comments
    const getRes = await request(app)
      .get(`/api/comments/${taskId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.statusCode).toBe(200);
    expect(Array.isArray(getRes.body.comments)).toBe(true);
    expect(getRes.body.comments.length).toBe(1);
    expect(getRes.body.comments[0]._id).toBe(commentId);
  });

  it("should 404 when task not found", async () => {
    const badRes = await request(app)
      .get(`/api/comments/${new mongoose.Types.ObjectId().toString()}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(badRes.statusCode).toBe(404);
    expect(badRes.body.message).toBe("Task not found");
  });
});
