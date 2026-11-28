import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-50">
      <nav className="flex flex-wrap items-center justify-between gap-4 bg-white px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">
          LaporKu
        </h1>

        <div className="flex flex-wrap gap-6 text-gray-600">
          <Link href="/" className="transition hover:text-blue-700">
            Beranda
          </Link>
          <Link href="/laporan" className="transition hover:text-blue-700">
            Laporan
          </Link>
          <Link href="/login" className="transition hover:text-blue-700">
            Login Petugas
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="mb-4 font-semibold text-blue-700">
          LAYANAN PENGADUAN FASILITAS SEKOLAH
        </p>

        <h2 className="mb-6 text-4xl font-bold text-gray-800">
          Ada Fasilitas Sekolah yang Rusak?
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-gray-600">
          Laporkan kerusakan fasilitas sekolah melalui LaporKu.
          Pantau perkembangan laporanmu dengan mudah dan praktis.
        </p>

        <Link
          href="/lapor"
          className="inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Buat Laporan
        </Link>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 md:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-bold text-gray-800">
            Mudah Melapor
          </h3>
          <p className="text-sm text-gray-600">
            Sampaikan kerusakan fasilitas sekolah melalui formulir laporan.
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-bold text-gray-800">
            Pantau Laporan
          </h3>
          <p className="text-sm text-gray-600">
            Lihat perkembangan dan status laporan yang telah dikirim.
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-bold text-gray-800">
            Tanggapan Petugas
          </h3>
          <p className="text-sm text-gray-600">
            Petugas dapat memberikan tanggapan terhadap laporan kerusakan.
          </p>
        </div>
      </section>

      <footer className="bg-white py-5 text-center text-sm text-gray-500">
        © 2026 LaporKu - Sistem Pengaduan Fasilitas Sekolah
      </footer>
    </main>
  );
}
