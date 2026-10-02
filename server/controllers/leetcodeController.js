const axios = require("axios");
const User = require("../models/User");
const LeetCodeData = require("../models/LeetCodeData");

// FETCH & ANALYZE LEETCODE DATA
const analyzeLeetCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.leetcodeUsername) {
      return res.status(400).json({ message: "LeetCode username not set in profile" });
    }

    const username = user.leetcodeUsername;

    // GraphQL query LeetCode ke internal endpoint ke liye
    const query = {
      query: `
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
        }
      `,
      variables: { username },
    };

    const response = await axios.post("https://leetcode.com/graphql", query, {
      headers: { "Content-Type": "application/json" },
    });

    const matchedUser = response.data.data.matchedUser;

    if (!matchedUser) {
      return res.status(404).json({ message: "LeetCode username not found" });
    }

    // Process the data
    const stats = matchedUser.submitStatsGlobal.acSubmissionNum;

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    stats.forEach((stat) => {
      if (stat.difficulty === "All") totalSolved = stat.count;
      if (stat.difficulty === "Easy") easySolved = stat.count;
      if (stat.difficulty === "Medium") mediumSolved = stat.count;
      if (stat.difficulty === "Hard") hardSolved = stat.count;
    });

    // Save or update in database
    const leetcodeData = await LeetCodeData.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        username,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        ranking: matchedUser.profile?.ranking || 0,
        lastSynced: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(leetcodeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch LeetCode data" });
  }
};

// GET SAVED LEETCODE DATA
const getLeetCodeData = async (req, res) => {
  try {
    const leetcodeData = await LeetCodeData.findOne({ user: req.user._id });

    if (!leetcodeData) {
      return res.status(404).json({ message: "No LeetCode data found. Please analyze first." });
    }

    res.status(200).json(leetcodeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { analyzeLeetCode, getLeetCodeData };