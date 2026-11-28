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
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">Lacak Laporan</h1>
      <p className="mt-2 text-gray-600">
        Masukkan kode laporan untuk melihat perkembangan laporanmu.
      </p>

      <form action="/lacak" method="GET" className="mt-6 space-y-3">
        <input
          type="text"
          name="kode"
          defaultValue={kodeLaporan}
          placeholder="Contoh: LP-0001"
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
        >
          Cari Laporan
        </button>
      </form>

      {pesan && <p className="mt-4 text-red-600">{pesan}</p>}

      {laporan && (
        <div className="mt-6 rounded-xl border p-5">
          <p className="font-semibold">{laporan.kode}</p>
          <h2 className="mt-2 text-xl font-bold">{laporan.judul}</h2>
          <p className="mt-2">Lokasi: {laporan.lokasi}</p>
          <p className="mt-2">
            Status: <strong>{laporan.status}</strong>
          </p>
          <p className="mt-2">
            Tanggapan: {laporan.tanggapan || "Belum ada tanggapan."}
          </p>

          <Link
            href={`/laporan/${laporan.kode}`}
            className="mt-4 inline-block text-green-700 underline"
          >
            Lihat Detail Laporan
          </Link>
        </div>
      )}
    </main>
  );
}

export default function LacakLaporan({ searchParams }: Props) {
  return (
    <Suspense fallback={<p className="p-6">Memuat halaman lacak...</p>}>
      <LacakContent searchParams={searchParams} />
    </Suspense>
  );
}
