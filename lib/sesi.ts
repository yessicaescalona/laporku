
import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const NAMA_COOKIE = "laporku_admin";

function buatToken(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET belum diatur.");
  }

  return createHmac("sha256", secret)
    .update("laporku-admin")
    .digest("hex");
}

export async function buatSesiAdmin() {
  const cookieStore = await cookies();

  cookieStore.set(NAMA_COOKIE, buatToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function pastikanAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE)?.value;

  if (!token) return false;

  const tokenBenar = buatToken();

  const a = Buffer.from(token);
  const b = Buffer.from(tokenBenar);

  return a.length === b.length && timingSafeEqual(a, b);
}

export async function hapusSesiAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(NAMA_COOKIE);
}
