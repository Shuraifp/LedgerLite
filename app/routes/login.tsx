import { Link } from "react-router";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400">Sign in to access your dashboard</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Remember me
            </label>
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
