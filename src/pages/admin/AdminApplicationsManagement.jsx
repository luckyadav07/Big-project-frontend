import { useEffect, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/applicationService.js";
import useUIStore from "../../store/uiStore.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import LoadingState from "../../components/common/LoadingState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";

const STATUS_OPTIONS = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Accepted",
  "Rejected",
];

const statusColor = {
  Applied: "text-yellow-400",
  Shortlisted: "text-blue-400",
  Interview: "text-orange-400",
  Accepted: "text-green-400",
  Rejected: "text-red-400",
};

function AdminApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const success = useUIStore((s) => s.success);
  const errorToast = useUIStore((s) => s.error);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();

      setApplications(data);

      const statusMap = {};
      data.forEach((app) => {
        statusMap[app._id] = app.status;
      });

      setSelectedStatus(statusMap);
    } catch (err) {
      errorToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    try {
      await updateApplicationStatus(id, selectedStatus[id]);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status: selectedStatus[id] }
            : app
        )
      );

      success("Application status updated successfully!");
    } catch (err) {
      errorToast(getErrorMessage(err));
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No Applications"
        description="No users have applied for jobs yet."
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Manage Applications
      </h1>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left text-gray-300">Applicant</th>
              <th className="p-4 text-left text-gray-300">Email</th>
              <th className="p-4 text-left text-gray-300">Job</th>
              <th className="p-4 text-left text-gray-300">Company</th>
              <th className="p-4 text-left text-gray-300">Status</th>
              <th className="p-4 text-center text-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 text-white">
                  {app.userId?.name}
                </td>

                <td className="p-4 text-gray-300">
                  {app.userId?.email}
                </td>

                <td className="p-4 text-white">
                  {app.jobId?.title}
                </td>

                <td className="p-4 text-gray-300">
                  {app.jobId?.company}
                </td>

                <td className="p-4">
                  <select
                    value={selectedStatus[app._id]}
                    onChange={(e) =>
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [app._id]: e.target.value,
                      }))
                    }
                    className={`rounded-lg border border-white/10 bg-navy px-3 py-2 ${statusColor[selectedStatus[app._id]]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => handleSave(app._id)}
                    disabled={selectedStatus[app._id] === app.status}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminApplicationsManagement;