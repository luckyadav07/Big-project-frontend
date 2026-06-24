import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import ApplicationCard, { StatusBadge } from "../../components/application/ApplicationCard.jsx";
import useUIStore from "../../store/uiStore.js";

function ApplicationsPage() {
  const [applications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const addToast = useUIStore((s) => s.addToast);

  const filtered = useMemo(() => {
    let result = [...applications];
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.jobTitle.toLowerCase().includes(q) || a.company.toLowerCase().includes(q));
    }
    if (sortBy === "newest") result.sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied));
    return result;
  }, [applications, statusFilter, sortBy, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent flex-1 min-w-[200px]"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white">
          <option value="all" className="bg-navy">All Status</option>
          <option value="applied" className="bg-navy">Applied</option>
          <option value="interview" className="bg-navy">Interview</option>
          <option value="offer" className="bg-navy">Offer</option>
          <option value="rejected" className="bg-navy">Rejected</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white">
          <option value="newest" className="bg-navy">Newest</option>
          <option value="oldest" className="bg-navy">Oldest</option>
        </select>
      </div>

      <div className="space-y-3 lg:hidden">
        {filtered.length > 0 ? (
          filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} onWithdraw={() => addToast("Application withdrawn", "warning")} />
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-400">
            No applications are available yet.
          </div>
        )}
      </div>

      <Card className="hidden lg:block !p-0 overflow-hidden">
        {filtered.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 bg-white/5">
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Date Applied</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Update</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id} className={`border-t border-white/5 hover:bg-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                  <td className="px-4 py-3 text-white">{app.jobTitle}</td>
                  <td className="px-4 py-3 text-gray-400">{app.company}</td>
                  <td className="px-4 py-3 text-gray-400">{app.dateApplied}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3 text-gray-400">{app.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <Link to={`/jobs/${app.id}`} className="text-accent hover:underline text-xs mr-3">View</Link>
                    <button onClick={() => addToast("Application withdrawn", "warning")} className="text-danger hover:underline text-xs">Withdraw</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-gray-400">No applications are available yet.</div>
        )}
      </Card>
    </div>
  );
}

export default ApplicationsPage;
