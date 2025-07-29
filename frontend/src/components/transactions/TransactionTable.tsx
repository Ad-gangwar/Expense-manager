import React from 'react';
import { DollarSign, Trash2, Calendar, Tag, ArrowUpRight, ArrowDownRight, Edit } from 'lucide-react';
import { Transaction } from '../../types/transactions';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string, type: 'income' | 'expense') => void;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  error,
  onDelete,
  onEdit
}) => {
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl border border-gray-800/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
              <DollarSign className="text-white" size={20} />
            </div>
            Transactions
          </h2>
          
          {!loading && !error && transactions.length > 0 && (
            <div className="bg-[#0d1424] px-3 py-1 rounded-full text-gray-300 text-sm font-medium border border-gray-700/50 shadow-inner">
              {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Loading transactions...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600/30 hover:bg-red-600/50 text-red-300 px-4 py-2 rounded-lg font-medium transition"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-[#0f172a]/50 rounded-lg border border-gray-800/50">
            <div className="bg-[#0d1424] p-4 rounded-full mb-4">
              <DollarSign className="text-gray-400" size={32} />
            </div>
            <div className="text-gray-400 text-lg mb-2">No transactions found</div>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Try adjusting your filters or add a new transaction to get started.
            </p>
          </div>
        )}
        
        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-800/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0f172a]">
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Title</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Category</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Date</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Amount</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr 
                      key={transaction._id} 
                      className={`border-b border-gray-800 hover:bg-[#0d1424] transition group ${
                        index % 2 === 0 ? 'bg-[#0f172a]/30' : 'bg-[#0f172a]/60'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            transaction.type === 'income' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {transaction.type === 'income' 
                              ? <ArrowUpRight size={14} /> 
                              : <ArrowDownRight size={14} />
                            }
                          </div>
                          <div>
                            <div className="text-white font-medium">{transaction.title}</div>
                            <div className="text-gray-500 text-xs">
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Tag size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{transaction.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center font-semibold ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          <span>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(transaction)}
                              className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition"
                              title="Edit transaction"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(transaction._id, transaction.type)}
                            className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                            title="Delete transaction"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable; 