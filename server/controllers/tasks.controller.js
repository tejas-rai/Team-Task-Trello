// server/controllers/tasks.controller.js

const Task = require("../models/Task");
const Team = require("../models/Team");

// 1️. Create a new task
// — Only allow assigning to users who belong to the given team
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, team: teamId } = req.body;

    // 1. Check team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 2. Ensure assignedTo is a member of that team
    if (!team.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "Cannot assign task: user is not in this team" });
    }

    // 3. Create the task
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      team: teamId,
      status: "To Do", // default
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2️. List tasks
// — Admin: all tasks; Member: only tasks assigned to them
exports.listTasks = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    let query = {};

    if (role !== "admin") {
      // team member sees only their own tasks
      query.assignedTo = userId;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    return res.json({ tasks });
  } catch (err) {
    console.error("listTasks error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3️. Update only the status of a task
// — Admin can update any; Member only their own
exports.updateStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // expect one of: "To Do", "In Progress", "Done"

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If member, ensure they own this task
    if (req.user.role === "member" && !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    return res.json({ message: "Task status updated", task });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
