import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DashboardLayout from "./common/DashboardLayout.jsx";

function ProtectedRoute({ adminOnly = false }) {
  const { token, loading, user } = useAuth();

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

  if (!token) return <Navigate to="/login" replace />;

  // Ensure user exists and has proper structure
  if (!user || typeof user !== "object") return <Navigate to="/login" replace />;

  // Check admin access: user must have role === 'admin'
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default ProtectedRoute;
