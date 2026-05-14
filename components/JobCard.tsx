import Link from "next/link";
import { MapPin, Tag, Clock, Star } from "lucide-react";
import { formatSalary, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const JOB_TYPE_COLORS: Record<string, string> = {
  "Gündelik": "bg-orange-100 text-orange-700",
  "Sagatlyk": "bg-purple-100 text-purple-700",
  "Bölekleýin": "bg-blue-100 text-blue-700",
  "Doly iş wagty": "bg-gray-100 text-gray-600",
};

interface JobCardProps {
  job: {
    id: string;
    title: string;
    city: string;
    category: string;
    jobType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: string;
    featured: boolean;
    createdAt: Date | string;
    employer: {
      companyName: string;
    };
  };
}

export function JobCard({ job }: JobCardProps) {
  const isShortTerm = job.jobType === "Gündelik" || job.jobType === "Sagatlyk";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "block bg-white rounded-lg border p-5 hover:shadow-md transition-shadow",
        job.featured && "border-emerald-400 bg-emerald-50",
        isShortTerm && !job.featured && "border-orange-200"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h2 className="font-semibold text-gray-900 text-base">{job.title}</h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {job.featured && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Star className="w-3 h-3 fill-emerald-500" />
              Öňe çykarylan
            </span>
          )}
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
            JOB_TYPE_COLORS[job.jobType] ?? "bg-gray-100 text-gray-600"
          )}>
            {isShortTerm && <Clock className="w-3 h-3" />}
            {job.jobType}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{job.employer.companyName}</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.city}
        </span>
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {job.category}
        </span>
        <span className="font-medium text-gray-700">
          {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
        </span>
        <span className="ml-auto">{formatDate(job.createdAt)}</span>
      </div>
    </Link>
  );
}
