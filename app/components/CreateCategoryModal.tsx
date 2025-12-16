import { useEffect } from "react";
import { useFetcher } from "react-router";
import type { Category } from "~/utils/constants";

export default function CreateCategory({
  type,
  onCreate,
}: {
  type: string;
  onCreate: (category: Category) => void;
}) {
  const categoryFetcher = useFetcher();

  const isCreatingCat = categoryFetcher.state === "submitting";

  useEffect(() => {
    if (
      categoryFetcher.state === "idle" &&
      categoryFetcher.data &&
      (categoryFetcher.data as any).success
    ) {
      const newCategory = (categoryFetcher.data as any).category;
      onCreate(newCategory);
    }
  }, [categoryFetcher.state, categoryFetcher.data]);

  return (
    <div className="animate-in fade-in z-20 slide-in-from-right-4 duration-200">
      <categoryFetcher.Form
        method="post"
        action="/api/expense/categories/create"
      >
        <input type="hidden" name="type" value={type} />
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            name="icon"
            className="w-16 h-16 text-center text-3xl bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
            placeholder="🏷️"
            maxLength={2}
            autoFocus
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-transparent focus:border-indigo-500 rounded-xl text-gray-900 dark:text-white outline-none"
              placeholder="e.g. Groceries"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isCreatingCat}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
        >
          {isCreatingCat ? "Creating..." : "Create Category"}
        </button>
      </categoryFetcher.Form>
    </div>
  );
}
