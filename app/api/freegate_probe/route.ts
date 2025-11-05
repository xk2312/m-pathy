// app/api/_freegate_probe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAndBumpFreegate } from "@/lib/freegate";

export async function GET(req: NextRequest) {
  const freeLimit = Number(process.env.FREE_LIMIT ?? "9");
  const secret = process.env.FREEGATE_SECRET || "";
  const checkoutUrl = process.env.CHECKOUT_URL || "https://example.com/checkout";

  if (!secret) {
    return NextResponse.json({ error: "FREEGATE_SECRET missing" }, { status: 500 });
  }

  const ua = req.headers.get("user-agent") || "";
  const cookieHeader = req.headers.get("cookie");

  const { count, blocked, cookie } = verifyAndBumpFreegate({
    cookieHeader,
    userAgent: ua,
    freeLimit,
    secret
  });

  const res = blocked
    ? NextResponse.json(
        { status: "free_limit_reached", free_limit: freeLimit, checkout_url: checkoutUrl },
        { status: 402 }
      )
    : NextResponse.json({ status: "ok", count, free_limit: freeLimit }, { status: 200 });

  res.headers.set("Set-Cookie", cookie);
  return res;
}
