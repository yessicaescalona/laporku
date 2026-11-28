"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { pastikanAdmin } from "../../lib/sesi";

export async function ubahStatus(formData: FormData) {
  const adminAktif = await pastikanAdmin();

  if (!adminAktif) {
    redirect("/login");
  }

  const kode = String(formData.get("kode") ?? "").trim();
  const statusBaru = String(formData.get("status") ?? "");
  const tanggapan = String(formData.get("tanggapan") ?? "").trim();

  if (!/^LP-\d{4,}$/.test(kode)) {
    redirect("/admin?pesan=gagal");
  }

  if (!["diproses", "selesai"].includes(statusBaru)) {
    redirect("/admin?pesan=gagal");
  }

  const { data: laporan, error } = await supabaseAdmin
    .from("laporan")
    .select("id, status")
    .eq("kode", kode)
    .maybeSingle();

  if (error || !laporan) {
    redirect("/admin?pesan=gagal");
  }

  const statusBerikutnya: Record<string, string> = {
    baru: "diproses",
    diproses: "selesai",
  };

  if (statusBerikutnya[laporan.status] !== statusBaru) {
    redirect("/admin?pesan=urutan");
  }

  if (statusBaru === "selesai" && tanggapan.length < 10) {
    redirect("/admin?pesan=tanggapan");
  }

  const { error: errorUpdate } = await supabaseAdmin
    .from("laporan")
    .update({
      status: statusBaru,
      tanggapan: statusBaru === "selesai" ? tanggapan : null,
    })
    .eq("id", laporan.id)
    .eq("status", laporan.status);

  if (errorUpdate) {
    redirect("/admin?pesan=gagal");
  }

  revalidatePath("/admin");
  revalidatePath("/laporan");
  revalidatePath(`/laporan/${kode}`);
  revalidatePath("/lacak");

  redirect("/admin?pesan=berhasil");
}
