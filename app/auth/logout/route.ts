// app/auth/logout/route.ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

// Wir benutzen POST, weil der Client mit POST auf /auth/logout ruft.
export async function POST() {
  const response = NextResponse.json({
    ok: true,
    loggedOut: true,
  });

  // Auth-Cookie serverseitig ausloggen: Wert leeren + in die Vergangenheit datieren
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",          // wichtig: gleiche Path-Ebene wie beim Setzen
    expires: new Date(0),
  });

  return response;
}
