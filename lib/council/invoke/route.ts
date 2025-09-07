// app/api/council/invoke/route.ts
import { NextResponse } from "next/server";
import { invokeCouncil } from "@/lib/council/invoke";

export async function POST(req: Request) {
  try {
    const { name, prompt, options } = await req.json();
    const reply = await invokeCouncil(name ?? "Palantir", String(prompt ?? ""), options ?? {});
    return NextResponse.json(reply);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: true,
        message: err?.message ?? "Council invoke failed",
      },
      { status: 500 }
    );
  }
}
