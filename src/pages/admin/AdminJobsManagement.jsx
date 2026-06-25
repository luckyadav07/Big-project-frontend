import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import useUIStore from "../../store/uiStore.js";
import {
  getAdminJobs,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
} from "../../services/adminService.js";

function AdminJobsManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    status: "active",
  });
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    fetchJobs();
  }, []);

  const getJobId = (job) => job.id || job._id;

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminJobs();
      // Ensure response is always an array
      const jobsArray = Array.isArray(response) ? response : [];
      setJobs(jobsArray);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load jobs.");
      setJobs([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setForm({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      status: "active",
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "Full-time",
      salary: job.salary || "",
      description: job.description || "",
      status: job.status || "active",
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
    setError("");
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingJob) {
        const response = await updateAdminJob(getJobId(editingJob), form);
        const updatedJob = response?.job || response;
        setJobs((prev) => prev.map((job) => (getJobId(job) === getJobId(updatedJob) ? updatedJob : job)));
        addToast("Job updated successfully");
      } else {
        const response = await createAdminJob(form);
        const createdJob = response?.job || response;
        setJobs((prev) => [createdJob, ...prev]);
        addToast("Job created successfully");
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to save job.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm("Delete this job permanently?")) return;

    try {
      await deleteAdminJob(getJobId(job));
      setJobs((prev) => prev.filter((item) => getJobId(item) !== getJobId(job)));
      addToast("Job removed successfully");
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Unable to delete job.", "danger");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Management</h1>
          <p className="text-gray-400">Manage job postings, update listings, and remove outdated roles.</p>
        </div>
        <Button size="sm" onClick={openCreateModal}>
          <Plus size={16} /> Create Job
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 bg-white/5">
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">Loading jobs...</td>
                </tr>
              ) : !Array.isArray(jobs) || jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No jobs found. Create the first job post to get started.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={getJobId(job)} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{getJobId(job)}</td>
                    <td className="px-4 py-3 text-white">{job.title}</td>
                    <td className="px-4 py-3 text-gray-400">{job.company}</td>
                    <td className="px-4 py-3 text-gray-400">{job.location || "—"}</td>
                    <td className="px-4 py-3"><Badge variant={job.status === "active" ? "success" : "warning"}>{job.status || "draft"}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(job)} className="text-accent hover:text-accent/80"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(job)} className="text-danger hover:text-danger/80"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-navy-light border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">{editingJob ? "Edit Job" : "Create Job"}</h2>
                <p className="text-sm text-gray-400">Use backend job admin controls to keep listings up to date.</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Job Title"
                placeholder="Frontend Developer"
                value={form.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
              />
              <Input
                label="Company"
                placeholder="JobReach AI"
                value={form.company}
                onChange={(e) => handleFieldChange("company", e.target.value)}
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Location"
                  placeholder="Bangalore, India"
                  value={form.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                />
                <Input
                  label="Job Type"
                  placeholder="Full-time"
                  value={form.type}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Salary"
                  placeholder="₹12,00,000 - ₹18,00,000"
                  value={form.salary}
                  onChange={(e) => handleFieldChange("salary", e.target.value)}
                />
                <Input
                  label="Status"
                  placeholder="active"
                  value={form.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Write the job description and requirements here..."
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                <Button type="submit" loading={saving}>{editingJob ? "Update Job" : "Create Job"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminJobsManagement;
