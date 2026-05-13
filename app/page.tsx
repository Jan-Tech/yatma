import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/JobCard";
import { SearchFilters } from "@/components/SearchFilters";
import { CITIES, CATEGORIES } from "@/lib/constants";

interface SearchParams {
  q?: string;
  city?: string;
  category?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { q, city, category } = params;

  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(city && { city }),
      ...(category && { category }),
    },
    include: {
      employer: { select: { companyName: true } },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Türkmenistanda iş
        </h1>
        <p className="text-gray-500">
          Häzir {jobs.length} iş bildirişi bar
        </p>
      </div>

      <Suspense fallback={<div className="h-16 bg-white rounded-lg border border-gray-200 animate-pulse" />}>
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
