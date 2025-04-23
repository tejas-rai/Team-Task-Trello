const Comment = require("../models/Comment");
const Task = require("../models/Task");

// Add a comment to a task
exports.addComment = async (req, res) => {
  try {
    const { taskId, text } = req.body;

    // 1. Ensure task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 2. Create comment
    const comment = await Comment.create({
      task: taskId,
      author: req.user._id,
      text
    });

    // 3. Populate author and return
    await comment.populate("author", "name email");
    return res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("addComment error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all comments for a task
exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Verify task exists (optional but cleaner)
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 2. Fetch & populate
    const comments = await Comment.find({ task: taskId })
      .populate("author", "name email")
      .sort({ createdAt: 1 }); // oldest first

    return res.json({ comments });
  } catch (err) {
    console.error("getComments error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
