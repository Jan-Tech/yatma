import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeleteJobButton } from "@/components/DeleteJobButton";

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

export default async function EmployerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EMPLOYER") {
    redirect("/login");
  }

  const employer = await prisma.employer.findUnique({
    where: { id: session.user.employerId! },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!employer) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{employer.companyName}</h1>
          {!employer.approved && (
            <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1.5 mt-2 inline-block">
              Hasabyňyz admin tarapyndan tassyklanmagyna garaşylýar
            </p>
          )}
        </div>
        {employer.approved && (
          <Link
            href="/employer/post"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium"
          >
            + Täze iş bildirişi
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Meniň iş bildirişlerim</h2>
        </div>

        {employer.jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Entek iş bildirişiňiz ýok</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {employer.jobs.map((job) => (
              <li key={job.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(job.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[job.status]}`}>
                    {STATUS_LABELS[job.status]}
                  </span>
                  <DeleteJobButton jobId={job.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
