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

  // When filtering by jobType or any search, show flat list
  if (isFiltering) {
    const jobs = await prisma.job.findMany({
      where: {
        ...baseWhere,
        ...(jobType && { jobType }),
      },
      include,
      orderBy,
    });

    return (
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Türkmenistanda iş</h1>
          <p className="text-gray-500">Häzir {jobs.length} iş bildirişi tapyldy</p>
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

  // Default: split into two sections
  const [shortTermJobs, longTermJobs] = await Promise.all([
    prisma.job.findMany({
      where: { ...baseWhere, jobType: { in: SHORT_TERM_TYPES } },
      include,
      orderBy,
    }),
    prisma.job.findMany({
      where: { ...baseWhere, jobType: { in: LONG_TERM_TYPES } },
      include,
      orderBy,
    }),
  ]);

  const total = shortTermJobs.length + longTermJobs.length;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Türkmenistanda iş</h1>
        <p className="text-gray-500">Häzir {total} iş bildirişi bar</p>
      </div>

      <Suspense fallback={<div className="h-16 bg-white rounded-lg border animate-pulse" />}>
        <SearchFilters cities={CITIES} categories={CATEGORIES} />
      </Suspense>

      <div className="mt-8 space-y-10">
        {/* Short-term section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
              <h2 className="text-lg font-bold text-gray-900">Gysga möhletli işler</h2>
            </div>
            <span className="text-sm text-gray-400">(Gündelik · Sagatlyk)</span>
            <span className="ml-auto text-sm text-gray-400">{shortTermJobs.length} iş</span>
          </div>

          {shortTermJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-lg border border-dashed">
              Häzir gysga möhletli iş bildirişi ýok
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {shortTermJobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </section>

        {/* Long-term section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <h2 className="text-lg font-bold text-gray-900">Uzyn möhletli işler</h2>
            </div>
            <span className="text-sm text-gray-400">(Doly · Bölekleýin)</span>
            <span className="ml-auto text-sm text-gray-400">{longTermJobs.length} iş</span>
          </div>

          {longTermJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-lg border border-dashed">
              Häzir uzyn möhletli iş bildirişi ýok
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {longTermJobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
