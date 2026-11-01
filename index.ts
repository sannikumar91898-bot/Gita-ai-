// db/index.ts (ya index.ts)
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // 🔥 Schema import karein taaki relations kaam karein

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// 🔥 Production-Ready Pool Configuration 🔥
export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10, // Ek time par max 10 connections (Serverless safe)
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 10000, 
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

// 🔥 Drizzle initialize karein schema ke saath 🔥
export const db = drizzle(pool, { schema });