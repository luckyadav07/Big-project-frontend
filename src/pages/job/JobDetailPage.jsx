import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Share2, Bookmark } from "lucide-react";
import api from "../../services/api.js";
import { applyJob } from "../../services/applicationService.js";
import { MOCK_JOBS } from "../../utils/mockData.js";
import { getInitials, formatRelativeTime } from "../../utils/formatters.js";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import useUIStore from "../../store/uiStore.js";

function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data || res.data);
      } catch {
        setJob(MOCK_JOBS.find((j) => j.id === id || j._id === id) || MOCK_JOBS[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
  try {
    setApplying(true);

    await applyJob(job._id);

    showToast("Application submitted successfully!", "success");
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to apply";

    showToast(message, "error");
  } finally {
    setApplying(false);
  }
};

  if (loading) return <div className="space-y-4"><Skeleton height="200px" /><Skeleton height="400px" /></div>;
  if (!job) return <div className="text-center py-16 text-gray-400">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent">
              {getInitials(job.company)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <p className="text-gray-400">{job.company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="neutral"><MapPin size={12} className="inline mr-1" />{job.location}</Badge>
                {job.salary && <Badge variant="success">{job.salary}</Badge>}
                {job.jobType && <Badge variant="info">{job.jobType}</Badge>}
              </div>
              {job.matchScore && (
                <p className="text-sm text-accent mt-2">{job.matchScore}% match based on your skills</p>
              )}
              {job.postedAt && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={12} /> Posted {formatRelativeTime(job.postedAt)}</p>}
            </div>
          </div>

          <Card>
            <h2 className="font-semibold text-white mb-3">Job Description</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{job.description}</p>
          </Card>

          <Card>
            <h2 className="font-semibold text-white mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((s) => (
                <span key={s} className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm text-gray-300">{s}</span>
              ))}
            </div>
          </Card>

          {job.requirements && (
            <Card>
              <h2 className="font-semibold text-white mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {job.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Card>
          )}

          {job.benefits && (
            <Card>
              <h2 className="font-semibold text-white mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {job.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <Button
              className="w-full mb-2"
              loading={applying}
              disabled={applying}
              onClick={handleApply}
            >
              {applying ? "Applying..." : "Apply Now"}
            </Button>
            <Button variant="outline" className="w-full mb-2" onClick={() => showToast("Job saved!", "success")}>
              <Bookmark size={16} /> Save Job
            </Button>
            <Button variant="secondary" className="w-full"><Share2 size={16} /> Share</Button>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="font-semibold text-white mb-3">Match Analysis</h3>
              {job.matchingSkills && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Matching skills</p>
                  <div className="flex flex-wrap gap-1">{job.matchingSkills.map((s) => <Badge key={s} variant="success">{s}</Badge>)}</div>
                </div>
              )}
              {job.missingSkills && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Skills to learn</p>
                  <div className="flex flex-wrap gap-1">{job.missingSkills.map((s) => <Badge key={s} variant="warning">{s}</Badge>)}</div>
                </div>
              )}
              <Link to="/recommended" className="text-sm text-accent hover:underline">View learning path →</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default JobDetailPage;
