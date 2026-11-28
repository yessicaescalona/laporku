"use server";
import { supabaseAdmin } from "../../lib/supabase-admin";

export type HasilLaporan = {
  berhasil: boolean;
  pesan: string;
  galat?: {
    judul?: string;
    kategori?: string;
    deskripsi?: string;
    lokasi?: string;
    pelapor?: string;
  };
};

export async function simpanLaporan(
  state: HasilLaporan,
  formData: FormData
): Promise<HasilLaporan> {
  const judul = String(formData.get("judul") ?? "").trim();
  const kategoriId = Number(formData.get("kategori"));
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const lokasi = String(formData.get("lokasi") ?? "").trim();
  const pelapor = String(formData.get("pelapor") ?? "").trim();

  const galat: HasilLaporan["galat"] = {};

  // Validasi judul
  if (judul.length < 5 || judul.length > 80) {
    galat.judul = "Judul harus 5–80 karakter.";
  }

  // Validasi kategori
  if (!Number.isInteger(kategoriId) || kategoriId <= 0) {
    galat.kategori = "Pilih kategori yang tersedia.";
  }

  // Validasi deskripsi
  if (deskripsi.length < 10 || deskripsi.length > 500) {
    galat.deskripsi = "Deskripsi harus 10–500 karakter.";
  }

  // Validasi lokasi
  if (lokasi.length < 3 || lokasi.length > 60) {
    galat.lokasi = "Lokasi harus 3–60 karakter.";
  }

  // Validasi nama pelapor
  if (pelapor.length < 3 || pelapor.length > 40) {
    galat.pelapor = "Nama pelapor harus 3–40 karakter.";
  }

  if (Object.keys(galat).length > 0) {
    return {
      berhasil: false,
      pesan: "Periksa kembali data yang kamu masukkan.",
      galat,
    };
  }

  // Memastikan kategori tersedia
  const { data: kategori, error: errorKategori } = await supabaseAdmin
    .from("kategori")
    .select("id")
    .eq("id", kategoriId)
    .maybeSingle();

  if (errorKategori || !kategori) {
    return {
      berhasil: false,
      pesan: "Kategori tidak ditemukan. Silakan pilih kategori lain.",
    };
  }

  // Menghitung laporan baru dari nama pelapor yang sama
  const { data: laporanAktif, error: errorLaporan } = await supabaseAdmin
    .from("laporan")
    .select("id, pelapor")
    .eq("status", "baru");

  if (errorLaporan) {
    return {
      berhasil: false,
      pesan: "Gagal memeriksa laporan sebelumnya.",
    };
  }

  const jumlahLaporan = (laporanAktif ?? []).filter(
    (item) => item.pelapor.toLowerCase() === pelapor.toLowerCase()
  ).length;

  if (jumlahLaporan >= 3) {
    return {
      berhasil: false,
      pesan: "Nama ini sudah memiliki 3 laporan yang masih baru.",
    };
  }

  // Menyimpan laporan
  const { error: errorSimpan } = await supabaseAdmin
    .from("laporan")
    .insert({
      judul,
      kategori_id: kategoriId,
      deskripsi,
      lokasi,
      pelapor,
      status: "baru",
      dukungan: 0,
    });

  if (errorSimpan) {
    console.error("Gagal menyimpan laporan:", errorSimpan.message);

    return {
      berhasil: false,
      pesan: "Laporan gagal disimpan. Silakan coba lagi.",
    };
  }

  return {
    berhasil: true,
    pesan: "Laporan berhasil dikirim!",
  };
}
