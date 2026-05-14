import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(session: Awaited<ReturnType<typeof getServerSession>>) {
  return (session as { user?: { role?: string } } | null)?.user?.role === "ADMIN";
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  const employer = await prisma.employer.update({
    where: { id },
    data: { approved: true },
  });

  return NextResponse.json(employer);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  await prisma.employer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
