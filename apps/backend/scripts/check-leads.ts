import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [leadCount, ticketCount, internshipCount] = await Promise.all([
    prisma.lead.count(),
    prisma.clientTicket.count(),
    prisma.internshipApplication.count(),
  ]);

  console.log("\n=== Database Activity ===");
  console.log(`Leads:                  ${leadCount}`);
  console.log(`Tickets:                ${ticketCount}`);
  console.log(`Internship applications: ${internshipCount}`);

  if (leadCount > 0) {
    console.log("\n=== Latest 5 Leads ===");
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, email: true, company: true, serviceInterest: true, status: true, createdAt: true },
    });
    leads.forEach((l) => {
      console.log(`  [${l.status}] ${l.name} <${l.email}> · ${l.company} · ${l.serviceInterest ?? "—"}`);
    });
  }

  if (ticketCount > 0) {
    console.log("\n=== Latest 5 Tickets ===");
    const tickets = await prisma.clientTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { ticketNumber: true, clientName: true, priority: true, status: true, title: true },
    });
    tickets.forEach((t) => {
      console.log(`  ${t.ticketNumber} [${t.priority}/${t.status}] ${t.clientName} — ${t.title}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
