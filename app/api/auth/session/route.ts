// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const store = cookies();
  const raw = store.get(AUTH_COOKIE_NAME)?.value || "";

  if (!raw) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  const payload = verifySessionToken(raw);
  if (!payload) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    email: payload.email,
  });
}
