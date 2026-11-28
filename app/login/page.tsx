import { Suspense } from "react";
import { loginAdmin } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

async function LoginContent({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700">LaporKu</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login Admin Pengelola Laporan
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Password salah. Silakan coba lagi.
          </p>
        )}

        <form action={loginAdmin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password Admin
            </label>

            <input
              type="password"
              name="password"
              required
              placeholder="Masukkan password admin"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">LaporKu © 2026</p>
      </div>
    </main>
  );
}

export default function LoginPage({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-blue-50">
          <p className="text-blue-700">Memuat halaman login...</p>
        </main>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
