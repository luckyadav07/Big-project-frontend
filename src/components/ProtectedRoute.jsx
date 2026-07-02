import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import UserDashboard from "./common/UserDashboard.jsx";
import AdminDashboard from "./common/AdminDashboard.jsx";

function ProtectedRoute({ adminOnly = false }) {
  const { token, loading, user } = useAuth();
  console.log("===== ProtectedRoute =====");
  console.log("Path:", window.location.pathname);
  console.log("Token:", token);
  console.log("User:", user);
  console.log("Role:", user?.role);
  console.log("Admin Only:", adminOnly);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || typeof user !== "object") {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (adminOnly) {
    return (
      <AdminDashboard>
        <Outlet />
      </AdminDashboard>
    );
  }

  return (
    <UserDashboard>
      <Outlet />
    </UserDashboard>
  );
}

export default ProtectedRoute;