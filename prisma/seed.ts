import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KlickUp database...");

  // Clean existing
  await prisma.activity.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.checklistItem.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.space.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Users
  const userAbdul = await prisma.user.create({
    data: {
      id: "u_abdul",
      name: "Abdul Rehman",
      email: "abdul.rehman@northwind.io",
      title: "Performance Specialist",
      role: "Admin",
      status: "active",
      initials: "AM",
      color: "#a88365",
    },
  });

  const userAbubakar = await prisma.user.create({
    data: {
      id: "u_abubakar",
      name: "Abubakar",
      email: "abubakar@northwind.io",
      title: "Operations Lead",
      role: "Member",
      status: "active",
      initials: "AB",
      color: "#0d9488",
    },
  });

  const userElena = await prisma.user.create({
    data: {
      id: "u_elena",
      name: "Elena Rossi",
      email: "elena.rossi@northwind.io",
      title: "Product Designer",
      role: "Member",
      status: "active",
      initials: "ER",
      color: "#059669",
    },
  });

  console.log("  ✓ Users created (Abdul Rehman [AM], Abubakar, Elena Rossi)");

  // 2. Seed Spaces
  const spaceProduct = await prisma.space.create({
    data: {
      id: "space_product",
      name: "Product",
      description: "Product roadmap and department initiatives",
      color: "#7c3aed",
    },
  });

  const spaceOps = await prisma.space.create({
    data: {
      id: "space_ops",
      name: "Operations",
      description: "Daily showroom and facility operations",
      color: "#047857",
    },
  });

  const spaceEng = await prisma.space.create({
    data: {
      id: "space_eng",
      name: "Engineering",
      description: "Core systems and platform reliability",
      color: "#0f766e",
    },
  });

  console.log("  ✓ Spaces created (Product, Operations, Engineering)");

  // 3. Seed Projects
  const projAbdul = await prisma.project.create({
    data: {
      id: "p_performance",
      name: "AbdulRehman",
      description: "Performance Department daily deliverables",
      color: "#f59e0b",
      spaceId: spaceProduct.id,
    },
  });

  const projKisumu = await prisma.project.create({
    data: {
      id: "p_kisumu",
      name: "Kisumu Daily Task",
      description: "Showroom operations and equipment acquisition",
      color: "#0284c7",
      spaceId: spaceOps.id,
    },
  });

  console.log("  ✓ Projects created (AbdulRehman, Kisumu Daily Task)");

  // 4. Seed Tasks - Abdul Rehman Performance List (Screenshots 1 & 2)
  const todayStr = new Date().toISOString().split("T")[0];

  const abdulTasks = [
    {
      title: "Prepare the Obeya meeting Report Today",
      status: "todo",
      priority: "urgent",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Finalize the research data for blog content",
      status: "todo",
      priority: "high",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Find entities and keywords",
      status: "todo",
      priority: "high",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Write , Optimize and publish it",
      status: "todo",
      priority: "urgent",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Prepare 1 page content",
      status: "todo",
      priority: "high",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Finalize the 404 errors and broken links in website",
      status: "todo",
      priority: "normal",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
    {
      title: "Create 2 backlinks for blog page",
      status: "todo",
      priority: "normal",
      dueDate: todayStr,
      assigneeId: userAbdul.id,
      projectId: projAbdul.id,
    },
  ];

  for (const t of abdulTasks) {
    await prisma.task.create({
      data: {
        ...t,
        activities: {
          create: {
            action: "created",
            description: `Task "${t.title}" created for Abdul Rehman`,
          },
        },
      },
    });
  }

  // 5. Seed Tasks - Kisumu Daily Tasks (Screenshot 3)
  await prisma.task.create({
    data: {
      title: "Send Stationary / Branding work to Kisumu",
      status: "todo",
      priority: "normal",
      dueDate: "2026-03-14",
      assigneeId: userAbubakar.id,
      projectId: projKisumu.id,
    },
  });

  const taskShowroom = await prisma.task.create({
    data: {
      title: "Increase Lightning in the show-room by 3x - 3x more lights, 3x...",
      status: "todo",
      priority: "normal",
      dueDate: "2026-03-14",
      assigneeId: userAbubakar.id,
      projectId: projKisumu.id,
      checklist: {
        create: [
          { title: "Measure showroom lux levels", completed: false, order: 0 },
          { title: "Source 3x high-lumen spotlights", completed: false, order: 1 },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Buy email collection router - big wifi Hotspot",
      status: "done",
      priority: "normal",
      dueDate: "2026-02-24",
      assigneeId: userAbubakar.id,
      projectId: projKisumu.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Buy Stanley Wet and Dry Vacuum Cleaner",
      status: "done",
      priority: "high",
      dueDate: "2026-03-16",
      assigneeId: userAbdul.id,
      projectId: projKisumu.id,
    },
  });

  console.log("  ✓ Tasks seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
