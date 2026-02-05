import { Pool } from "pg";

type ContactMessageRecord = {
  message_type: string;
  message: string;
  email: string;
  company?: string | null;
  role?: string | null;
  source: string;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
});

export async function insertContactMessage(
  record: ContactMessageRecord
): Promise<void> {
  try {
    await pool.query(
      `
      insert into contact_messages
        (message_type, message, email, company, role, source)
      values
        ($1, $2, $3, $4, $5, $6)
      `,
      [
        record.message_type,
        record.message,
        record.email,
        record.company ?? null,
        record.role ?? null,
        record.source,
      ]
    );
  } catch (err) {
    // best effort: DB must never block mail
    console.error("contact_messages insert failed", err);
  }
}
