"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function dukungLaporan(formData: FormData) {
  const kode = String(formData.get("kode") ?? "").trim();

  if (!/^LP-\d{4,}$/.test(kode)) {
    redirect("/laporan");
  }

  // Memeriksa laporan berdasarkan kode
  const { data: laporan, error: errorLaporan } = await supabaseAdmin
    .from("laporan")
    .select("id")
    .eq("kode", kode)
    .maybeSingle();

  if (errorLaporan || !laporan) {
    redirect("/laporan");
  }

  // Membuat identitas pengunjung melalui cookie
  const penyimpananCookie = await cookies();
  let pengunjungId = penyimpananCookie.get("laporku_pengunjung")?.value;

  if (!pengunjungId) {
    pengunjungId = randomUUID();

    penyimpananCookie.set("laporku_pengunjung", pengunjungId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // Menyimpan dukungan
  const { error } = await supabaseAdmin.from("dukungan").insert({
    laporan_id: laporan.id,
    pengunjung_id: pengunjungId,
  });

  if (error) {
    if (error.code === "23505") {
      redirect(`/laporan/${kode}?dukungan=sudah`);
    }

    console.error("Gagal memberikan dukungan:", error.message);
    redirect(`/laporan/${kode}?dukungan=gagal`);
  }

  // Memperbarui tampilan setelah dukungan berhasil
  revalidatePath(`/laporan/${kode}`);
  revalidatePath("/laporan");

  redirect(`/laporan/${kode}?dukungan=berhasil`);
}
