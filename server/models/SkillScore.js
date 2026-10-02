const mongoose = require("mongoose");

const skillScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    skills: [
      {
        name: String, // e.g. "JavaScript", "React", "DSA"
        score: Number, // 0-100
        evidence: [String], // e.g. ["Used in 3 GitHub repos", "Used in 2 projects"]
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    lastCalculated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillScore", skillScoreSchema);