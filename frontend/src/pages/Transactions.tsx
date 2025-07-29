import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAllTransactions, addTransaction, deleteTransaction } from '../api/transactionAPIs';
import { Transaction, TransactionFormData } from '../types/transactions';
import { defaultExpenseCategories, defaultIncomeCategories } from '../data/categories';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Form state
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category: defaultExpenseCategories[0],
    description: '',
  });

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters when transactions or filter type changes
  useEffect(() => {
    applyFilters();
  }, [transactions, filterType]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filterType === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === filterType));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) : value 
    }));

    // Update category options when type changes
    if (name === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        category: value === 'income' ? defaultIncomeCategories[0] : defaultExpenseCategories[0] 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addTransaction(formData);
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        // Reset form
        setFormData({
          title: '',
          amount: 0,
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
          category: defaultExpenseCategories[0],
          description: '',
        });
        // Refresh transactions
        fetchTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'income' | 'expense') => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setLoading(true);
      try {
        const result = await deleteTransaction(id, type);
        if (result.success) {
          toast.success(result.message);
          // Refresh transactions
          fetchTransactions();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete transaction');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">All Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Add Transaction Modal Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-2xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Transaction</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Salary, Rent, etc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {formData.type === 'income'
                    ? defaultIncomeCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    : defaultExpenseCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  placeholder="Add a description..."
                ></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-300">
          <Filter size={18} />
          <span>Filter:</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1 rounded-lg ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-1 rounded-lg ${
              filterType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-1 rounded-lg ${
              filterType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <DollarSign className="mr-2" /> Transactions
        </h2>
        
        {loading && <div className="text-center py-8 text-gray-400">Loading transactions...</div>}
        
        {error && <div className="text-center py-8 text-red-400">{error}</div>}
        
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">No transactions found.</div>
        )}
        
        {!loading && !error && filteredTransactions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-gray-800 hover:bg-[#0f172a] transition">
                      <td className="py-3 px-4 text-white">{transaction.title}</td>
                      <td className="py-3 px-4 text-gray-300">{transaction.category}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className={`py-3 px-4 font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(transaction._id, transaction.type)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete transaction"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-gray-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage; 