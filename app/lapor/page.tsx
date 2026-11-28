"use client";

import Link from "next/link";
import { useActionState } from "react";
import { simpanLaporan, type HasilLaporan } from "./actions";

const hasilAwal: HasilLaporan = {
  berhasil: false,
  pesan: "",
};

export default function HalamanLapor() {
  const [hasil, formAction, sedangMengirim] = useActionState(
    simpanLaporan,
    hasilAwal,
  );

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-800">
          Buat Laporan Kerusakan
        </h1>

        <p className="mt-2 text-gray-600">
          Laporkan fasilitas sekolah yang mengalami kerusakan.
        </p>

        <form
          action={formAction}
          className="mt-8 space-y-5 rounded-xl border border-blue-100 bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Judul Laporan
            </label>
            <input
              name="judul"
              type="text"
              minLength={5}
              maxLength={80}
              required
              placeholder="Contoh: AC kelas tidak dingin"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {hasil.galat?.judul && (
              <p className="mt-1 text-sm text-red-600">{hasil.galat.judul}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Kategori Kerusakan
            </label>
            <select
              name="kategori"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Pilih kategori</option>
              <option value="2">AC Rusak</option>
              <option value="3">Proyektor</option>
              <option value="4">Keran Air</option>
              <option value="5">Kursi</option>
              <option value="6">Lampu</option>
            </select>
            {hasil.galat?.kategori && (
              <p className="mt-1 text-sm text-red-600">
                {hasil.galat.kategori}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Deskripsi Kerusakan
            </label>
            <textarea
              name="deskripsi"
              minLength={10}
              maxLength={500}
              required
              rows={4}
              placeholder="Jelaskan kerusakan yang terjadi..."
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {hasil.galat?.deskripsi && (
              <p className="mt-1 text-sm text-red-600">
                {hasil.galat.deskripsi}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Lokasi Kerusakan
            </label>
            <input
              name="lokasi"
              type="text"
              minLength={3}
              maxLength={60}
              required
              placeholder="Contoh: Ruang XII RPL 1"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {hasil.galat?.lokasi && (
              <p className="mt-1 text-sm text-red-600">{hasil.galat.lokasi}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Nama Pelapor
            </label>
            <input
              name="pelapor"
              type="text"
              minLength={3}
              maxLength={40}
              required
              placeholder="Masukkan nama pelapor"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {hasil.galat?.pelapor && (
              <p className="mt-1 text-sm text-red-600">{hasil.galat.pelapor}</p>
            )}
          </div>

          {hasil.pesan && (
            <p
              className={
                hasil.berhasil
                  ? "rounded-lg bg-blue-100 p-3 text-blue-800"
                  : "rounded-lg bg-red-100 p-3 text-red-700"
              }
            >
              {hasil.pesan}
            </p>
          )}

          <button
            type="submit"
            disabled={sedangMengirim}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sedangMengirim ? "Mengirim..." : "Kirim Laporan"}
          </button>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
