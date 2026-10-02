const express = require("express");
const router = express.Router();
const { calculateSkills, getSkillScore } = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

router.post("/calculate", protect, calculateSkills);
router.get("/data", protect, getSkillScore);

module.exports = router;