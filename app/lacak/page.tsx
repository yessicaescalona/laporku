
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../lib/supabase-admin";

type Props = {
  searchParams: Promise<{
    kode?: string;
  }>;
};

async function LacakContent({ searchParams }: Props) {
  await connection();

  const { kode } = await searchParams;
  const kodeLaporan = (kode ?? "").trim().toUpperCase();

  let laporan = null;
  let pesan = "";

  if (kodeLaporan) {
    if (!/^LP-\d{4,}$/.test(kodeLaporan)) {
      pesan = "Format kode laporan tidak valid.";
    } else {
      const { data, error } = await supabaseAdmin
        .from("laporan")
        .select("kode, judul, lokasi, status, tanggapan, dibuat")
        .eq("kode", kodeLaporan)
        .maybeSingle();

      if (error) {
        pesan = "Gagal mencari laporan.";
      } else if (!data) {
        pesan = "Laporan tidak ditemukan.";
      } else {
        laporan = data;
      }
    }
  }

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-800">
            Lacak Laporan
          </h1>

          <p className="mt-2 text-gray-600">
            Masukkan kode laporan untuk melihat perkembangan laporanmu.
          </p>

          <form action="/lacak" method="GET" className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="kode"
                className="mb-2 block font-medium text-gray-800"
              >
                Kode Laporan
              </label>

              <input
                id="kode"
                type="text"
                name="kode"
                defaultValue={kodeLaporan}
                placeholder="Contoh: LP-0011"
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Cari Laporan
            </button>
          </form>

          {pesan && (
            <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
              {pesan}
            </p>
          )}

          {laporan && (
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="font-semibold text-blue-700">
                {laporan.kode}
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-800">
                {laporan.judul}
              </h2>

              <p className="mt-3 text-gray-700">
                Lokasi: {laporan.lokasi}
              </p>

              <p className="mt-2 text-gray-700">
                Status:{" "}
                <strong className="text-blue-700">
                  {laporan.status}
                </strong>
              </p>

              <p className="mt-2 text-gray-700">
                Tanggapan:{" "}
                {laporan.tanggapan || "Belum ada tanggapan."}
              </p>

              <Link
                href={`/laporan/${laporan.kode}`}
                className="mt-5 inline-block font-medium text-blue-600 underline hover:text-blue-800"
              >
                Lihat Detail Laporan
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LacakLaporan({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 p-6">
          <p className="text-blue-800">Memuat halaman lacak...</p>
        </main>
      }
    >
      <LacakContent searchParams={searchParams} />
    </Suspense>
  );
}
