import { useFetcher } from "react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { TransactionType } from "~/utils/constants";

interface Category {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialData?: {
    id: string;
    amount: string;
    title: string;
    date: string;
    type: string;
    categoryName: string;
  };
}

export function AddTransactionModal({ isOpen, onClose, categories: initialCategories, initialData }: AddTransactionModalProps) {
  const fetcher = useFetcher();
  const categoryFetcher = useFetcher();
  const hasSubmittedRef = useRef(false);
  
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [view, setView] = useState<"MAIN" | "SELECT_CATEGORY" | "CREATE_CATEGORY">("MAIN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const isCreatingCat = categoryFetcher.state === "submitting";

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
        const matchesType = c.type === type;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });
  }, [categories, type, searchQuery]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
 useEffect(() => {
  if (fetcher.state === "submitting") {
    hasSubmittedRef.current = true;
  }
}, [fetcher.state]);

  useEffect(() => {
    setIsEditing(!!initialData);
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setType(initialData.type as TransactionType);
            setAmount(initialData.amount);
            setTitle(initialData.title);
            setDate(new Date(initialData.date).toISOString().split('T')[0]);
            setSelectedCategoryId(categories.find(c => c.name === initialData.categoryName)?.id || "");
        } else {
             setAmount("");
             setTitle("");
             setDate(new Date().toISOString().split('T')[0]);
             setSelectedCategoryId("");
        }
        setView("MAIN");
        setSearchQuery("");
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (hasSubmittedRef.current && fetcher.state === "idle" && fetcher.data && (fetcher.data as any).success) {
        hasSubmittedRef.current = false;
    setSelectedCategoryId("");
    setView("MAIN");
    setSearchQuery("");
    setAmount("");
    setTitle("");
    setDate(new Date().toISOString().split('T')[0]);
    setIsEditing(false);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  useEffect(() => {
    if (categoryFetcher.state === "idle" && categoryFetcher.data && (categoryFetcher.data as any).success) {
      const newCategory = (categoryFetcher.data as any).category;
      setCategories(prev => {
        if (prev.some(c => c.id === newCategory.id)) return prev;
        return [...prev, newCategory];
      });
      setSelectedCategoryId(newCategory.id);
      setView("MAIN");
    }
  }, [categoryFetcher.state, categoryFetcher.data]);

  if (!isOpen) return null;

  const handleBack = () => {
      if (view === "CREATE_CATEGORY") setView("SELECT_CATEGORY");
      else if (view === "SELECT_CATEGORY") setView("MAIN");
      else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 max-h-[90vh] flex flex-col">
        
        <div className="p-6 pb-2 sm:p-8 sm:pb-4 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {view === "MAIN" && (isEditing ? "Edit Transaction" : "Add Transaction")}
                {view === "SELECT_CATEGORY" && "Select Category"}
                {view === "CREATE_CATEGORY" && "New Category"}
            </h2>
            <button onClick={view === "MAIN" ? onClose : handleBack} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {view === "MAIN" ? (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    )}
                </svg>
            </button>
        </div>

        <div className="p-6 sm:p-8 pt-2 overflow-y-auto custom-scrollbar">

            {view === "CREATE_CATEGORY" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                    <categoryFetcher.Form method="post" action="/api/expense/createCategory">
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
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category Name</label>
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
            )}

            {view === "SELECT_CATEGORY" && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="relative mb-4">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="flex-1 min-h-[200px]">
                        <button 
                            onClick={() => setView("CREATE_CATEGORY")}
                            className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-semibold"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            Create "{searchQuery || "New"}"
                        </button>

                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2">
                                {categories.length === 0 ? "No categories" : "Select Category"}
                           </h3>
                           {filteredCategories.map(cat => (
                               <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategoryId(cat.id);
                                        setView("MAIN");
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        selectedCategoryId === cat.id 
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/30" 
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-transparent"
                                    }`}
                               >
                                    <span className="text-2xl">{cat.icon || "🏷️"}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                                    {selectedCategoryId === cat.id && (
                                        <svg className="w-5 h-5 ml-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                               </button>
                           ))}
                           {filteredCategories.length === 0 && searchQuery && (
                               <p className="text-center text-gray-400 py-8">
                                   No categories found matching "{searchQuery}"
                               </p>
                           )}
                        </div>
                    </div>
                </div>
            )}

            {view === "MAIN" && (
                <fetcher.Form method="post" action={isEditing ? "/api/expense/transactions/update" : "/api/expense/transactions/create"} className="animate-in fade-in slide-in-from-left-4 duration-200">
                    {isEditing && <input type="hidden" name="transactionId" value={initialData!.id} />}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl mb-8">
                        <button
                            type="button"
                            onClick={() => setType(TransactionType.EXPENSE)}
                            className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                                type === TransactionType.EXPENSE 
                                ? "bg-white dark:bg-gray-800 text-red-500 shadow-sm" 
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType(TransactionType.INCOME)}
                            className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                                type === TransactionType.INCOME 
                                ? "bg-white dark:bg-gray-800 text-green-500 shadow-sm" 
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            Income
                        </button>
                        <input type="hidden" name="type" value={type} />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                            <input
                                type="number"
                                name="amount"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl text-2xl font-bold text-gray-900 dark:text-white outline-none transition-colors"
                                placeholder="0.00"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-gray-900 dark:text-white outline-none"
                            placeholder="What is this for?"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</label>
                            <input type="hidden" name="categoryId" value={selectedCategoryId} required />
                            <button
                                type="button"
                                onClick={() => setView("SELECT_CATEGORY")}
                                className={`w-full px-4 py-3 rounded-xl border border-transparent text-left flex items-center gap-2 transition-all ${
                                    selectedCategory 
                                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" 
                                    : "bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                                }`}
                            >
                                {selectedCategory ? (
                                    <>
                                        <span className="text-xl">{selectedCategory.icon}</span>
                                        <span className="truncate flex-1">{selectedCategory.name}</span>
                                    </>
                                ) : (
                                    <span className="text-gray-400 text-sm">Select Category</span>
                                )}
                                <svg className="w-4 h-4 text-gray-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-gray-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={hasSubmittedRef.current}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {hasSubmittedRef.current ? "Saving..." : (isEditing ? "Update Transaction" : "Save Transaction")}
                    </button>
                </fetcher.Form>
            )}

        </div>
      </div>
    </div>
  );
}
