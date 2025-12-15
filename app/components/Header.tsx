import { Form } from "react-router";
import { ROUTES } from "~/utils/constants";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="flex justify-between items-center mb-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-25 border-b border-gray-100 dark:border-gray-700/50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Logo />
      
      <div className="flex gap-3 items-center">
         <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>

        <Form method="post" action={ROUTES.API.AUTH.LOGOUT}>
          <button 
            type="submit" 
            className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors transition-transform transform hover:scale-105 text-sm"
          >
            Sign Out
          </button>
        </Form>
      </div>
    </header>
  );
}
