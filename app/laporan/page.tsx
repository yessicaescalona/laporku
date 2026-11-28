import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../lib/supabase-admin";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

async function LaporanContent({ searchParams }: Props) {
  await connection();

  const { q } = await searchParams;
  const kataKunci = q?.trim() ?? "";

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

  const hasilPencarian = (laporan ?? []).filter((item) => {
    const judul = item.judul.toLowerCase();
    const kode = item.kode.toLowerCase();
    const pencarian = kataKunci.toLowerCase();

    return judul.includes(pencarian) || kode.includes(pencarian);
  });

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

        <form
          action="/laporan"
          method="GET"
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            name="q"
            defaultValue={kataKunci}
            placeholder="Cari berdasarkan judul atau kode laporan..."
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Cari
          </button>

          {kataKunci && (
            <Link
              href="/laporan"
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-center font-semibold text-blue-700 hover:bg-blue-50"
            >
              Reset
            </Link>
          )}
        </form>

        <p className="mt-5 text-sm text-gray-600">
          {kataKunci
            ? `Ditemukan ${hasilPencarian.length} laporan untuk "${kataKunci}".`
            : `Total laporan: ${hasilPencarian.length}`}
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {hasilPencarian.length > 0 ? (
            hasilPencarian.map((item) => {
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
              {kataKunci
                ? "Laporan yang kamu cari tidak ditemukan."
                : "Belum ada laporan kerusakan."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function HalamanLaporan({ searchParams }: Props) {
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
      <LaporanContent searchParams={searchParams} />
    </Suspense>
  );
}
