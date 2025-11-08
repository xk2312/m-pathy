// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en","de","fr","es","it","pt","nl","ru","zh","ja","ko","ar","hi"] as const;
type Supported = (typeof SUPPORTED)[number];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Accept-Language → base tag
  const al = req.headers.get("accept-language") || "";
  const base = (al.split(",")[0] || "en").slice(0, 2).toLowerCase();
  const lang: Supported = (SUPPORTED as readonly string[]).includes(base) ? (base as Supported) : "en";

  // set only if changed
  const existing = req.cookies.get("lang")?.value;
      if (existing !== lang) {
    res.cookies.set("lang", lang, { path: "/", maxAge: 60*60*24*365, sameSite: "lax" });
  }
  return res;

}

export const config = {
  matcher: ["/((?!_next|api|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|map)).*)"],
};
