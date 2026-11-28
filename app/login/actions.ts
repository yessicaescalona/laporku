"use server";

import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";
import { buatSesiAdmin, hapusSesiAdmin } from "../../lib/sesi";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const passwordBenar = process.env.ADMIN_PASSWORD;

  if (!passwordBenar) {
    throw new Error("ADMIN_PASSWORD belum diatur di .env.local");
  }

  const passwordMasuk = createHash("sha256")
    .update(password)
    .digest();

  const passwordAsli = createHash("sha256")
    .update(passwordBenar)
    .digest();

  if (!timingSafeEqual(passwordMasuk, passwordAsli)) {
    redirect("/login?error=1");
  }

  await buatSesiAdmin();

  redirect("/admin");
}

export async function logoutAdmin() {
  await hapusSesiAdmin();

  redirect("/login");
}
