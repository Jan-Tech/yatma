import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminActions } from "./AdminActions";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [pendingJobs, pendingEmployers, stats] = await Promise.all([
    prisma.job.findMany({
      where: { status: "PENDING" },
      include: { employer: { select: { companyName: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.employer.findMany({
      where: { approved: false },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.job.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count]));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin paneli</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Işjeň", value: statMap["ACTIVE"] ?? 0, color: "text-green-600" },
          { label: "Garaşylýar", value: statMap["PENDING"] ?? 0, color: "text-yellow-600" },
          { label: "Ret edildi", value: statMap["REJECTED"] ?? 0, color: "text-red-500" },
          { label: "Täze iş berijiler", value: pendingEmployers.length, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {pendingEmployers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Täze iş berijiler ({pendingEmployers.length})
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {pendingEmployers.map((emp) => (
              <div key={emp.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{emp.companyName}</p>
                  <p className="text-xs text-gray-500">{emp.user.email} · {formatDate(emp.createdAt)}</p>
                </div>
                <AdminActions type="employer" id={emp.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Garaşylýan iş bildirişler ({pendingJobs.length})
        </h2>
        {pendingJobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-10 text-center text-gray-400">
            Garaşylýan iş bildiriş ýok
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {pendingJobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">
                      {job.employer.companyName} · {job.city} · {formatDate(job.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                  </div>
                  <AdminActions type="job" id={job.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
