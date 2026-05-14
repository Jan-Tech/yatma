import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.union([
  z.object({ status: z.enum(["ACTIVE", "REJECTED", "PENDING"]) }),
  z.object({ featured: z.boolean() }),
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nädogry maglumatlar" }, { status: 400 });
  }

  const job = await prisma.job.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(job);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ygtyýarlandyrylmadyk" }, { status: 401 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
