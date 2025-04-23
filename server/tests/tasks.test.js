const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const db = require("./db");

let adminToken, memberToken, teamId, taskId;
let adminId, memberId;

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe("Tasks API", () => {
  beforeEach(async () => {
    // 1️⃣ Register & login admin
    await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@test.com",
      password: "adminpass",
      role: "admin",
    });
    const aRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "adminpass" });
    adminToken = aRes.body.token;
    adminId = aRes.body.user.id;

    // 2️⃣ Register & login member
    await request(app).post("/api/auth/register").send({
      name: "Member",
      email: "member@test.com",
      password: "memberpass",
      role: "member",
    });
    const mRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "member@test.com", password: "memberpass" });
    memberToken = mRes.body.token;
    memberId = mRes.body.user.id;

    // 3️⃣ Admin creates a team
    const teamRes = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Dev Team" });
    teamId = teamRes.body.team._id;

    // 4️⃣ Add member to the team
    await request(app)
      .post(`/api/teams/${teamId}/users`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ userId: memberId });

    // 5️⃣ Also add admin to the team
    await request(app)
      .post(`/api/teams/${teamId}/users`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ userId: adminId });
  });

  it("should allow admin to create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Task",
        description: "Do something",
        dueDate: "2025-12-31",
        priority: "High",
        team: teamId,
        assignedTo: memberId,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.task).toHaveProperty("_id");
    expect(res.body.task.title).toBe("Test Task");
    taskId = res.body.task._id;
  });

  it("should list tasks for admin & filter for member", async () => {
    // Create one task for the member
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Member Task",
        description: "",
        dueDate: "2025-12-01",
        priority: "Low",
        team: teamId,
        assignedTo: memberId,
      });

    // Create one task for the admin
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Admin Task",
        description: "",
        dueDate: "2025-11-01",
        priority: "Medium",
        team: teamId,
        assignedTo: adminId,
      });

    // Admin should see both tasks
    let res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBe(2);

    // Member should see only their own task
    res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.every((t) => t.assignedTo._id === memberId)).toBe(true);
  });

  it("should allow status update by permitted roles", async () => {
    // Admin creates a task for the member
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Status Task",
        description: "",
        dueDate: "2025-10-01",
        priority: "Medium",
        team: teamId,
        assignedTo: memberId,
      });
    taskId = createRes.body.task._id;

    // Member updates their own task
    let res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ status: "Done" });
    expect(res.statusCode).toBe(200);
    expect(res.body.task.status).toBe("Done");

    // Admin updates any task
    res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "In Progress" });
    expect(res.statusCode).toBe(200);
    expect(res.body.task.status).toBe("In Progress");
  });
});
