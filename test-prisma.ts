import { PrismaClient } from '@prisma/client'

async function main() {
  try {
    console.log("Instantiating Prisma Client...");
    const prisma = new PrismaClient();
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Querying...");
    const leads = await prisma.lead.findMany();
    console.log("Leads:", leads);
    await prisma.$disconnect();
  } catch (e) {
    console.error("Crash:", e);
  }
}

main();
