import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/JobCard";
import { SearchFilters } from "@/components/SearchFilters";
import { CITIES, CATEGORIES, SHORT_TERM_TYPES, LONG_TERM_TYPES } from "@/lib/constants";

interface SearchParams {
  q?: string;
  city?: string;
  category?: string;
  jobType?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { q, city, category, jobType } = params;

  const isFiltering = q || city || category || jobType;

  const baseWhere = {
    status: "ACTIVE" as const,
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(city && { city }),
    ...(category && { category }),
  };

  const include = { employer: { select: { companyName: true } } };
  const orderBy = [{ featured: "desc" as const }, { createdAt: "desc" as const }];

  // Flat list when user is searching/filtering
  if (isFiltering) {
    const jobs = await prisma.job.findMany({
      where: { ...baseWhere, ...(jobType && { jobType }) },
      include,
      orderBy,
    });

    return (
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Türkmenistanda iş</h1>
          <p className="text-gray-500">{jobs.length} iş bildirişi tapyldy</p>
        </div>
        <Suspense fallback={<div className="h-16 bg-white rounded-lg border animate-pulse" />}>
          <SearchFilters cities={CITIES} categories={CATEGORIES} />
        </Suspense>
        <div className="mt-6 flex flex-col gap-3">
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Iş bildirişi tapylmady</p>
              <p className="text-sm mt-1">Süzgüçleri üýtgedip görüň</p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    );
  }

  // Default: side-by-side 60/40 layout
  const [longTermJobs, shortTermJobs] = await Promise.all([
    prisma.job.findMany({
      where: { ...baseWhere, jobType: { in: LONG_TERM_TYPES } },
      include,
      orderBy,
    }),
    prisma.job.findMany({
      where: { ...baseWhere, jobType: { in: SHORT_TERM_TYPES } },
      include,
      orderBy,
    }),
  ]);

  const total = longTermJobs.length + shortTermJobs.length;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Türkmenistanda iş</h1>
        <p className="text-gray-500">Häzir {total} iş bildirişi bar</p>
      </div>

      <Suspense fallback={<div className="h-16 bg-white rounded-lg border animate-pulse" />}>
        <SearchFilters cities={CITIES} categories={CATEGORIES} />
      </Suspense>

      <div className="mt-8 flex gap-6 items-start">

        {/* LEFT — Long-term 60% */}
        <div className="flex-[3] min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <h2 className="font-bold text-gray-900 text-lg">Uzyn möhletli işler</h2>
            <span className="text-sm text-gray-400 ml-1">({longTermJobs.length})</span>
          </div>

          <div className="flex flex-col gap-3">
            {longTermJobs.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed">
                Häzir uzyn möhletli iş ýok
              </div>
            ) : (
              longTermJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 self-stretch mt-10" />

        {/* RIGHT — Short-term 40% */}
        <div className="flex-[2] min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-orange-400 shrink-0" />
            <h2 className="font-bold text-gray-900 text-lg">Gysga möhletli işler</h2>
            <span className="text-sm text-gray-400 ml-1">({shortTermJobs.length})</span>
          </div>

          <div className="flex flex-col gap-3">
            {shortTermJobs.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed">
                Häzir gysga möhletli iş ýok
              </div>
            ) : (
              shortTermJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
