import { useEffect, useState, useMemo } from "react";
import JobCard from "../../components/job/JobCard.jsx";
import FilterPanel from "../../components/job/FilterPanel.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import useJobStore from "../../store/jobStore.js";
import useUIStore from "../../store/uiStore.js";
import { applyJob } from "../../services/applicationService.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

const defaultFilters = {
  search: "",
  jobType: "",
  experienceLevel: "",
  sortBy: "relevance",
};

function JobsPage() {
  const { jobs, loading, fetchJobs } = useJobStore();

  const success = useUIStore((s) => s.success);
  const errorToast = useUIStore((s) => s.error);

  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  const perPage = 6;

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (filters.search) {
      const q = filters.search.toLowerCase();

      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q)
      );
    }

    if (filters.jobType) {
      result = result.filter((job) => job.jobType === filters.jobType);
    }

    if (filters.experienceLevel) {
      result = result.filter(
        (job) => job.experienceLevel === filters.experienceLevel
      );
    }

    if (filters.sortBy === "match") {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    if (filters.sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      );
    }

    return result;
  }, [jobs, filters]);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const handleApply = async (jobId) => {
    try {
      await applyJob(jobId);

      success("Application submitted successfully!");
    } catch (err) {
      errorToast(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Browse Jobs
      </h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            onReset={() => {
              setFilters(defaultFilters);
              setPage(1);
            }}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: perPage }).map((_, index) => (
                <Skeleton key={index} height="200px" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {paginated.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    onApply={() => handleApply(job._id)}
                    onSave={() =>
                      success("Job saved successfully!")
                    }
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setPage(index + 1)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          page === index + 1
                            ? "bg-accent text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;