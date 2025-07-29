import React from 'react';
import { TransactionFormData } from '../../types/transactions';
import { defaultExpenseCategories, defaultIncomeCategories } from '../../data/categories';

interface TransactionFormProps {
  formData: TransactionFormData;
  loading: boolean;
  isEditing?: boolean;
  transactionId?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  formData,
  loading,
  isEditing = false,
  transactionId,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-2xl w-full max-w-2xl border border-gray-800/40">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
              placeholder="Add a description..."
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition shadow-lg hover:shadow-indigo-500/20"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm; 