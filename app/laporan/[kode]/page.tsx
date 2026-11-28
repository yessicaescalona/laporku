
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { dukungLaporan } from "./actions";

type Props = {
  params: Promise<{
    kode: string;
  }>;
  searchParams: Promise<{
    dukungan?: string;
  }>;
};

async function DetailLaporanContent({
  params,
  searchParams,
}: Props) {
  await connection();

  const { kode } = await params;
  const { dukungan: statusDukungan } = await searchParams;

  // Memeriksa format kode laporan
  if (!/^LP-\d{4,}$/.test(kode)) {
    notFound();
  }

  // Mengambil laporan dari database
  const { data: laporan, error } = await supabaseAdmin
    .from("laporan")
    .select(
      "id, kode, kategori_id, judul, deskripsi, lokasi, status, tanggapan, dukungan, dibuat",
    )
    .eq("kode", kode)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil laporan:", error.message);

    return (
      <main className="min-h-screen bg-blue-50 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-red-600">
            Terjadi kesalahan saat mengambil data laporan.
          </p>
        </div>
      </main>
    );
  }

  if (!laporan) {
    notFound();
  }

  // Mengambil nama kategori
  const { data: kategori, error: kategoriError } = await supabaseAdmin
    .from("kategori")
    .select("nama")
    .eq("id", laporan.kategori_id)
    .maybeSingle();

  if (kategoriError) {
    console.error("Gagal mengambil kategori:", kategoriError.message);
  }

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/laporan"
          className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
        >
          ← Kembali ke daftar laporan
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="bg-blue-700 p-6 text-white">
            <p className="font-semibold text-blue-100">
              {laporan.kode}
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              {laporan.judul}
            </h1>
          </div>

          <div className="p-8">
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Kategori:</strong>{" "}
                {kategori?.nama ?? "Tidak diketahui"}
              </p>

              <p>
                <strong>Lokasi:</strong> {laporan.lokasi}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold text-blue-700">
                  {laporan.status}
                </span>
              </p>

              <div>
                <strong>Deskripsi:</strong>
                <p className="mt-1 leading-relaxed">
                  {laporan.deskripsi}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <p className="font-semibold text-gray-800">
                  Dukungan: {laporan.dukungan}
                </p>

                <form action={dukungLaporan} className="mt-3">
                  <input
                    type="hidden"
                    name="kode"
                    value={laporan.kode}
                  />

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Dukung Laporan
                  </button>
                </form>

                {statusDukungan === "berhasil" && (
                  <p className="mt-3 text-sm text-green-700">
                    Terima kasih! Dukungan berhasil diberikan.
                  </p>
                )}

                {statusDukungan === "sudah" && (
                  <p className="mt-3 text-sm text-orange-600">
                    Kamu sudah mendukung laporan ini.
                  </p>
                )}

                {statusDukungan === "gagal" && (
                  <p className="mt-3 text-sm text-red-600">
                    Dukungan gagal diberikan. Silakan coba lagi.
                  </p>
                )}
              </div>

              <div>
                <strong>Tanggapan petugas:</strong>
                <p className="mt-1 leading-relaxed">
                  {laporan.tanggapan || "Belum ada tanggapan."}
                </p>
              </div>

              <p className="border-t border-gray-100 pt-4 text-sm text-gray-500">
                Dibuat:{" "}
                {new Date(laporan.dibuat).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DetailLaporan(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 p-8">
          <p className="text-center text-blue-700">
            Memuat detail laporan...
          </p>
        </main>
      }
    >
      <DetailLaporanContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
