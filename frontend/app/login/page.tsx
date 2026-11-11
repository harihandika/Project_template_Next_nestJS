export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
            Welcome back
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Sign in to your FTS Portal account
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary-600 font-medium hover:underline">
              Contact admin
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
