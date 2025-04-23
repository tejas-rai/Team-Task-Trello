// const express = require("express");
// const router = express.Router();
// const { isAuthenticated } = require("../middleware/auth.middleware");
const {
  createTask,
  listTasks,
  updateStatus,
} = require("../controllers/tasks.controller");

router.use(isAuthenticated);

// Admin and members can create/view/update tasks within their team
router.post("/", createTask);
router.get("/", listTasks);
router.patch("/:taskId/status", updateStatus);

module.exports = router;
