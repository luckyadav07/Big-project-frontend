import { useEffect, useState } from "react";
import JobCard from "../../components/job/JobCard.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import useJobStore from "../../store/jobStore.js";
import useUIStore from "../../store/uiStore.js";

function RecommendedJobsPage() {
  const { recommendedJobs, loading, fetchRecommended } = useJobStore();
  const showToast = useUIStore((s) => s.showToast);
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

  const sorted = [...recommendedJobs].sort((a, b) => {
    if (sortBy === "match") return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === "newest") return new Date(b.postedAt) - new Date(a.postedAt);
    return 0;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs Recommended for You</h1>
          <p className="text-gray-400 mt-1">Based on your skills, experience, and preferences</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="match" className="bg-navy">By match score</option>
          <option value="newest" className="bg-navy">By date posted</option>
        </select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} height="200px" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((job) => (
            <JobCard key={job.id || job._id} job={job} showMatchReason onApply={() => showToast("Application submitted!", "success")} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendedJobsPage;
