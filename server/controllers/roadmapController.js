const SkillScore = require("../models/SkillScore");
const User = require("../models/User");
const roleRequirements = require("../config/roleRequirements");
const learningResources = require("../config/learningResources");

const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.targetRole) {
      return res.status(400).json({ message: "Please set a target role in your profile first" });
    }

    const requirements = roleRequirements[user.targetRole];

    if (!requirements) {
      return res.status(400).json({ message: "No requirements defined for this target role yet" });
    }

    const skillScore = await SkillScore.findOne({ user: req.user._id });

    if (!skillScore) {
      return res.status(400).json({ message: "Please calculate your skills first" });
    }

    const userSkillsMap = {};
    skillScore.skills.forEach((s) => {
      userSkillsMap[s.name] = s.score;
    });

    // Find skills that need improvement (Improve or Major Gap)
    const weakSkills = [];

    Object.entries(requirements).forEach(([skillName, requiredScore]) => {
      const yourScore = userSkillsMap[skillName] || 0;
      const difference = yourScore - requiredScore;

      if (difference < 0) {
        const priority = difference < -20 ? "High" : "Medium";

        weakSkills.push({
          skill: skillName,
          yourScore,
          requiredScore,
          priority,
          resources: learningResources[skillName] || [
            `Search for beginner-friendly resources on ${skillName}`,
          ],
        });
      }
    });

    // Sort: High priority first
    weakSkills.sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1));

    res.status(200).json({
      targetRole: user.targetRole,
      roadmap: weakSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRoadmap };