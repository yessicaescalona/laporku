import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { pastikanAdmin } from "../../lib/sesi";
import { logoutAdmin } from "../login/actions";
import { ubahStatus } from "./actions";

async function AdminContent() {
  await connection();

  const adminAktif = await pastikanAdmin();
  if (!adminAktif) redirect("/login");

  const { data: laporan, error } = await supabaseAdmin
    .from("laporan")
    .select("id, kode, kategori_id, judul, lokasi, status, dukungan, dibuat")
    .order("dibuat", { ascending: false });

  const { data: kategori } = await supabaseAdmin
    .from("kategori")
    .select("id, nama");

  const daftarKategori = kategori ?? [];

  const totalLaporan = laporan?.length ?? 0;
  const jumlahBaru =
    laporan?.filter((item) => item.status === "baru").length ?? 0;
  const jumlahDiproses =
    laporan?.filter((item) => item.status === "diproses").length ?? 0;
  const jumlahSelesai =
    laporan?.filter((item) => item.status === "selesai").length ?? 0;

  return (
    <main className="min-h-screen bg-blue-50 p-5 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-blue-700 p-6 text-white shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="mt-1 text-sm text-blue-100">
              Selamat datang di pengelolaan laporan LaporKu
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Beranda
            </Link>

            <Link
              href="/admin/kategori"
              className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-800 hover:bg-blue-200"
            >
              Kelola Kategori
            </Link>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-xl bg-blue-900 px-4 py-2 font-semibold text-white hover:bg-blue-950"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { judul: "Total Laporan", jumlah: totalLaporan },
            { judul: "Laporan Baru", jumlah: jumlahBaru },
            { judul: "Sedang Diproses", jumlah: jumlahDiproses },
            { judul: "Selesai", jumlah: jumlahSelesai },
          ].map((item) => (
            <div
              key={item.judul}
              className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {item.judul}
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-700">
                {item.jumlah}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                Daftar Laporan
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Kelola status dan tanggapan laporan kerusakan.
              </p>
            </div>

            <Link
              href="/laporan"
              className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Lihat Semua
            </Link>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">
              Gagal mengambil data laporan.
            </p>
          ) : !laporan || laporan.length === 0 ? (
            <p className="rounded-xl bg-blue-50 p-4 text-gray-500">
              Belum ada laporan.
            </p>
          ) : (
            <div className="space-y-5">
              {laporan.map((item) => {
                const namaKategori =
                  daftarKategori.find(
                    (kat) => kat.id === item.kategori_id
                  )?.nama ?? "Tidak diketahui";

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-blue-100 p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-blue-600">
                          {item.kode}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-gray-800">
                          {item.judul}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Kategori: {namaKategori}
                        </p>
                        <p className="text-sm text-gray-500">
                          Lokasi: {item.lokasi}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Dukungan: {item.dukungan}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <Link
                        href={`/laporan/${item.kode}`}
                        className="inline-block font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Lihat Detail →
                      </Link>
                    </div>

                    {item.status !== "selesai" && (
                      <form
                        action={ubahStatus}
                        className="mt-5 space-y-3 rounded-xl bg-blue-50 p-4"
                      >
                        <input
                          type="hidden"
                          name="kode"
                          value={item.kode}
                        />

                        <label className="block text-sm font-semibold text-gray-700">
                          Ubah Status
                        </label>

                        <select
                          name="status"
                          defaultValue={
                            item.status === "baru" ? "diproses" : "selesai"
                          }
                          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        >
                          {item.status === "baru" && (
                            <option value="diproses">Diproses</option>
                          )}
                          {item.status === "diproses" && (
                            <option value="selesai">Selesai</option>
                          )}
                        </select>

                        <label className="block text-sm font-semibold text-gray-700">
                          Tanggapan Admin
                        </label>

                        <textarea
                          name="tanggapan"
                          rows={3}
                          placeholder="Tuliskan tanggapan untuk pelapor..."
                          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        />

                        {item.status === "diproses" && (
                          <p className="text-xs text-gray-500">
                            Tanggapan wajib diisi minimal 10 karakter saat
                            laporan diselesaikan.
                          </p>
                        )}

                        <button
                          type="submit"
                          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                          Simpan Perubahan
                        </button>
                      </form>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 p-8 text-blue-700">
          Memuat dashboard admin...
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
