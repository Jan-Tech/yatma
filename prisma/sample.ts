import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();
  await prisma.employer.deleteMany();
  await prisma.user.deleteMany({ where: { role: "EMPLOYER" } });

  const password = await bcrypt.hash("password123", 12);

  const user1 = await prisma.user.create({
    data: {
      email: "petrogas@yatma.tm",
      password,
      role: "EMPLOYER",
      employer: {
        create: {
          companyName: "Türkmennebit",
          phone: "+99312441234",
          whatsapp: "+99365441234",
          approved: true,
        },
      },
    },
    include: { employer: true },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "tech@yatma.tm",
      password,
      role: "EMPLOYER",
      employer: {
        create: {
          companyName: "Aşgabat IT Merkezi",
          whatsapp: "+99365991234",
          approved: true,
        },
      },
    },
    include: { employer: true },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "hotel@yatma.tm",
      password,
      role: "EMPLOYER",
      employer: {
        create: {
          companyName: "Arçabil Myhmanhanasy",
          phone: "+99312295500",
          whatsapp: "+99365295500",
          approved: true,
        },
      },
    },
    include: { employer: true },
  });

  await prisma.job.createMany({
    data: [
      {
        employerId: user1.employer!.id,
        title: "Nebit gaýtadan işleýiş inženeri",
        description:
          "Borçlar:\n— Nebit gaýtadan işleýiş tehnologik proseslerini dolandyrmak\n— Hasabatlary taýýarlamak\n— Operatorlar bilen işleşmek\n\nTalaplar:\n— Ýokary tehniki bilim\n— Nebit pudagynda 2 ýyldan az bolmadyk iş tejribesi\n— Türkmen we rus dillerini bilmek\n\nIş şertleri:\n— Resmi iş ýeri\n— Gezekleşikli iş tertibi\n— Korporatiw ulag",
        city: "Türkmenbaşy",
        category: "Nebit we gaz",
        salaryMin: 3500,
        salaryMax: 5000,
        currency: "TMT",
        phone: "+99312441234",
        whatsapp: "+99365441234",
        featured: true,
        status: "ACTIVE",
      },
      {
        employerId: user2.employer!.id,
        title: "Programma üpjünçiligini işläp düzüji",
        description:
          "Korporatiw web goşundylaryny döretmek üçin tejribeli programmaçy gerek.\n\nTalaplar:\n— JavaScript / TypeScript\n— React ýa-da Vue\n— Maglumat bazalary (PostgreSQL, MySQL)\n— 1 ýyldan az bolmadyk iş tejribesi\n\nBiz hödürleýäris:\n— Aşgabadyň merkezinde döwrebap ofis\n— Çeýe iş tertibi\n— Hünär ösüşi",
        city: "Aşgabat",
        category: "IT we tehnologiýa",
        salaryMin: 2500,
        salaryMax: 4000,
        currency: "TMT",
        whatsapp: "+99365991234",
        featured: true,
        status: "ACTIVE",
      },
      {
        employerId: user3.employer!.id,
        title: "Myhmanhana administratory",
        description:
          "Bäş ýyldyzly myhmanhana resepsiýon administratory gerek.\n\nBorçlar:\n— Myhmanlary garşylamak we hasaba almak\n— Bron ediş ulgamy bilen işlemek\n— Myhmanlaryň soraglaryny çözmek\n\nTalaplar:\n— Myhmanhana işinde 1 ýyldan az bolmadyk tejribe\n— Türkmen, rus dillerini bilmek (iňlis dili artykmaçlyk)\n— Stres durnuklylygy\n\nIş tertibi: 2/2 gezekleşikli",
        city: "Aşgabat",
        category: "Myhmanhana we restoran",
        salaryMin: 1800,
        salaryMax: 2400,
        currency: "TMT",
        phone: "+99312295500",
        whatsapp: "+99365295500",
        status: "ACTIVE",
      },
      {
        employerId: user1.employer!.id,
        title: "Buhgalter",
        description:
          "Ilkinji resminamalary alyp barmak üçin buhgalter gerek.\n\nTalaplar:\n— Ýokary ykdysady bilim\n— 1C:Buhgalteriýa programmasyny bilmek\n— Ünslilik, takyklyk\n— 2 ýyldan az bolmadyk iş tejribesi",
        city: "Balkanabat",
        category: "Buhgalteriýa we maliýe",
        salaryMin: 2000,
        salaryMax: 2800,
        currency: "TMT",
        phone: "+99312441234",
        status: "ACTIVE",
      },
      {
        employerId: user2.employer!.id,
        title: "Iňlis dili mugallymy",
        description:
          "Dil mekdebi iňlis dili mugallymyny gözleýär.\n\nTalaplar:\n— Ýokary pedagogik ýa-da lingwistik bilim\n— Iňlis dili derejesi C1 we ýokary\n— 1 ýyldan az bolmadyk sapak beriş tejribesi\n\nIş tertibi: duşenbe–anna, 09:00–18:00",
        city: "Mary",
        category: "Bilim",
        salaryMin: 1500,
        salaryMax: 2200,
        currency: "TMT",
        whatsapp: "+99365991234",
        status: "ACTIVE",
      },
    ],
  });

  console.log("Nusgalyk maglumatlar döredildi.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
