const SkillScore = require("../models/SkillScore");
const User = require("../models/User");
const roleRequirements = require("../config/roleRequirements");

const getSkillGap = async (req, res) => {
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

    // Convert user's skills array into a lookup map: { "React": 75, "Java": 80, ... }
    const userSkillsMap = {};
    skillScore.skills.forEach((s) => {
      userSkillsMap[s.name] = s.score;
    });

    // Compare each required skill with user's actual score
    const gapAnalysis = Object.entries(requirements).map(([skillName, requiredScore]) => {
      const yourScore = userSkillsMap[skillName] || 0;
      const difference = yourScore - requiredScore;

      let status;
      if (difference >= 0) {
        status = "Good";
      } else if (difference >= -20) {
        status = "Improve";
      } else {
        status = "Major Gap";
      }

      return {
        skill: skillName,
        yourScore,
        requiredScore,
        status,
      };
    });

    res.status(200).json({
      targetRole: user.targetRole,
      gapAnalysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSkillGap };