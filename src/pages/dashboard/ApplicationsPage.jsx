import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import ApplicationCard, {
  StatusBadge,
} from "../../components/application/ApplicationCard.jsx";
import useUIStore from "../../store/uiStore.js";
import {
  getApplications,
  withdrawApplication,
} from "../../services/applicationService.js";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getApplications();

      setApplications(data);
    } catch (err) {
      console.error(err);

      if (err.response?.status !== 404) {
        showToast("Failed to load applications", "error");
      }

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await withdrawApplication(id);

      setApplications((prev) =>
        prev.filter((app) => app._id !== id)
      );

      showToast({
  message: "Application withdrawn!",
  type: "success",
});
    } catch (err) {
      console.error(err);
      showToast("Failed to withdraw application", "error");
    }
  };

  const filtered = useMemo(() => {
    let result = [...applications];

    if (statusFilter !== "all") {
      result = result.filter(
        (a) =>
          a.status.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();

      result = result.filter(
        (a) =>
          a.jobId?.title?.toLowerCase().includes(q) ||
          a.jobId?.company?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
    }

    return result;
  }, [applications, statusFilter, sortBy, search]);

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Loading applications...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        My Applications
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <Card className="!p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No applications found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-white/10"
                >
                  <td className="px-4 py-3 text-white">
                    {app.jobId?.title}
                  </td>

                  <td className="px-4 py-3">
                    {app.jobId?.company}
                  </td>

                  <td className="px-4 py-3">
                    {app.jobId?.location}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      app.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/jobs/${app.jobId?._id}`}
                      className="text-accent mr-3"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        handleWithdraw(app._id)
                      }
                      className="text-red-400"
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default ApplicationsPage;