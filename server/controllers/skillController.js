const GitHubData = require("../models/GitHubData");
const LeetCodeData = require("../models/LeetCodeData");
const Project = require("../models/Project");
const SkillScore = require("../models/SkillScore");

// CALCULATE SKILLS
const calculateSkills = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all data sources
    const githubData = await GitHubData.findOne({ user: userId });
    const leetcodeData = await LeetCodeData.findOne({ user: userId });
    const projects = await Project.find({ user: userId });

    // Object to accumulate skill info: { skillName: { githubCount, projectCount } }
    const skillMap = {};

    const addToSkillMap = (skillName, source) => {
      if (!skillName) return;
      const key = skillName.trim();
      if (!skillMap[key]) {
        skillMap[key] = { githubCount: 0, projectCount: 0 };
      }
      skillMap[key][source] += 1;
    };

    // 1. From GitHub languages (Map -> plain object)
    if (githubData && githubData.languages) {
      const languagesObj =
        githubData.languages instanceof Map
          ? Object.fromEntries(githubData.languages)
          : githubData.languages;

      Object.entries(languagesObj).forEach(([lang, count]) => {
        skillMap[lang] = skillMap[lang] || { githubCount: 0, projectCount: 0 };
        skillMap[lang].githubCount += count;
      });
    }

    // 2. From Projects tech stack
    projects.forEach((project) => {
      (project.techStack || []).forEach((tech) => {
        addToSkillMap(tech, "projectCount");
      });
    });

    // 3. Build final skills array with score + evidence
    const skills = Object.entries(skillMap).map(([name, data]) => {
      const githubPoints = Math.min(data.githubCount * 15, 45); // max 45 points from GitHub
      const projectPoints = Math.min(data.projectCount * 15, 35); // max 35 points from Projects
      const score = Math.min(githubPoints + projectPoints, 100);

      const evidence = [];
      if (data.githubCount > 0) {
        evidence.push(`Used in ${data.githubCount} GitHub repositor${data.githubCount > 1 ? "ies" : "y"}`);
      }
      if (data.projectCount > 0) {
        evidence.push(`Used in ${data.projectCount} project${data.projectCount > 1 ? "s" : ""}`);
      }

      return { name, score, evidence };
    });

    // 4. Add DSA / Problem Solving skill from LeetCode data
    if (leetcodeData && leetcodeData.totalSolved > 0) {
      const dsaScore = Math.min(
        Math.round(
          leetcodeData.easySolved * 0.5 +
            leetcodeData.mediumSolved * 1 +
            leetcodeData.hardSolved * 2
        ),
        100
      );

      skills.push({
        name: "DSA / Problem Solving",
        score: dsaScore,
        evidence: [
          `Solved ${leetcodeData.totalSolved} problems on LeetCode`,
          `Easy: ${leetcodeData.easySolved}, Medium: ${leetcodeData.mediumSolved}, Hard: ${leetcodeData.hardSolved}`,
        ],
      });
    }

    // 5. Sort skills by score (highest first)
    skills.sort((a, b) => b.score - a.score);

    // 6. Calculate overall score (average of all skill scores)
    const overallScore =
      skills.length > 0
        ? Math.round(skills.reduce((sum, s) => sum + s.score, 0) / skills.length)
        : 0;

    // 7. Save to database
    const skillScore = await SkillScore.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        skills,
        overallScore,
        lastCalculated: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(skillScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate skills" });
  }
};

// GET SAVED SKILL SCORE
const getSkillScore = async (req, res) => {
  try {
    const skillScore = await SkillScore.findOne({ user: req.user._id });

    if (!skillScore) {
      return res.status(404).json({ message: "No skill data found. Please calculate first." });
    }

    res.status(200).json(skillScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { calculateSkills, getSkillScore };