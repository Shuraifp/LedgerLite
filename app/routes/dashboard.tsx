import { data, redirect, useLoaderData, Link } from "react-router";
import { useState } from "react";
import { AuthService } from "~/services/auth.server";
import { Header } from "~/components/Header";
import { AddTransactionModal } from "~/components/AddTransactionModal";
import { ExpenseChart } from "~/components/ExpenseChart";
import type { Route } from "./+types/dashboard";
import { TransactionService } from "~/services/transaction.server";
import { ROUTES } from "~/utils/constants";
import { CategoryService } from "~/services/category.server";


export async function loader({ request }: Route.LoaderArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  
  const categories = await CategoryService.list(user.id);

  const summary = await TransactionService.getSummary(user.id);
  const transactions = await TransactionService.getRecent(user.id);
  const weekChartData = await TransactionService.getChartData(user.id, 'week');
  const monthChartData = await TransactionService.getChartData(user.id, 'month');
  
  return { user, summary, transactions, categories, weekChartData, monthChartData };
}


export default function Dashboard() {
  const { user, summary, transactions, categories, weekChartData, monthChartData } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Header />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user.username}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <Link 
                to="/transactions"
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-sm flex items-center gap-2"
            >
                <span>💰</span> Transactions
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all font-medium whitespace-nowrap"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-indigo-600 text-[120px] font-extrabold leading-none">
₹
</div>

            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Balance</p>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">₹{summary.netBalance}</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Income</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{summary.totalIncome}</h3>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '70%' }}></div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Expenses</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{summary.totalExpense}</h3>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '45%' }}></div>
             </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <ExpenseChart weekData={weekChartData} monthData={monthChartData} />
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h3>
            <div className="space-y-6">
            {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ color: tx.categoryColor || undefined }}>
                      {tx.categoryIcon || (tx.type === 'income' ? '💰' : '🛒')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{tx.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.categoryName} • {new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                    {tx.type === 'income' ? '+' : ''}₹{parseFloat(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <Link to={ROUTES.TRANSACTIONS} className="block w-full mt-8 py-3 bg-gray-50 dark:bg-gray-700/50 text-center text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              View All Transactions
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
