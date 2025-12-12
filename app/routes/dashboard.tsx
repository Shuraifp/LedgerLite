import { Link } from "react-router";

// Mock Data for UI
const recentTransactions = [
  { id: 1, title: "Grocery Shopping", amount: -120.50, date: "Today, 10:23 AM", category: "Food", icon: "🛒" },
  { id: 2, title: "Freelance Client", amount: 850.00, date: "Yesterday, 2:15 PM", category: "Income", icon: "💰" },
  { id: 3, title: "Netflix Subscription", amount: -15.99, date: "Oct 24, 2025", category: "Entertainment", icon: "🎬" },
  { id: 4, title: "Gas Station", amount: -45.00, date: "Oct 22, 2025", category: "Transport", icon: "⛽" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar / Mobile Nav Placeholder - Keeping it simple for now */}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Mohammed</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
              Export
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all font-medium">
              + Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39h-2.07c-.12-1.01-1.14-1.67-2.46-1.67-1.51 0-2.09.74-2.09 1.56 0 .72.29 1.62 2.67 2.15 3 1.01 4.18 1.96 4.18 3.78 0 1.96-1.82 3.17-3.64 3.54z"/></svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Balance</p>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">$12,450.00</h3>
            <p className="text-green-500 text-sm font-medium mt-2 flex items-center">
              <span className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full mr-2">↑ 2.5%</span> 
              from last month
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Income</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">$4,250.00</h3>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '70%' }}></div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Expenses</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">$1,800.00</h3>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '45%' }}></div>
             </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analytics</h3>
              <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm px-3 py-1 outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            {/* Placeholder for Chart */}
            <div className="h-64 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
               <span className="text-gray-400">Chart Visualization Component</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h3>
            <div className="space-y-6">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {tx.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{tx.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
             <button className="w-full mt-8 py-3 bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              View All Transactions
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
