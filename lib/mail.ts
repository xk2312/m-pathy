type ContactMailPayload = {
  message_type: string;
  message: string;
  email: string;
  company?: string | null;
  role?: string | null;
  source: string;
};

type ResendClient = {
  emails: {
    send: (args: any) => Promise<any>;
  };
};

let resend: ResendClient | null = null;

async function getResendClient(): Promise<ResendClient> {
  if (resend !== null) {
    return resend;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const { Resend } = await import("resend");
  resend = new Resend(apiKey) as ResendClient;
  return resend;
}


export async function sendContactMail(payload: ContactMailPayload) {
  const client = await getResendClient();

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

  const from =
    process.env.RESEND_FROM_EMAIL || "login@mail.m-pathy.ai";

  const result = await client.emails.send({
    from,
    to: ["nabil_khayat@mac.com"],
    subject: `New contact message (${message_type})`,
    text,
  });

  if (result?.error) {
    throw new Error(
      typeof result.error === "string"
        ? result.error
        : result.error.message || "Resend send failed"
    );
  }

  return result;
}
