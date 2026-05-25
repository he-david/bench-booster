import { PrismaClient, Role, Seniority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.questionRating.deleteMany();
  await prisma.question.deleteMany();

  const adminHash = await bcrypt.hash("changeme", 12);
  const userHash = await bcrypt.hash("changeme", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash: adminHash, role: Role.ADMIN },
    create: { username: "admin", passwordHash: adminHash, role: Role.ADMIN },
  });

  await prisma.user.upsert({
    where: { username: "user" },
    update: { passwordHash: userHash },
    create: { username: "user", passwordHash: userHash, role: Role.USER },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Design a scalable blob storage system similar to Azure Blob Storage. Walk through partitioning, replication, and consistency guarantees.",
        client: "Contoso",
        technology: "Azure",
        skillCategory: "System Design",
        seniority: Seniority.B3,
      },
      {
        text: "How would you architect a multi-region Azure deployment for a mission-critical application with an RTO of 5 minutes?",
        client: "Fabrikam",
        technology: "Azure",
        skillCategory: "System Design",
        seniority: Seniority.B4,
      },
      {
        text: "Explain the difference between Azure Service Bus and Azure Event Hubs. When would you choose one over the other?",
        client: "Contoso",
        technology: "Azure",
        skillCategory: "System Design",
        seniority: Seniority.B2,
      },
      {
        text: "Walk me through setting up CI/CD for an Azure Functions app using Azure DevOps pipelines.",
        client: "Northwind",
        technology: "Azure",
        skillCategory: "Problem Solving",
        seniority: Seniority.A5,
      },
      {
        text: "You have a Python data pipeline that processes 10M rows daily and runs in 6 hours. How would you optimize it?",
        client: "Fabrikam",
        technology: "Python",
        skillCategory: "Problem Solving",
        seniority: Seniority.B1,
      },
      {
        text: "Implement a thread-safe LRU cache in Python without using any external libraries.",
        client: "Contoso",
        technology: "Python",
        skillCategory: "Problem Solving",
        seniority: Seniority.A5,
      },
      {
        text: "Explain Python's GIL. How does it affect CPU-bound vs I/O-bound workloads, and what are your options to work around it?",
        client: "Northwind",
        technology: "Python",
        skillCategory: "System Design",
        seniority: Seniority.B2,
      },
      {
        text: "How do you manage state in a large React application? Compare Context API, Redux, Zustand, and React Query for different use cases.",
        client: "Fabrikam",
        technology: "React",
        skillCategory: "System Design",
        seniority: Seniority.B1,
      },
      {
        text: "Describe how React's reconciliation algorithm works and how the virtual DOM diffing strategy impacts performance.",
        client: "Contoso",
        technology: "React",
        skillCategory: "System Design",
        seniority: Seniority.B2,
      },
      {
        text: "A React component is re-rendering excessively. Walk me through how you'd diagnose and fix the performance issue.",
        client: "Northwind",
        technology: "React",
        skillCategory: "Problem Solving",
        seniority: Seniority.A4,
      },
      {
        text: "Design a database schema for a multi-tenant SaaS application in SQL Server. How do you handle tenant isolation?",
        client: "Fabrikam",
        technology: "SQL Server",
        skillCategory: "System Design",
        seniority: Seniority.B3,
      },
      {
        text: "Explain the difference between clustered and non-clustered indexes. When would adding an index hurt performance?",
        client: "Contoso",
        technology: "SQL Server",
        skillCategory: "Problem Solving",
        seniority: Seniority.A3,
      },
      {
        text: "Walk me through how you'd investigate a SQL Server query that went from 200ms to 8 seconds after a deployment.",
        client: "Northwind",
        technology: "SQL Server",
        skillCategory: "Problem Solving",
        seniority: Seniority.B1,
      },
      {
        text: "You're joining a project two weeks before go-live and discover a critical architectural flaw. How do you handle it?",
        client: "Contoso",
        technology: "Azure",
        skillCategory: "Communication",
        seniority: Seniority.B3,
      },
      {
        text: "Tell me about a time you had to push back on a client's technical decision. How did you approach the conversation?",
        client: "Fabrikam",
        technology: "Python",
        skillCategory: "Communication",
        seniority: Seniority.B1,
      },
    ],
  });

  const count = await prisma.question.count();
  console.log(`Seeded: admin, user, ${count} questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
