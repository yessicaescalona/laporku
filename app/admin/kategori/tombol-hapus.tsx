"use client";

import { useState } from "react";
import { hapusKategori } from "./actions";

type Props = {
  id: number;
  nama: string;
};

export default function TombolHapus({ id, nama }: Props) {
  const [sedangMenghapus, setSedangMenghapus] = useState(false);

  async function konfirmasiHapus() {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus kategori "${nama}"?`
    );

    if (!yakin) return;

    setSedangMenghapus(true);

    const formData = new FormData();
    formData.set("id", String(id));

    await hapusKategori(formData);
  }

  return (
    <button
      type="button"
      onClick={konfirmasiHapus}
      disabled={sedangMenghapus}
      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {sedangMenghapus ? "Menghapus..." : "Hapus"}
    </button>
  );
}