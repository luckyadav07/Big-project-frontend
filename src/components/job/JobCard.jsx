import { Link } from "react-router-dom";
import { MapPin, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../common/Card.jsx";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import { getInitials } from "../../utils/formatters.js";

function JobCard({
  job,
  onApply,
  onSave,
  applied = false,
  showMatchScore = true,
  showMatchReason = false,
}) {
  const id = job.id || job._id;

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card hover className="!p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent">
            {getInitials(job.company)}
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/jobs/${id}`} className="text-base font-semibold hover:text-accent transition line-clamp-1"
style={{ color: "var(--text-primary)" }}>
              {job.title}
            </Link>
            <p className="text-sm"
style={{ color: "var(--text-secondary)" }}>{job.company}</p>
          </div>
          {showMatchScore && job.matchScore && (
            <Badge variant="info">{job.matchScore}% match</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs"
style={{ color: "var(--text-secondary)" }}>
            <MapPin size={12} /> {job.location}
          </span>
          {job.salary && <span className="text-xs text-success font-medium">{job.salary}</span>}
        </div>

        {showMatchReason && job.matchingSkills && (
          <p className="text-xs mb-3"
style={{ color: "var(--text-secondary)" }}>
            {job.matchScore}% match: {job.matchingSkills.join(", ")} match your skills
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.skills || []).slice(0, 3).map((skill) => (
            <span key={skill} className="rounded-md px-2 py-0.5 text-xs"
style={{
  background: "var(--glass-bg)",
  color: "var(--text-secondary)",
}}>{skill}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className={`flex-1 ${
              applied
                ? "bg-green-600 hover:bg-green-600 cursor-default"
                : ""
            }`}
            disabled={applied}
            onClick={() => onApply?.(job)}
          >
            {applied ? "✓ Applied" : "Apply"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default JobCard;
