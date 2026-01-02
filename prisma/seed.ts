import "dotenv/config";
import prisma from "@/lib/prisma";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient({});

async function main() {
  console.log("Start seeding...");
  const adminClerkId = process.env.ADMIN_CLERK_ID;

  if (!adminClerkId) {
    throw new Error("ADMIN_CLERK_ID is missing in .env");
  }

  const findAdmin = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (findAdmin) {
    throw new Error("admin already exist");
  }

  await prisma.user.upsert({
    where: { id: adminClerkId },
    update: {},
    create: {
      id: adminClerkId,
      username: "admin",
      role: "ADMIN",
      displayName: "Admin",
    },
  });

  await prisma.admin.upsert({
    where: { id: adminClerkId },
    update: {},
    create: {
      id: adminClerkId,
      username: "admin",
      userId: adminClerkId,
    },
  });

  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
  });

  if (grades.length === 0) {
    await prisma.grade.createMany({
      data: [
        { level: 1 },
        { level: 2 },
        { level: 3 },
        { level: 4 },
        { level: 5 },
        { level: 6 },
      ],
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
