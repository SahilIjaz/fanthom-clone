import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({ email: "" }));
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fz_session", encodeURIComponent(email || "demo@fathomclone.app"), {
    httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fz_session", "", { path: "/", maxAge: 0 });
  return res;
}
