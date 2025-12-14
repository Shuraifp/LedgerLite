import { Link, useFetcher, useNavigate, redirect } from "react-router";
import { useEffect, useState } from "react";
import { ROUTES, CONFIG } from "~/utils/constants";
import { AuthService } from "~/services/auth.server";
import type { Route } from "./+types/register";

export async function loader({ request }: Route.LoaderArgs) {
  await AuthService.requireAnonymous(request);
  return null;
}

export default function Register() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting" || fetcher.state === "loading";
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.data?.error) {
      setErrors(fetcher.data.error);
    } else if (fetcher.data?.success) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [fetcher.data, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    setErrors(null);
    fetcher.submit(formData, { method: "post", action: ROUTES.API.AUTH.REGISTER });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 opacity-50"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Join {CONFIG.APP_NAME} today</p>
        </div>

        {errors && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            {errors}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={CONFIG.AUTH.PASSWORD_MIN_LENGTH}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={CONFIG.AUTH.PASSWORD_MIN_LENGTH}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign in
          </Link>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Back to{" "}
          <Link to={ROUTES.HOME} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
