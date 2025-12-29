// src/components/JobCard.tsx
import { Link } from "react-router-dom";
import type { Job } from "../services/jobs";
import Badge from "./ui/Badge";

type JobCardProps = {
  job: Job;
};

const JobCard = ({ job }: JobCardProps) => {
  const modalityLabel =
    job.modality === "REMOTE"
      ? "Remoto"
      : job.modality === "ONSITE"
      ? "Presencial"
      : "Híbrido";

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-sm
                 shadow-sm shadow-neutral-950/30 transition-colors transition-transform
                 hover:-translate-y-0.5 hover:border-brand-500 hover:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="line-clamp-1 font-semibold text-neutral-50">
            {job.title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <span className="text-neutral-500">📍</span>
              <span className="line-clamp-1">{job.location}</span>
            </span>

            {job.salary != null && (
              <span className="inline-flex items-center gap-1 text-brand-300">
                <span>💰</span>
                <span className="line-clamp-1">
                  {job.salary}
                </span>
              </span>
            )}
          </div>
        </div>

        {job.modality && (
          <Badge variant="primary">
            {modalityLabel}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
