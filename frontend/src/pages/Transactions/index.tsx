import React, { useState, useEffect } from 'react';
import { Plus, BarChart2 } from 'lucide-react';
import { fetchAllTransactions, addTransaction, deleteTransaction } from '../../api/transactionAPIs';
import { Transaction, TransactionFormData } from '../../types/transactions';
import { defaultExpenseCategories } from '../../data/categories';
import toast from 'react-hot-toast';
import { 
  TransactionForm, 
  TransactionFilters, 
  TransactionTable, 
  TransactionPagination 
} from '../../components/transactions';

const ITEMS_PER_PAGE = 10;

interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

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

  // Apply filters when transactions or filters change
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

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
    let result = [...transactions];
    
    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    
    // Filter by category
    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(t => new Date(t.date) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= toDate);
    }
    
    // Filter by amount range
    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      result = result.filter(t => t.amount >= minAmount);
    }
    
    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      result = result.filter(t => t.amount <= maxAmount);
    }
    
    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
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
        category: value === 'income' ? 'Salary' : 'Food' 
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0d1424] py-8 px-4 md:px-8 bg-gradient-animate">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
                <BarChart2 className="text-white" size={24} />
              </div>
              Transactions
            </h1>
            <p className="text-gray-400 mt-1">Manage and track all your financial transactions</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <TransactionForm
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Transaction Filters */}
        <TransactionFilters 
          filterType={filters.type} 
          onFilterChange={setFilters}
          currentFilters={filters}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={paginatedTransactions}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {!loading && !error && filteredTransactions.length > 0 && (
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTransactions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage; 