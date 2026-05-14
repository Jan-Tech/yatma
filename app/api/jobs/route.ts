import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(5000),
  city: z.string().min(1),
  category: z.string().min(1),
  jobType: z.string().default("Doly iş wagty"),
  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  currency: z.string().default("TMT"),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  if (!session.user.employerApproved) {
    return NextResponse.json(
      { error: "Hasabyňyz admin tarapyndan heniz tassyklanmady" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nädogry maglumatlar" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      employerId: session.user.employerId!,
      status: "PENDING",
    },
  });

  return NextResponse.json(job);
}
