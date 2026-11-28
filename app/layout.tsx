import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaporKu - Laporan Kerusakan Fasilitas Sekolah",
  description: "Website pelaporan kerusakan fasilitas sekolah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
