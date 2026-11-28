import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { pastikanAdmin } from "../../../lib/sesi";
import { simpanKategori, hapusKategori } from "./actions";

type Props = {
  searchParams: Promise<{ pesan?: string }>;
};

async function KategoriContent({ searchParams }: Props) {
  await connection();

  const adminAktif = await pastikanAdmin();
  if (!adminAktif) redirect("/login");

  const { pesan } = await searchParams;

  const { data: kategori, error } = await supabaseAdmin
    .from("kategori")
    .select("id, nama")
    .order("nama", { ascending: true });

  const daftarPesan: Record<string, string> = {
    ditambahkan: "Kategori berhasil ditambahkan.",
    dihapus: "Kategori berhasil dihapus.",
    validasi: "Nama kategori harus 3 sampai 30 karakter.",
    duplikat: "Nama kategori sudah tersedia.",
    digunakan: "Kategori tidak bisa dihapus karena sudah digunakan oleh laporan.",
    gagal: "Terjadi kesalahan. Silakan coba lagi.",
  };

  return (
    <main className="min-h-screen bg-blue-50 p-5 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-blue-700 p-6 text-white shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Kelola Kategori</h1>
            <p className="mt-1 text-sm text-blue-100">
              Tambah dan kelola kategori kerusakan fasilitas.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Kembali ke Admin
          </Link>
        </header>

        {pesan && daftarPesan[pesan] && (
          <div
            className={`mb-5 rounded-xl p-4 text-sm font-medium ${
              ["ditambahkan", "dihapus"].includes(pesan)
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {daftarPesan[pesan]}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-blue-800">
            Tambah Kategori
          </h2>

          <form action={simpanKategori} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Kategori
              </label>

              <input
                type="text"
                name="nama"
                minLength={3}
                maxLength={30}
                required
                placeholder="Contoh: Meja Rusak"
                className="w-full rounded-xl border border-blue-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Masukkan nama kategori 3 sampai 30 karakter.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Tambah Kategori
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-blue-800">
            Daftar Kategori
          </h2>

          {error ? (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">
              Gagal mengambil daftar kategori.
            </p>
          ) : !kategori || kategori.length === 0 ? (
            <p className="text-gray-500">Belum ada kategori.</p>
          ) : (
            <div className="space-y-3">
              {kategori.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID Kategori: {item.id}
                    </p>
                  </div>

                  <form action={hapusKategori}>
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <button
                      type="submit"
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function KategoriPage({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-blue-50 p-8">
          <p className="text-center text-blue-700">
            Memuat halaman kategori...
          </p>
        </main>
      }
    >
      <KategoriContent searchParams={searchParams} />
    </Suspense>
  );
}
