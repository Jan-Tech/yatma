import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@yatma.tm";
  const password = "admin123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`Admin created: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
