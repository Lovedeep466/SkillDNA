const express = require("express");
const router = express.Router();
const { analyzeGitHub, getGitHubData } = require("../controllers/githubController");
const { protect } = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeGitHub);
router.get("/data", protect, getGitHubData);

module.exports = router;