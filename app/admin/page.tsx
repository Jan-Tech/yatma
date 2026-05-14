import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatSalary } from "@/lib/utils";
import { AdminJobActions } from "./AdminJobActions";
import { AdminEmployerActions } from "./AdminEmployerActions";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Garaşylýar",
  ACTIVE: "Işjeň",
  REJECTED: "Ret edildi",
  EXPIRED: "Möhleti geçdi",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-600",
};

const FILTER_OPTIONS = [
  { value: "PENDING", label: "Garaşylýar" },
  { value: "ACTIVE", label: "Işjeň" },
  { value: "REJECTED", label: "Ret edildi" },
  { value: "ALL", label: "Ählisi" },
];

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const { filter = "PENDING" } = await searchParams;

  const [jobs, allEmployers, stats] = await Promise.all([
    prisma.job.findMany({
      where: filter === "ALL" ? {} : { status: filter as "PENDING" | "ACTIVE" | "REJECTED" },
      include: { employer: { select: { companyName: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.employer.findMany({
      include: { user: { select: { email: true } }, jobs: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.groupBy({ by: ["status"], _count: true }),
  ]);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count]));
  const pendingEmployers = allEmployers.filter((e) => !e.approved);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin paneli</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Işjeň", value: statMap["ACTIVE"] ?? 0, color: "text-green-600" },
          { label: "Garaşylýar", value: statMap["PENDING"] ?? 0, color: "text-yellow-600" },
          { label: "Ret edildi", value: statMap["REJECTED"] ?? 0, color: "text-red-500" },
          { label: "Iş berijiler", value: allEmployers.length, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Pending employers */}
      {pendingEmployers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Tassyklanmadyk iş berijiler ({pendingEmployers.length})
          </h2>
          <div className="bg-white rounded-lg border border-orange-200 divide-y divide-gray-100">
            {pendingEmployers.map((emp) => (
              <div key={emp.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{emp.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {emp.user.email} · {emp.jobs.length} iş bildirişi · {formatDate(emp.createdAt)}
                  </p>
                </div>
                <AdminEmployerActions id={emp.id} approved={emp.approved} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All employers (collapsed) */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Ähli iş berijiler ({allEmployers.length})
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {allEmployers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">Iş beriji ýok</div>
          ) : (
            allEmployers.map((emp) => (
              <div key={emp.id} className="px-6 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{emp.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {emp.user.email} · {emp.jobs.length} iş bildirişi
                  </p>
                </div>
                <AdminEmployerActions id={emp.id} approved={emp.approved} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Jobs with filter */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Iş bildirişler</h2>
          <div className="flex gap-1">
            {FILTER_OPTIONS.map((opt) => (
              <a
                key={opt.value}
                href={`/admin?filter=${opt.value}`}
                className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${
                  filter === opt.value
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.label}
                {opt.value !== "ALL" && statMap[opt.value] !== undefined
                  ? ` (${statMap[opt.value]})`
                  : ""}
              </a>
            ))}
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-10 text-center text-gray-400">
            Bu bölümde iş bildirişi ýok
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {jobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                      {job.featured && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium shrink-0">
                          ★ Öňe çykarylan
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[job.status]}`}>
                        {STATUS_LABELS[job.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {job.employer.companyName} · {job.city} · {formatSalary(job.salaryMin, job.salaryMax, job.currency)} · {formatDate(job.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{job.description}</p>
                  </div>
                  <AdminJobActions
                    id={job.id}
                    status={job.status}
                    featured={job.featured}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
