const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  members: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
