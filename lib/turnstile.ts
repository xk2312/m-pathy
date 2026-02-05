type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("turnstile: missing secret key");
    return false;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn("turnstile: http error", res.status);
      return false;
    }

    const data = (await res.json()) as TurnstileResponse;

    if (data.success !== true) {
      console.warn("turnstile: verification failed", data["error-codes"]);
      return false;
    }

    return true;
  } catch (err) {
    console.error("turnstile: verification error", err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
