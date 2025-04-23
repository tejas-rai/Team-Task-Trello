const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/auth.middleware");
const { addComment, getComments } = require("../controllers/comments.controller");

router.use(isAuthenticated);

// POST /api/comments       → addComment
router.post("/", addComment);

// GET  /api/comments/:taskId → getComments
router.get("/:taskId", getComments);

module.exports = router;
