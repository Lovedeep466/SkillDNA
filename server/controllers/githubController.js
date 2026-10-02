const axios = require("axios");
const User = require("../models/User");
const GitHubData = require("../models/GitHubData");

// FETCH & ANALYZE GITHUB DATA
const analyzeGitHub = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.githubUsername) {
      return res.status(400).json({ message: "GitHub username not set in profile" });
    }

    const username = user.githubUsername;

    // Call GitHub public API
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );

    const repos = response.data;

    if (!Array.isArray(repos) || repos.length === 0) {
      return res.status(404).json({ message: "No public repositories found for this username" });
    }

    // Process data
    let totalStars = 0;
    const languagesCount = {};
    const repositories = [];

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;

      if (repo.language) {
        languagesCount[repo.language] = (languagesCount[repo.language] || 0) + 1;
      }

      repositories.push({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "Unknown",
        stars: repo.stargazers_count || 0,
        url: repo.html_url,
        updatedAt: repo.updated_at,
      });
    });

    // Save or update in database
    const githubData = await GitHubData.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        username,
        totalRepos: repos.length,
        totalStars,
        languages: languagesCount,
        repositories,
        lastSynced: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(githubData);
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "GitHub username not found" });
    }

    res.status(500).json({ message: "Failed to fetch GitHub data" });
  }
};

// GET SAVED GITHUB DATA (without re-fetching)
const getGitHubData = async (req, res) => {
  try {
    const githubData = await GitHubData.findOne({ user: req.user._id });

    if (!githubData) {
      return res.status(404).json({ message: "No GitHub data found. Please analyze first." });
    }

    res.status(200).json(githubData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { analyzeGitHub, getGitHubData };