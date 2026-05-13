import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatSalary, formatDate, whatsappLink } from "@/lib/utils";
import { MapPin, Tag, Phone, MessageCircle, Building2, Calendar } from "lucide-react";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      employer: { select: { companyName: true, website: true } },
    },
  });

  if (!job) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
        <p className="text-emerald-700 font-medium text-lg mb-6">
          {job.employer.companyName}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {job.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            {job.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(job.createdAt)}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Iş beýany</h3>
          <div className="whitespace-pre-wrap">{job.description}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Habarlaşmak</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {job.whatsapp && (
              <a
                href={whatsappLink(job.whatsapp, job.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            )}
            {job.phone && (
              <a
                href={`tel:${job.phone}`}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-100 font-medium"
              >
                <Phone className="w-5 h-5" />
                {job.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <a href="/" className="text-sm text-emerald-600 hover:underline">
          ← Ähli iş bildirişler
        </a>
      </div>
    </div>
  );
}
