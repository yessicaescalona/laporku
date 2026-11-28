import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../lib/supabase-admin";

async function LaporanContent() {
  await connection();

  const { data: laporan, error } = await supabaseAdmin
    .from("laporan")
    .select("id, kode, kategori_id, judul, lokasi, status, dukungan, dibuat")
    .order("dibuat", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-blue-50 p-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-red-600">
            Gagal mengambil daftar laporan
          </h1>
          <p className="mt-3 text-gray-700">
            Pesan error: {error.message}
          </p>
        </div>
      </main>
    );
  }

  const { data: kategori } = await supabaseAdmin
    .from("kategori")
    .select("id, nama");

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-blue-700 p-6 text-white shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">Daftar Laporan</h1>
            <p className="mt-2 text-sm text-blue-100">
              Lihat laporan kerusakan fasilitas sekolah.
            </p>
          </div>

          <Link
            href="/lapor"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            + Buat Laporan
          </Link>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {laporan && laporan.length > 0 ? (
            laporan.map((item) => {
              const namaKategori = kategori?.find(
                (k) => k.id === item.kategori_id,
              )?.nama;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <p className="font-semibold text-blue-700">
                    {item.kode}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-gray-800">
                    {item.judul}
                  </h2>

                  <div className="mt-4 space-y-2 text-gray-600">
                    <p>
                      <strong>Kategori:</strong>{" "}
                      {namaKategori ?? "Tidak diketahui"}
                    </p>
                    <p>
                      <strong>Lokasi:</strong> {item.lokasi}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="font-semibold text-blue-700">
                        {item.status}
                      </span>
                    </p>
                    <p>
                      <strong>Dukungan:</strong> {item.dukungan}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {new Date(item.dibuat).toLocaleString("id-ID")}
                  </p>

                  <Link
                    href={`/laporan/${item.kode}`}
                    className="mt-5 inline-block font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
              Belum ada laporan kerusakan.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function HalamanLaporan() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 p-8">
          <p className="text-center text-blue-700">
            Memuat daftar laporan...
          </p>
        </main>
      }
    >
      <LaporanContent />
    </Suspense>
  );
}
