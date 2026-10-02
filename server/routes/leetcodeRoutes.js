const express = require("express");
const router = express.Router();
const { analyzeLeetCode, getLeetCodeData } = require("../controllers/leetcodeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeLeetCode);
router.get("/data", protect, getLeetCodeData);

module.exports = router;