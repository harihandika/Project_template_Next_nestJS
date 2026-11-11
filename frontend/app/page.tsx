import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
      <div className="text-center text-white px-6">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-4xl font-bold">F</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-3 tracking-tight">FTS Portal</h1>
        <p className="text-primary-100 text-lg mb-10">
          Manage your workspace with ease
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all border border-white/30 backdrop-blur-sm"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
