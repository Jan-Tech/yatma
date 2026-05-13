import Link from "next/link";
import { MapPin, Tag, Star } from "lucide-react";
import { formatSalary, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    city: string;
    category: string;
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
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "block bg-white rounded-lg border p-5 hover:shadow-md transition-shadow",
        job.featured && "border-emerald-400 bg-emerald-50"
      )}
    >
      {job.featured && (
        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mb-2">
          <Star className="w-3 h-3 fill-emerald-500" />
          Öňe çykarylan
        </div>
      )}
      <h2 className="font-semibold text-gray-900 text-base mb-1">{job.title}</h2>
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
