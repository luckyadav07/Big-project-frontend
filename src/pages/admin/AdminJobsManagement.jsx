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
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    skills: "",
    stipend: "",
    deadline: "",
    duration: "",
    jobUrl: "",
  });

  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    fetchJobs();
  }, []);

  const getJobId = (job) => job?.id || job?._id;
  const companies = [...new Set(jobs.map((job) => job.company).filter(Boolean))];
  const locations = [...new Set(jobs.map((job) => job.location).filter(Boolean))];
  const filteredJobs = jobs.filter((job) => {
  const keyword = search.toLowerCase();

  const matchesSearch =
    job.title?.toLowerCase().includes(keyword) ||
    job.company?.toLowerCase().includes(keyword) ||
    job.location?.toLowerCase().includes(keyword);

  const matchesCompany =
    !companyFilter || job.company === companyFilter;

  const matchesLocation =
    !locationFilter || job.location === locationFilter;

  return matchesSearch && matchesCompany && matchesLocation;
});
  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminJobs();

      const jobsArray =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.jobs)
          ? response.jobs
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.jobs)
          ? response.data.jobs
          : [];

      setJobs(jobsArray);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load jobs."
      );
      setJobs([]);
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
  skills: "",
  stipend: "",
  deadline: "",
  duration: "",
  jobUrl: "",
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
    skills: Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "",
    stipend: job.stipend || "",
    deadline: job.deadline
      ? job.deadline.substring(0, 10)
      : "",
    duration: job.duration || "",
    jobUrl: job.jobUrl || "",
  });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
    setError("");
  };

  const parseApiError = (apiError) => {
    if (!apiError) return null;
    if (typeof apiError === "string") return apiError;
    if (apiError.message) return apiError.message;
    if (apiError.error) return apiError.error;
    if (Array.isArray(apiError)) return apiError.join(" ");

    const values = Object.values(apiError).flatMap((value) => {
      if (typeof value === "string") return [value];
      if (Array.isArray(value)) return value;
      return [];
    });
    return values.join(" ") || null;
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSaving(true);
  setError("");

  const payload = {
    title: form.title,
    company: form.company,
    location: form.location,
    skills: form.skills
      ? form.skills.split(",").map((s) => s.trim())
      : [],
    stipend: Number(form.stipend) || 0,
    deadline: form.deadline,
    duration: form.duration,
    jobUrl: form.jobUrl,
  };

  try {
    if (editingJob) {
      const response = await updateAdminJob(
        getJobId(editingJob),
        payload
      );

      const updatedJob =
        response?.data?.job ||
        response?.job ||
        response?.data ||
        response;

      setJobs((prev) =>
        prev.map((job) =>
          getJobId(job) === getJobId(updatedJob)
            ? updatedJob
            : job
        )
      );

      showToast("Job updated successfully");
    } else {
      const response = await createAdminJob(payload);

      const createdJob =
        response?.data?.job ||
        response?.job ||
        response?.data ||
        response;

      setJobs((prev) => [createdJob, ...prev]);

      showToast("Job created successfully");
    }

    closeModal();
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to save job."
    );
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (job) => {
    if (!window.confirm("Delete this job permanently?")) return;

    try {
      await deleteAdminJob(getJobId(job));

      setJobs((prev) =>
        prev.filter(
          (item) => getJobId(item) !== getJobId(job)
        )
      );

      showToast("Job removed successfully");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete job.",
        "danger"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Job Management
          </h1>
          <p className="text-gray-400">
            Manage job postings, update listings, and remove outdated
            roles.
          </p>
        </div>

        <Button size="sm" onClick={openCreateModal}>
          <Plus size={16} />
          Create Job
        </Button>
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">

        <Input
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
        >
          <option value="">All Companies</option>

          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
        >
          <option value="">All Locations</option>

          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

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
                <th className="px-4 py-3">S.No</th>
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
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    Loading jobs...
                  </td>
                </tr>
              ) : !Array.isArray(filteredJobs) || filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No jobs found. Create the first job post to get
                    started.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr
                    key={getJobId(job)}
                    className="border-t border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-white">
                      {job.title}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {job.company}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {job.location || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          job.status === "active"
                            ? "success"
                            : "warning"
                        }
                      >
                        {job.status || "draft"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(job)}
                          className="text-accent hover:text-accent/80"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(job)}
                          className="text-danger hover:text-danger/80"
                        >
                          <Trash2 size={16} />
                        </button>
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
          <h2 className="text-xl font-semibold text-white">
            {editingJob ? "Edit Job" : "Create Job"}
          </h2>
          <p className="text-sm text-gray-400">
            Fill the job details below.
          </p>
        </div>

        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title"
          placeholder="Frontend Developer"
          value={form.title}
          onChange={(e) =>
            handleFieldChange("title", e.target.value)
          }
          required
        />

        <Input
          label="Company"
          placeholder="Google"
          value={form.company}
          onChange={(e) =>
            handleFieldChange("company", e.target.value)
          }
          required
        />

        <Input
          label="Location"
          placeholder="Bangalore"
          value={form.location}
          onChange={(e) =>
            handleFieldChange("location", e.target.value)
          }
        />

        <Input
          label="Skills (comma separated)"
          placeholder="React, Node.js, MongoDB"
          value={form.skills}
          onChange={(e) =>
            handleFieldChange("skills", e.target.value)
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stipend"
            type="number"
            placeholder="25000"
            value={form.stipend}
            onChange={(e) =>
              handleFieldChange("stipend", e.target.value)
            }
          />

          <Input
            label="Duration"
            placeholder="6 Months"
            value={form.duration}
            onChange={(e) =>
              handleFieldChange("duration", e.target.value)
            }
          />
        </div>

        <Input
          label="Deadline"
          type="date"
          value={form.deadline}
          onChange={(e) =>
            handleFieldChange("deadline", e.target.value)
          }
        />

        <Input
          label="Job URL"
          placeholder="https://company.com/careers/job123"
          value={form.jobUrl}
          onChange={(e) =>
            handleFieldChange("jobUrl", e.target.value)
          }
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={saving}
          >
            {editingJob ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default AdminJobsManagement;