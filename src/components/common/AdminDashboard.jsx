import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  BarChart3,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { APP_NAME } from "../../utils/constants.js";
import { getInitials } from "../../utils/formatters.js";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  BarChart3,
};

function AdminDashboard({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "LayoutDashboard",
    },
    {
      label: "Manage Jobs",
      path: "/admin/jobs",
      icon: "Briefcase",
    },
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: "Users",
    },
    {
      label: "Manage Applications",
      path: "/admin/applications",
      icon: "FileText",
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: "BarChart3",
    },
  ];

  return (
    <div className="min-h-screen bg-navy flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-light border-r border-white/10 transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient">
            <Sparkles size={18} className="text-white" />
          </div>

          <span className="text-lg font-bold text-white">{APP_NAME}</span>

          <button
            className="ml-auto lg:hidden text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-accent/20 text-accent"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
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
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500 truncate">
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
        <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-4 lg:px-8 bg-navy/95 backdrop-blur-md border-b border-white/10">
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

export default AdminDashboard;