const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    githubUsername: {
      type: String,
      default: "",
    },
    leetcodeUsername: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);