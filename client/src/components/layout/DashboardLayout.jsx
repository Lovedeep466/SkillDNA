import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

const navItems = [
  { to: "/dashboard/profile", label: "Profile", icon: "👤" },
  { to: "/dashboard/github", label: "GitHub", icon: "🐙" },
  { to: "/dashboard/leetcode", label: "LeetCode", icon: "💻" },
  { to: "/dashboard/projects", label: "Projects", icon: "📁" },
  { to: "/dashboard/skills", label: "Skill DNA", icon: "🧬" },
  { to: "/dashboard/skill-gap", label: "Skill gap", icon: "🎯" },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: "🗺️" },
];

const desktopLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-primary-600 ${
    isActive ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-page hover:text-ink"
  }`;

const mobileLink = ({ isActive }) =>
  `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-primary-600 text-white" : "bg-page text-muted"
  }`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = (user?.name || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">
      {/* Sidebar, desktop */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-line bg-surface md:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={desktopLink}>
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </aside>

      <div className="md:pl-64">
        {/* Top bar, mobile */}
        <header className="sticky top-0 z-10 border-b border-line bg-surface px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Logo />
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={mobileLink}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
