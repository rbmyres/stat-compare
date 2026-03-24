import { Pool } from "pg";

const globalForDb = globalThis as unknown as { _pool: Pool | undefined };

function logError(label: string, err: unknown) {
  if (process.env.NODE_ENV === "production") {
    console.error(label, err instanceof Error ? err.message : "Unknown error");
  } else {
    console.error(label, err);
  }
}

const pool =
  globalForDb._pool ??
  new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5433"),
    database: process.env.DB_NAME || "stats_db",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: process.env.NODE_ENV === "production" }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
  });

globalForDb._pool = pool;

pool.on("error", (err) => {
  logError("Unexpected error on idle client:", err);
});

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}

export async function query<T>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    const result = await pool.query(text, params);
    return result.rows as T[];
  } catch (err) {
    logError("Database query error:", err);
    throw new DatabaseError("Failed to fetch data", err);
  }
}

export async function queryOne<T>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  try {
    const result = await pool.query(text, params);
    return (result.rows[0] as T) || null;
  } catch (err) {
    logError("Database query error:", err);
    throw new DatabaseError("Failed to fetch data", err);
  }
}
