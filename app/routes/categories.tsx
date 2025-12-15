import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { AuthService } from "~/services/auth.server";
import { CategoryService } from "~/services/category.server";
import { Header } from "~/components/Header";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { ROUTES, TransactionType } from "~/utils/constants";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const categories = await CategoryService.list(user.id);
  return { user, categories };
}

export default function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, name: string} | null>(null);

  const isDeleting = fetcher.state === "submitting" && fetcher.formData?.get("categoryId") === categoryToDelete?.id && fetcher.formAction === "/api/expense/categories/delete";
  
  useEffect(() => {
      if (deleteModalOpen && !isDeleting && fetcher.state === 'idle' && fetcher.data) {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
      }
  }, [fetcher.state, fetcher.data, isDeleting, deleteModalOpen]);

  const incomeCategories = categories.filter(c => c.type === TransactionType.INCOME);
  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || "🏷️");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditIcon("");
  };

  const handleSave = (catId: string) => {
    fetcher.submit(
      { categoryId: catId, name: editName, icon: editIcon },
      { method: "post", action: "/api/expense/categories/update" }
    );
    setEditingId(null);
  };

  const handleDeleteClick = (catId: string, name: string) => {
    setCategoryToDelete({ id: catId, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
        fetcher.submit(
            { categoryId: categoryToDelete.id },
            { method: "post", action: "/api/expense/categories/delete" }
        );
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const CategoryList = ({ title, items, colorClass }: { title: string, items: typeof categories, colorClass: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 h-full">
        <h2 className={`text-xl font-bold mb-4 ${colorClass}`}>{title}</h2>
        <div className="space-y-3">
            {items.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl group transition-all hover:shadow-sm">
                    {editingId === cat.id ? (
                        <>
                            <input 
                                type="text" 
                                value={editIcon} 
                                onChange={e => setEditIcon(e.target.value)}
                                className="w-12 h-12 text-center text-xl bg-white dark:bg-gray-600 rounded-lg border-2 border-indigo-500 outline-none"
                            />
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={e => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 rounded-lg border-2 border-indigo-500 outline-none text-gray-900 dark:text-white"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleSave(cat.id)} className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg" title="Save">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button onClick={cancelEdit} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg" title="Cancel">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl text-2xl shadow-sm">
                                {cat.icon || "🏷️"}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button onClick={() => handleDeleteClick(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
            {items.length === 0 && <p className="text-gray-400 text-center py-4 text-sm">No categories found.</p>}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <div className="flex items-center gap-4 mb-8">
            <Link to={ROUTES.TRANSACTIONS} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryList title="Expense Categories" items={expenseCategories} colorClass="text-red-500" />
            <CategoryList title="Income Categories" items={incomeCategories} colorClass="text-green-500" />
        </div>

        <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
            title="Delete Category"
            message={
                <span>
                    Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{categoryToDelete?.name}"</span>? 
                    <br/><br/>
                    <span className="text-xs">Transactions using this category will be preserved but the category won't be selectable anymore.</span>
                </span>
            }
            confirmLabel="Delete Category"
            // isLoading={isDeleting} // fetcher tracking is complex here, keeping it simple
        />
      </div>
    </div>
  );
}
