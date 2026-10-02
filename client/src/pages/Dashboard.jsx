import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    targetRole: user?.targetRole || "",
    experienceLevel: user?.experienceLevel || "",
    education: user?.education || "",
    githubUsername: user?.githubUsername || "",
    leetcodeUsername: user?.leetcodeUsername || "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [githubData, setGithubData] = useState(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  const [leetcodeData, setLeetcodeData] = useState(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeError, setLeetcodeError] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
  });
  const [projectMessage, setProjectMessage] = useState("");
  const [projectLoading, setProjectLoading] = useState(false);

  const [skillData, setSkillData] = useState(null);
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillError, setSkillError] = useState("");

  const [gapData, setGapData] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);
  const [gapError, setGapError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      login({ ...res.data, token: user.token });
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeGithub = async () => {
    setGithubError("");
    setGithubLoading(true);

    try {
      const res = await api.post(
        "/github/analyze",
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setGithubData(res.data);
    } catch (err) {
      setGithubError(err.response?.data?.message || "Something went wrong");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleAnalyzeLeetCode = async () => {
    setLeetcodeError("");
    setLeetcodeLoading(true);

    try {
      const res = await api.post(
        "/leetcode/analyze",
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLeetcodeData(res.data);
    } catch (err) {
      setLeetcodeError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLeetcodeLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setProjectMessage("");
    setProjectLoading(true);

    try {
      const techStackArray = projectForm.techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await api.post(
        "/projects",
        { ...projectForm, techStack: techStackArray },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setProjectMessage("Project added successfully ✅");
      setProjectForm({ name: "", description: "", techStack: "", githubUrl: "", liveUrl: "" });
      fetchProjects();
    } catch (err) {
      setProjectMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalculateSkills = async () => {
    setSkillError("");
    setSkillLoading(true);

    try {
      const res = await api.post(
        "/skills/calculate",
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSkillData(res.data);
    } catch (err) {
      setSkillError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSkillLoading(false);
    }
  };

  const handleGetSkillGap = async () => {
    setGapError("");
    setGapLoading(true);

    try {
      const res = await api.get("/skill-gap", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGapData(res.data);
    } catch (err) {
      setGapError(err.response?.data?.message || "Something went wrong");
    } finally {
      setGapLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const statusColor = (status) => {
    if (status === "Good") return "green";
    if (status === "Improve") return "orange";
    return "red";
  };

  const statusEmoji = (status) => {
    if (status === "Good") return "🟢";
    if (status === "Improve") return "🟠";
    return "🔴";
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Welcome, {user?.name} 👋</h1>
        <button onClick={handleLogout} style={{ height: "40px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <p>Email: {user?.email}</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Your Profile</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>Target Role</label>
        <select
          name="targetRole"
          value={formData.targetRole}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select a role</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Software Developer">Software Developer</option>
        </select>

        <label>Experience Level</label>
        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select level</option>
          <option value="Student">Student</option>
          <option value="0-1 years">0-1 years</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3+ years">3+ years</option>
        </select>

        <label>Education</label>
        <input
          type="text"
          name="education"
          placeholder="e.g. B.Tech CSE"
          value={formData.education}
          onChange={handleChange}
          style={styles.input}
        />

        <label>GitHub Username</label>
        <input
          type="text"
          name="githubUsername"
          placeholder="your-github-username"
          value={formData.githubUsername}
          onChange={handleChange}
          style={styles.input}
        />

        <label>LeetCode Username</label>
        <input
          type="text"
          name="leetcodeUsername"
          placeholder="your-leetcode-username"
          value={formData.leetcodeUsername}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h2>GitHub Analysis</h2>
      <button onClick={handleAnalyzeGithub} disabled={githubLoading} style={styles.button}>
        {githubLoading ? "Analyzing..." : "Analyze GitHub"}
      </button>

      {githubError && <p style={{ color: "red" }}>{githubError}</p>}

      {githubData && (
        <div style={{ marginTop: "16px" }}>
          <p><strong>Total Repos:</strong> {githubData.totalRepos}</p>
          <p><strong>Total Stars:</strong> {githubData.totalStars}</p>
          <p><strong>Languages:</strong></p>
          <ul>
            {Object.entries(githubData.languages || {}).map(([lang, count]) => (
              <li key={lang}>{lang}: {count} repo(s)</li>
            ))}
          </ul>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2>LeetCode Analysis</h2>
      <button onClick={handleAnalyzeLeetCode} disabled={leetcodeLoading} style={styles.button}>
        {leetcodeLoading ? "Analyzing..." : "Analyze LeetCode"}
      </button>

      {leetcodeError && <p style={{ color: "red" }}>{leetcodeError}</p>}

      {leetcodeData && (
        <div style={{ marginTop: "16px" }}>
          <p><strong>Total Solved:</strong> {leetcodeData.totalSolved}</p>
          <p><strong>Easy:</strong> {leetcodeData.easySolved}</p>
          <p><strong>Medium:</strong> {leetcodeData.mediumSolved}</p>
          <p><strong>Hard:</strong> {leetcodeData.hardSolved}</p>
          <p><strong>Ranking:</strong> {leetcodeData.ranking}</p>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2>Projects</h2>

      <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column" }}>
        <label>Project Name</label>
        <input
          type="text"
          name="name"
          value={projectForm.name}
          onChange={handleProjectChange}
          style={styles.input}
          required
        />

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={projectForm.description}
          onChange={handleProjectChange}
          style={styles.input}
        />

        <label>Tech Stack (comma separated)</label>
        <input
          type="text"
          name="techStack"
          placeholder="React, Node.js, MongoDB"
          value={projectForm.techStack}
          onChange={handleProjectChange}
          style={styles.input}
        />

        <label>GitHub URL</label>
        <input
          type="text"
          name="githubUrl"
          value={projectForm.githubUrl}
          onChange={handleProjectChange}
          style={styles.input}
        />

        <label>Live URL</label>
        <input
          type="text"
          name="liveUrl"
          value={projectForm.liveUrl}
          onChange={handleProjectChange}
          style={styles.input}
        />

        <button type="submit" disabled={projectLoading} style={styles.button}>
          {projectLoading ? "Adding..." : "Add Project"}
        </button>
      </form>

      {projectMessage && <p>{projectMessage}</p>}

      <div style={{ marginTop: "20px" }}>
        {projects.length === 0 && <p>No projects added yet.</p>}

        {projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{project.name}</h3>
            <p style={{ margin: "0 0 6px 0" }}>{project.description}</p>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>Tech:</strong> {project.techStack?.join(", ")}
            </p>
            {project.githubUrl && (
              <p style={{ margin: "0 0 6px 0" }}>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  GitHub Link
                </a>
              </p>
            )}
            <button
              onClick={() => handleDeleteProject(project._id)}
              style={{ ...styles.button, background: "#dc2626" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h2>Your Skill DNA 🧬</h2>
      <button onClick={handleCalculateSkills} disabled={skillLoading} style={styles.button}>
        {skillLoading ? "Calculating..." : "Calculate My Skills"}
      </button>

      {skillError && <p style={{ color: "red" }}>{skillError}</p>}

      {skillData && (
        <div style={{ marginTop: "16px" }}>
          <h3>Overall Score: {skillData.overallScore} / 100</h3>

          {skillData.skills.map((skill) => (
            <div
              key={skill.name}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{skill.name}</strong>
                <span>{skill.score} / 100</span>
              </div>
              <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px" }}>
                {skill.evidence.map((e, i) => (
                  <li key={i} style={{ fontSize: "13px" }}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2>Skill Gap Analysis 🎯</h2>
      <button onClick={handleGetSkillGap} disabled={gapLoading} style={styles.button}>
        {gapLoading ? "Analyzing..." : "View Skill Gap"}
      </button>

      {gapError && <p style={{ color: "red" }}>{gapError}</p>}

      {gapData && (
        <div style={{ marginTop: "16px" }}>
          <h3>Target Role: {gapData.targetRole}</h3>

          {gapData.gapAnalysis.map((item) => (
            <div
              key={item.skill}
              style={{
                border: `1px solid ${statusColor(item.status)}`,
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>
                  {statusEmoji(item.status)} {item.skill}
                </strong>
                <span>
                  {item.yourScore} / {item.requiredScore} required
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: statusColor(item.status) }}>
                {item.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    padding: "10px",
    margin: "6px 0 14px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;