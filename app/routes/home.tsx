import { Link, useRouteLoaderData } from "react-router";
import { ROUTES, CONFIG } from "~/utils/constants";

export default function Home() {
  const data = useRouteLoaderData("root");
  const user = data?.user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent opacity-40 dark:from-indigo-900/30"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-indigo-500/10 ring-1 ring-gray-900/5 dark:ring-white/10">
            <svg
              className="w-12 h-12 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Money</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          {CONFIG.APP_NAME} is the secure, intelligent way to track expenses. 
          Experience financial clarity with our premium dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.REGISTER}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-gray-900/20 dark:shadow-white/20"
              >
                Get Started
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-sm text-gray-400 dark:text-gray-500">
        © 2025 {CONFIG.APP_NAME}. Secure & Private.
      </div>
    </div>
  );
}
