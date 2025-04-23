const Team = require("../models/Team");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a new team (Admin only)
exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    // Prevent duplicate team names
    const exists = await Team.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Team name already in use" });
    }

    const team = await Team.create({ name, members: [] });
    return res.status(201).json({ message: "Team created", team });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all teams with member details
exports.listTeams = async (req, res) => {
  try {
    // Populate members so frontend can display names/emails
    const teams = await Team.find()
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
    return res.json({ teams });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a user to a team (Admin only)
exports.addUserToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicates
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    // Optionally repopulate for response
    const updatedTeam = await Team.findById(teamId)
      .populate("members", "name email role");

    return res.json({ message: "User added to team", team: updatedTeam });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
