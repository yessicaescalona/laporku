"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { pastikanAdmin } from "../../../lib/sesi";

export async function simpanKategori(formData: FormData) {
  const adminAktif = await pastikanAdmin();
  if (!adminAktif) redirect("/login");

  const nama = String(formData.get("nama") ?? "").trim();

  if (nama.length < 3 || nama.length > 30) {
    redirect("/admin/kategori?pesan=validasi");
  }

  const { error } = await supabaseAdmin
    .from("kategori")
    .insert({ nama });

  if (error) {
    if (error.code === "23505") {
      redirect("/admin/kategori?pesan=duplikat");
    }

    console.error("Gagal menambahkan kategori:", error);
    redirect("/admin/kategori?pesan=gagal");
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/lapor");

  redirect("/admin/kategori?pesan=ditambahkan");
}

export async function hapusKategori(formData: FormData) {
  const adminAktif = await pastikanAdmin();
  if (!adminAktif) redirect("/login");

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    redirect("/admin/kategori?pesan=gagal");
  }

  const { error } = await supabaseAdmin
    .from("kategori")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503") {
      redirect("/admin/kategori?pesan=digunakan");
    }

    console.error("Gagal menghapus kategori:", error);
    redirect("/admin/kategori?pesan=gagal");
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/lapor");

  redirect("/admin/kategori?pesan=dihapus");
}
