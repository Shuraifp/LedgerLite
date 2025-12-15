import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { AuthService } from "~/services/auth.server";
import { TransactionService } from "~/services/transaction.server";
import { CategoryService } from "~/services/category.server";
import { Header } from "~/components/Header";
import { ROUTES } from "~/utils/constants";
import { AddTransactionModal } from "~/components/AddTransactionModal";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const transactions = await TransactionService.getRecent(user.id, 50);
  const categories = await CategoryService.list(user.id);
  return { user, transactions, categories };
}

export default function TransactionsPage() {
  const { user, transactions, categories } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<{id: string, title: string} | null>(null);
  const deleteFetcher = useFetcher();

  const isDeleting = deleteFetcher.state === "submitting";

  useEffect(() => {
    if (deleteFetcher.state === 'idle' && deleteFetcher.data) {
        setDeleteModalOpen(false);
        setTransactionToDelete(null);
    }
  }, [deleteFetcher.state, deleteFetcher.data]);

  const handleEdit = (tx: any) => {
    setSelectedTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTransactionToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
        deleteFetcher.submit({ transactionId: transactionToDelete.id }, { method: "post", action: "/api/expense/transactions/delete" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
             <Link to={ROUTES.DASHBOARD} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
             </Link>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          </div>
          
          <div className="flex gap-2">
            <Link 
                to="/categories"
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-sm flex items-center gap-2"
            >
                <span>🏷️</span> Categories
            </Link>
            <button 
                onClick={() => {
                    setSelectedTransaction(null);
                    setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all font-medium text-sm"
            >
                + Add Transaction
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    📝
                 </div>
                 <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
              </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-700 dark:hover:bg-gray-750 rounded-2xl transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-xl shadow-sm" style={{ color: tx.categoryColor || undefined }}>
                                {tx.categoryIcon || (tx.type === 'income' ? '💰' : '🛒')}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{tx.title || "Untitled Transaction"}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{tx.categoryName || "Uncategorized"} • {new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                                {tx.type === 'income' ? '+' : ''}₹{parseFloat(tx.amount).toFixed(2)}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(tx)}
                                    className="p-2 text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(tx.id, tx.title!)}
                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
        
        <AddTransactionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            categories={categories} 
            initialData={selectedTransaction}
        />
        
        <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
            title="Delete Transaction"
            message={
                <span>
                    Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{transactionToDelete?.title}"</span>? This action cannot be undone.
                </span>
            }
            confirmLabel="Delete Transaction"
            isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
