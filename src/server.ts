import { app } from "./app";
import { config } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(config.port, () => {
  console.log(`🚀 KlickUp Backend Server running at http://localhost:${config.port}`);
  console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`📋 API Docs: http://localhost:${config.port}/api/tasks`);
});

const gracefulShutdown = async () => {
  console.log("\nShutting down server gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected. Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
