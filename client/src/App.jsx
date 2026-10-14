import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProfilePage from "./pages/dashboard/ProfilePage";
import GithubPage from "./pages/dashboard/GithubPage";
import LeetCodePage from "./pages/dashboard/LeetCodePage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import SkillsPage from "./pages/dashboard/SkillsPage";
import SkillGapPage from "./pages/dashboard/SkillGapPage";
import RoadmapPage from "./pages/dashboard/RoadmapPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="github" element={<GithubPage />} />
        <Route path="leetcode" element={<LeetCodePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="skill-gap" element={<SkillGapPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
