import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  FileCheck,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { DASHBOARD_NAV, APP_NAME } from "../../utils/constants.js";
import { getInitials } from "../../utils/formatters.js";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  FileCheck,
  MessageCircle,
  Bell,
  User,
};

function UserDashboard({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = DASHBOARD_NAV;

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-2 px-6 h-16"
        style={{
          borderBottom: "1px solid var(--border-color)",
        }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient">
            <Sparkles size={18} className="text-white" />
          </div>

          <span className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}>{APP_NAME}</span>

          <button
            className="ml-auto lg:hidden text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon =
              typeof item.icon === "string"
                ? iconMap[item.icon]
                : item.icon;

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-white/5"
                }`}
                style={{
                  color: active ? "var(--color-accent)" : "var(--text-secondary)",
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-sm font-bold text-accent">
              {getInitials(user?.name)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}>
                {user?.name}
              </p>

              <p className="text-xs truncate"
style={{ color: "var(--text-secondary)" }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-danger transition rounded-lg hover:bg-white/5"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-4 lg:px-8 backdrop-blur-md transition-colors duration-300"
style={{
  background: "color-mix(in srgb, var(--bg-main) 95%, transparent)",
  borderBottom: "1px solid var(--border-color)",
}}>
          <button
            className="lg:hidden text-gray-400"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1" />
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;