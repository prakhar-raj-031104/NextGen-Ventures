import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { createApp } from "./app.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.info(`
╔══════════════════════════════════════════════════╗
║          NextGen Ventures API — Running          ║
╠══════════════════════════════════════════════════╣
║  URL       http://localhost:${String(env.PORT).padEnd(21)}║
║  Env       ${env.NODE_ENV.padEnd(38)}║
║  Health    http://localhost:${env.PORT}/api/health${" ".repeat(Math.max(0, 19 - String(env.PORT).length))}║
╚══════════════════════════════════════════════════╝
`);
});

const shutdown = async (signal: string): Promise<void> => {
  console.info(`\n${signal} received — shutting down gracefully.`);
  server.close(async () => {
    await prisma.$disconnect();
    console.info("Database connection closed. Goodbye.");
    process.exit(0);
  });

  // Force-exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error("Graceful shutdown timed out — forcing exit.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
