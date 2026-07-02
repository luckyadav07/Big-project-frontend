import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";

import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage.jsx";
import ProfilePage from "./pages/dashboard/ProfilePage.jsx";
import CareerCoachPage from "./pages/dashboard/CareerCoachPage.jsx";
import NotificationsPage from "./pages/dashboard/NotificationsPage.jsx";

import JobsPage from "./pages/job/JobsPage.jsx";
import JobDetailPage from "./pages/job/JobDetailPage.jsx";
import RecommendedJobsPage from "./pages/job/RecommendedJobsPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminJobsManagement from "./pages/admin/AdminJobsManagement.jsx";
import AdminUsersManagement from "./pages/admin/AdminUsersManagement.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminApplicationsManagement from "./pages/admin/AdminApplicationsManagement.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";

import ToastContainer from "./components/common/ToastContainer.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />

        {/* User */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/recommended" element={<RecommendedJobsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/career-coach" element={<CareerCoachPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobsManagement />} />
          <Route path="users" element={<AdminUsersManagement />} />
          <Route path="reports" element={<AdminReports />} />
          <Route
            path="applications"
            element={<AdminApplicationsManagement />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;