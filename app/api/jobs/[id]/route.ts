import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.employerId !== session.user.employerId) {
    return NextResponse.json({ error: "Tapylmady" }, { status: 404 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
