/**
 * components/GuestRoute.jsx
 * Wraps public pages (Login, Register).
 * Redirects already-authenticated users to the dashboard
 * so they don't see login/register again.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const GuestRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
      </div>
    );
  }

  if (token) {
  return (
    <Navigate
      to={user?.role === "admin" ? "/admin" : "/dashboard"}
      replace
    />
  );
}

  return children;
};

export default GuestRoute;
