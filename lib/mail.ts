import { Resend } from "resend";

type ContactMailPayload = {
  message_type: string;
  message: string;
  email: string;
  company?: string | null;
  role?: string | null;
  source: string;
};

if (!process.env.RESEND_API_KEY) {
  console.error("mail: RESEND_API_KEY missing at module load");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMail(payload: ContactMailPayload) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }

  const {
    message_type,
    message,
    email,
    company,
    role,
    source,
  } = payload;

  const text = [
    `Message type: ${message_type}`,
    `Source: ${source}`,
    "",
    `Message:`,
    message,
    "",
    `Contact email: ${email}`,
    company ? `Company: ${company}` : null,
    role ? `Role: ${role}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  console.info("mail: sending contact mail", {
    message_type,
    email,
    source,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@m-pathy.ai",
    to: ["nabil_khayat@mac.com"],
    subject: `New contact message (${message_type})`,
    text,
  });

  console.info("mail: send result", result);

  return result;
}
