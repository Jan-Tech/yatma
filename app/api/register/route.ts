import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2).max(100),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nädogry maglumatlar" }, { status: 400 });
  }

  const { email, password, companyName, phone, whatsapp } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Bu e-poçta eýýäm hasaba alnan" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "EMPLOYER",
      employer: {
        create: {
          companyName,
          phone: phone || null,
          whatsapp: whatsapp || null,
          approved: false,
        },
      },
    },
  });

  return NextResponse.json({ ok: true });
}
