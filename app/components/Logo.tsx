import { Link } from "react-router";
import { ROUTES, CONFIG } from "~/utils/constants";

export function Logo() {
  return (
    <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
      <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:opacity-80 transition-opacity">
        {CONFIG.APP_NAME}
      </span>
    </Link>
  );
}
