import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  // Create employers if they don't exist
  const employers = [
    {
      email: "turkmenbashi-oil@yatma.tm",
      companyName: "Türkmenbaşy Nebiti",
      phone: "+99343222111",
      whatsapp: "+99365222111",
      city: "Türkmenbaşy",
    },
    {
      email: "caspian-port@yatma.tm",
      companyName: "Hazar Deňiz Porty",
      phone: "+99343221000",
      whatsapp: "+99365221000",
      city: "Türkmenbaşy",
    },
    {
      email: "balkan-build@yatma.tm",
      companyName: "Balkan Gurluşyk",
      phone: "+99343220500",
      whatsapp: "+99365220500",
      city: "Türkmenbaşy",
    },
  ];

  const createdEmployers: Array<{ id: string; city: string }> = [];

  for (const emp of employers) {
    const existing = await prisma.user.findUnique({ where: { email: emp.email } });
    if (existing) {
      const employer = await prisma.employer.findUnique({ where: { userId: existing.id } });
      if (employer) createdEmployers.push({ id: employer.id, city: emp.city });
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password,
        role: "EMPLOYER",
        employer: {
          create: {
            companyName: emp.companyName,
            phone: emp.phone,
            whatsapp: emp.whatsapp,
            approved: true,
          },
        },
      },
      include: { employer: true },
    });
    createdEmployers.push({ id: user.employer!.id, city: emp.city });
  }

  const [oilId, portId, buildId] = createdEmployers.map((e) => e.id);

  const jobs = [
    {
      employerId: oilId,
      title: "Nebit guýulary operatory",
      description:
        "Borçlar:\n— Nebit guýularynyň gündelik işini dolandyrmak\n— Enjamlaryň tehniki ýagdaýyny barlamak\n— Önümçilik görkezijilerini hasaba almak\n\nTalaplar:\n— Nebit-gaz pudagynda 2 ýyldan az bolmadyk tejribe\n— Tehniki bilim (orta ýa-da ýokary)\n— Fiziki taýdan sagdyn\n\nBiz hödürleýäris:\n— Resmi iş ýeri we sosial paket\n— Gezekleşikli iş tertibi (15/15)\n— Korporatiw iýmit we ýaşaýyş",
      city: "Türkmenbaşy",
      category: "Nebit we gaz",
      salaryMin: 3200,
      salaryMax: 4500,
      currency: "TMT",
      phone: "+99343222111",
      whatsapp: "+99365222111",
      featured: true,
      status: "ACTIVE" as const,
    },
    {
      employerId: oilId,
      title: "Himiýa inženeri (Refinery)",
      description:
        "Nebiti gaýtadan işleýiş zawodynda himiýa inženeri gerek.\n\nBorçlar:\n— Himiýa proseslerini gözegçilik etmek\n— Önümleriň hilini barlamak\n— Hasabat taýýarlamak\n\nTalaplar:\n— Himiýa ýa-da himiýa inženerçilik boýunça ýokary bilim\n— Iş tejribesi 3 ýyldan az bolmaly däl\n— Türkmen we rus dillerini bilmek",
      city: "Türkmenbaşy",
      category: "Nebit we gaz",
      salaryMin: 4000,
      salaryMax: 6000,
      currency: "TMT",
      phone: "+99343222111",
      whatsapp: "+99365222111",
      featured: false,
      status: "ACTIVE" as const,
    },
    {
      employerId: portId,
      title: "Kran operatory",
      description:
        "Hazar deňiz portunda kran operatory gerek.\n\nBorçlar:\n— Port kranlaryny dolandyrmak\n— Ýük düşürmek we ýüklemek işlerini ýerine ýetirmek\n— Howpsuzlyk düzgünlerini berjaý etmek\n\nTalaplar:\n— Kran dolandyrmak boýunça güwäname\n— Tejribe 1 ýyldan ýokary\n— Jogapkärçilikli we ünsli\n\nIş tertibi: Smenaly, 2/2",
      city: "Türkmenbaşy",
      category: "Ulag we logistika",
      salaryMin: 2200,
      salaryMax: 3000,
      currency: "TMT",
      phone: "+99343221000",
      whatsapp: "+99365221000",
      featured: false,
      status: "ACTIVE" as const,
    },
    {
      employerId: portId,
      title: "Gümrük resmileşdiriş hünärmeni",
      description:
        "Deňiz portunda gümrük işleri boýunça hünärmen gerek.\n\nBorçlar:\n— Ýük resminamalaryny taýýarlamak\n— Gümrük resmileşdiriş işlerini geçirmek\n— Daşary ýurtly hyzmatdaşlar bilen iş alyp barmak\n\nTalaplar:\n— Ýokary hukuk ýa-da ykdysady bilim\n— Gümrük işinde tejribe 2 ýyl\n— Iňlis ýa-da rus dilini bilmek",
      city: "Türkmenbaşy",
      category: "Dolandyryş işi",
      salaryMin: 2500,
      salaryMax: 3500,
      currency: "TMT",
      whatsapp: "+99365221000",
      featured: false,
      status: "ACTIVE" as const,
    },
    {
      employerId: buildId,
      title: "Gurluşyk ussasy",
      description:
        "Balkan welaýatynda gurluşyk taslamasy üçin tejribeli usta gerek.\n\nBorçlar:\n— Beton we kerpiç işleri\n— Suvak we timarlaýyş işleri\n— Taslamanyň tertibi boýunça işlemek\n\nTalaplar:\n— Gurluşyk ussa hökmünde 3 ýyldan ýokary tejribe\n— Takyk we çalt işlemek başarnygy\n\nÝaşaýyş we iýmit üpjün edilýär.",
      city: "Türkmenbaşy",
      category: "Gurluşyk",
      salaryMin: 1800,
      salaryMax: 2500,
      currency: "TMT",
      phone: "+99343220500",
      whatsapp: "+99365220500",
      featured: false,
      status: "ACTIVE" as const,
    },
    {
      employerId: buildId,
      title: "Elektrik montažçy",
      description:
        "Täze gurluşyk taslamasynda elektrik gurnamalary üçin hünärmen gerek.\n\nBorçlar:\n— Elektrik geçirijilerini çekmek we birikdirmek\n— Paýlaýjy щitlary gurnap düzmek\n— Elektrik ulgamlaryny synagdan geçirmek\n\nTalaplar:\n— Elektrik işleri boýunça orta hünär bilimi\n— Tejribe 2 ýyldan ýokary\n— 3-nji topar elektrik howpsuzlygy",
      city: "Türkmenbaşy",
      category: "Gurluşyk",
      salaryMin: 2000,
      salaryMax: 3000,
      currency: "TMT",
      phone: "+99343220500",
      whatsapp: "+99365220500",
      featured: false,
      status: "ACTIVE" as const,
    },
  ];

  let created = 0;
  for (const job of jobs) {
    if (!job.employerId) continue;
    await prisma.job.create({ data: job });
    created++;
  }

  console.log(`${created} sany Türkmenbaşy iş bildirişi döredildi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
