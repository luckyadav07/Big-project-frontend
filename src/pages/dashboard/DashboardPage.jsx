import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Phone, Target, UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import JobCard from "../../components/job/JobCard.jsx";
import Card from "../../components/common/Card.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import useJobStore from "../../store/jobStore.js";
import useUIStore from "../../store/uiStore.js";
import { getApplications, applyJob } from "../../services/applicationService.js";

function DashboardPage() {
  const { user } = useAuth();
  const { recommendedJobs, loading, error, fetchRecommended } = useJobStore();
  const showToast = useUIStore((s) => s.showToast);
  const [applications, setApplications] = useState([]);

  const handleApply = async (job) => {
     console.log("Apply clicked", job);
  try {
    await applyJob(job.id || job._id);

    showToast({
      message: "Application submitted!",
      type: "success",
    });

    // Reload applications
    const data = await getApplications();
    setApplications(data);

  } catch (err) {
  console.log("ERROR RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
  console.log("MESSAGE:", err.response?.data?.message);

  showToast({
    message:
      err.response?.data?.message || "Failed to apply.",
    type: "error",
  });
}
};  

  useEffect(() => {
  fetchRecommended();


  const loadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  loadApplications();
}, [fetchRecommended]);


  const jobsApplied = applications.length;

  const interviewCalls = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const avgMatchScore =
    recommendedJobs.length > 0
      ? Math.round(
          recommendedJobs.reduce(
            (sum, job) => sum + (job.matchScore || 0),
            0
          ) / recommendedJobs.length
        )
      : 0;

  const profileFields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.resume,
    user?.skills?.length > 0,
  ];

  const completedFields = profileFields.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const appliedJobIds = new Set(
  applications.map((app) => app.jobId?._id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>

        <p
          className="mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Your dashboard is connected to live data.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase size={20} />}
          title="Jobs Applied"
          value={jobsApplied}
          trend={`${jobsApplied} applications`}
          color="green"
        />

        <StatCard
          icon={<Phone size={20} />}
          title="Interview Calls"
          value={interviewCalls}
          trend={`${interviewCalls} interviews`}
          color="blue"
        />

        <StatCard
          icon={<Target size={20} />}
          title="Match Score Avg"
          value={`${avgMatchScore}%`}
          trend="AI Recommendation"
          color="blue"
        />

        <StatCard
          icon={<UserCheck size={20} />}
          title="Profile Completion"
          value={`${profileCompletion}%`}
          trend={`${completedFields}/${profileFields.length} fields`}
          color="yellow"
        />
      </div>

      {/* Recommended */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Recommended for You
            </h2>

            <Link
              to="/recommended"
              className="text-sm text-accent hover:underline"
            >
              See All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="120px" />
              ))}
            </div>
          ) : recommendedJobs.length > 0 ? (
            <div className="grid gap-4">
              {recommendedJobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.id || job._id}
                  job={job}
                  onApply={handleApply}
                  applied={appliedJobIds.has(job._id)}
                />
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center text-sm"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              No recommended jobs are available right now.
            </div>
          )}
        </div>

        <Card className="lg:col-span-2">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Chat with Career Coach
          </h2>

          <div className="space-y-2 mb-4">
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: "var(--glass-bg)",
                color: "var(--text-secondary)",
              }}
            >
              What skills should I focus on?
            </div>

            <div className="rounded-lg bg-accent/20 px-3 py-2 text-sm text-gray-200">
              Focus on React, TypeScript, and system design.
            </div>
          </div>

          <Link
            to="/career-coach"
            className="text-sm text-accent hover:underline"
          >
            Start conversation →
          </Link>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Applications
          </h2>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">
                      {app.jobId?.title}
                    </p>

                    <p className="text-sm text-gray-400">
                      {app.jobId?.company}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent"
                    >
                      {app.status}
                    </span>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center text-sm"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              No recent applications are available yet.
            </div>
          )}
        </Card>

      {/* Skills */}
      <div>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Skill Recommendations
        </h2>

        <div
          className="rounded-xl p-8 text-center text-sm"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
          }}
        >
          Skill recommendations are not available yet.
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;