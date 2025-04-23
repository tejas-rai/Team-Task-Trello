const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth.middleware");
const {
  createTeam,
  listTeams,
  addUserToTeam,
} = require("../controllers/teams.controller");

// All routes require auth
router.use(isAuthenticated);

// Admin-only
router.post("/", isAdmin, createTeam);
router.post("/:teamId/users", isAdmin, addUserToTeam);

// Any authenticated user can list teams
router.get("/", listTeams);

module.exports = router;
