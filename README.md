# LaporKu

## 1. Deskripsi Aplikasi

LaporKu adalah aplikasi berbasis web yang digunakan untuk melaporkan kerusakan fasilitas sekolah. Aplikasi ini membantu siswa dan warga sekolah menyampaikan laporan kerusakan agar dapat ditindaklanjuti oleh petugas.

## 2. Fitur Aplikasi

- Melihat daftar laporan kerusakan fasilitas sekolah.
- Melihat detail laporan berdasarkan kode laporan.
- Membuat laporan kerusakan fasilitas sekolah.
- Memberikan dukungan pada laporan.
- Melacak perkembangan laporan menggunakan kode laporan.
- Login dan logout petugas.
- Mengelola kategori laporan.
- Mengubah status laporan menjadi baru, diproses, dan selesai.
- Memberikan tanggapan terhadap laporan.

## 3. Teknologi yang Digunakan

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Git dan GitHub
- Vercel

## 4. Struktur Database

Database LaporKu menggunakan Supabase dengan tiga tabel utama:

- `kategori`: menyimpan kategori kerusakan fasilitas.
- `laporan`: menyimpan informasi laporan kerusakan.
- `dukungan`: menyimpan data dukungan pengunjung terhadap laporan.

Struktur dan script database dapat dilihat pada file `database.sql`.

## 5. Cara Instalasi

Pastikan Node.js sudah terpasang di komputer.

Clone repository:

```bash
git clone URL_REPOSITORY_KAMU
```

Masuk ke folder proyek:

```bash
cd laporku
```

Install dependencies:

```bash
npm install
```

## 6. Konfigurasi Environment

Buat file `.env.local` di folder utama proyek.

Isi dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ADMIN_PASSWORD=
SESSION_SECRET=
```

Isi setiap variabel menggunakan konfigurasi milik project Supabase dan pengaturan admin.

Jangan membagikan isi `.env.local` atau mengunggahnya ke GitHub.

## 7. Menjalankan Aplikasi

Jalankan server pengembangan:

```bash
npm run dev
```

Buka browser dan akses:

```text
http://localhost:3000
```

Untuk membuat versi production:

```bash
npm run build
```

## 8. Keamanan Aplikasi

- Menggunakan Row Level Security (RLS) pada database.
- Menggunakan Supabase Secret Key melalui kode server.
- Melindungi halaman admin menggunakan sesi.
- Memvalidasi data laporan sebelum disimpan.
- Membatasi dukungan agar satu pengunjung tidak memberikan dukungan berulang pada laporan yang sama.

## 9. Deployment

Aplikasi dapat di-deploy menggunakan Vercel dengan menghubungkan repository GitHub dan mengatur environment variables pada pengaturan proyek Vercel.