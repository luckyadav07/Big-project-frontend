import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Phone, Target, UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import JobCard from "../../components/job/JobCard.jsx";
import Card from "../../components/common/Card.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import useJobStore from "../../store/jobStore.js";
import useUIStore from "../../store/uiStore.js";

function DashboardPage() {
  const { user } = useAuth();
  const { recommendedJobs, loading, error, fetchRecommended } = useJobStore();
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-gray-400 mt-1">Your dashboard is connected to live data.</p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Briefcase size={20} />} title="Jobs Applied" value="—" trend="—" color="green" />
        <StatCard icon={<Phone size={20} />} title="Interview Calls" value="—" trend="—" color="blue" />
        <StatCard icon={<Target size={20} />} title="Match Score Avg" value="—" color="blue" />
        <StatCard icon={<UserCheck size={20} />} title="Profile Completion" value="—" color="yellow" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
            <Link to="/recommended" className="text-sm text-accent hover:underline">See All</Link>
          </div>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} height="120px" />)}</div>
          ) : recommendedJobs.length > 0 ? (
            <div className="grid gap-4">
              {recommendedJobs.slice(0, 3).map((job) => (
                <JobCard key={job.id || job._id} job={job} onApply={() => addToast("Application submitted!", "success")} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
              No recommended jobs are available right now.
            </div>
          )}
        </div>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Chat with Career Coach</h2>
          <div className="space-y-2 mb-4">
            <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300">What skills should I focus on?</div>
            <div className="rounded-lg bg-accent/20 px-3 py-2 text-sm text-gray-200">Focus on React, TypeScript, and system design.</div>
          </div>
          <Link to="/career-coach" className="text-sm text-accent hover:underline">Start conversation →</Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Applications</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
          No recent applications are available yet.
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Skill Recommendations</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
          Skill recommendations are not available yet.
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
