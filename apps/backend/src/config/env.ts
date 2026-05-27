import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000), // 15 min
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  LEAD_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60 * 60 * 1000), // 1 hour
  LEAD_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  UPLOAD_DIR: z.string().optional()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌  Invalid environment configuration:");
  result.error.issues.forEach((issue) => {
    console.error(`   ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = result.data;

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
