const mongoose = require("mongoose");

const githubDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    totalRepos: {
      type: Number,
      default: 0,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    languages: {
      type: Map,
      of: Number,
      default: {},
    },
    repositories: [
      {
        name: String,
        description: String,
        language: String,
        stars: Number,
        url: String,
        updatedAt: Date,
      },
    ],
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GitHubData", githubDataSchema);