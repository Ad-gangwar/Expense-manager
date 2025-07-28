import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { fetchExpenseCategorySummary, fetchIncomeCategorySummary, fetchExpenseMonthlySummary, fetchIncomeMonthlySummary, fetchRecentExpenses } from '../../api/authAPIs';

// Types for our data
interface CategoryData {
  category: string;
  amount: number;
}

interface MonthData {
  month: string;
  amount: number;
}

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface PieSegment {
  category: string;
  amount: number;
  percent: number;
  color: string;
  rotate: number;
  dashArray: string;
}

// Budget Overview Card
const BudgetOverviewCard = ({ budget, totalIncome, totalExpenses, remaining }: any) => {
  const percentUsed = ((budget - remaining) / budget) * 100;
  
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Wallet className="mr-2" /> Monthly Budget Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Budget</p>
          <p className="text-2xl font-bold text-white">${budget}</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Income</p>
          <p className="text-2xl font-bold text-green-500">${totalIncome}</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Expenses</p>
          <p className="text-2xl font-bold text-red-500">${totalExpenses}</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Remaining</p>
          <p className="text-2xl font-bold text-blue-500">${remaining}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${percentUsed > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">{percentUsed.toFixed(1)}% of budget used</p>
    </div>
  );
};

// Transactions Overview Bar Chart (Income vs Expenses per day)
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
    const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
    return (
      <div className="bg-[#181028] border border-[#333] px-4 py-2 rounded-lg shadow-lg text-base">
        <div className="text-white font-semibold mb-1">{label}</div>
        <div className="text-purple-300">Expense : ₹{expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="text-green-400">Income : ₹{income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>
    );
  }
  return null;
};

// Helper to generate daily data from monthly data (for demo)
function generateDailyData(incomeByMonth: MonthData[], expensesByMonth: MonthData[]) {
  // For demo, generate 30 days with random values based on monthly totals
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const label = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    return label;
  });
  // Distribute monthly totals randomly for demo
  function randomSplit(total: number) {
    let arr = Array(30).fill(0);
    let sum = 0;
    for (let i = 0; i < 29; i++) {
      arr[i] = Math.round(Math.random() * (total / 10));
      sum += arr[i];
    }
    arr[29] = total - sum;
    return arr;
  }
  const incomeArr = randomSplit(incomeByMonth.reduce((a, b) => a + b.amount, 0));
  const expenseArr = randomSplit(expensesByMonth.reduce((a, b) => a + b.amount, 0));
  return days.map((label, i) => ({
    date: label,
    income: Math.max(0, incomeArr[i]),
    expense: Math.max(0, expenseArr[i]),
  }));
}

const TransactionsOverview = ({ incomeByMonth, expensesByMonth }: { incomeByMonth: MonthData[], expensesByMonth: MonthData[] }) => {
  if ((!incomeByMonth || incomeByMonth.length === 0) && (!expensesByMonth || expensesByMonth.length === 0)) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl flex items-center justify-center min-h-[200px]">
        <h2 className="text-2xl font-bold text-white">Transactions Overview</h2>
        <div className="text-gray-400 text-lg ml-4">No data available</div>
      </div>
    );
  }
  const data = generateDailyData(incomeByMonth, expensesByMonth);
  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white">Transactions Overview</h2>
        <div>
          <select className="bg-[#181028] text-white px-3 py-1 rounded-lg border border-[#333] focus:outline-none">
            <option>Last Month</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ReBarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#232136" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#bdb4e1', fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#bdb4e1', fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
          <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#a78bfa22' }} />
          <Bar dataKey="income" fill="#4ade80" radius={[6, 6, 0, 0]} barSize={18} />
          <Bar dataKey="expense" fill="#a78bfa" radius={[6, 6, 0, 0]} barSize={18} />
        </ReBarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-8 mt-4">
        <span className="text-green-400 text-lg font-semibold">Income: ₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className="text-pink-400 text-lg font-semibold">Expenses: ₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
};

// Pie Chart Component using recharts
const COLORS_EXPENSE = ['#a78bfa', '#f472b6', '#facc15', '#34d399', '#38bdf8', '#f87171', '#fbbf24'];
const COLORS_INCOME = ['#4ade80', '#22d3ee', '#818cf8', '#f472b6', '#facc15'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-[#f472b6]/80 text-black px-4 py-2 rounded-lg shadow-lg text-lg font-semibold">
        {name} : ₹{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({
  data,
  title,
  colorScheme
}: {
  data: CategoryData[],
  title: string,
  colorScheme: 'income' | 'expense'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <PieChartIcon className="mr-2" /> {title}
        </h2>
        <div className="text-gray-400 text-lg">No data available</div>
      </div>
    );
  }
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const COLORS = colorScheme === 'expense' ? COLORS_EXPENSE : COLORS_INCOME;

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <PieChartIcon className="mr-2" /> {title}
        </h2>
        <span className="text-pink-400 text-3xl font-bold">
          ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 flex-1">
        {/* Donut Chart */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                cornerRadius={8}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center total */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-white text-lg font-semibold">Total</span>
            <span className="text-pink-400 text-2xl font-bold">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex-1 w-full max-w-xs space-y-3">
          {data.map((item, idx) => {
            const percent = total ? (item.amount / total) * 100 : 0;
            return (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-gray-300 text-base">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className="bg-[#a78bfa]/20 text-[#a78bfa] text-xs px-2 py-0.5 rounded-full font-semibold">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Recent Transactions
const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <DollarSign className="mr-2" /> Recent Transactions
      </h2>
      {(!transactions || transactions.length === 0) ? (
        <div className="text-gray-400 text-lg text-center py-8">No transactions available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-800 hover:bg-[#0f172a] transition">
                  <td className="py-3 px-4 text-white">{transaction.title}</td>
                  <td className="py-3 px-4 text-gray-300">{transaction.category}</td>
                  <td className="py-3 px-4 text-gray-300">{transaction.date}</td>
                  <td className={`py-3 px-4 font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const EXPENSE_BAR_COLORS = ['#a78bfa', '#7c3aed', '#c4b5fd', '#6d28d9', '#818cf8', '#6366f1', '#a5b4fc'];

const TopExpenseCategories = ({ data }: { data: CategoryData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl flex items-center justify-center min-h-[200px]">
        <h2 className="text-xl font-bold text-white mb-6">Top Expense Categories</h2>
        <div className="text-gray-400 text-lg ml-4">No data available</div>
      </div>
    );
  }
  // Sort by amount descending
  const sorted = [...data].sort((a, b) => b.amount - a.amount);
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Top Expense Categories</h2>
      <ResponsiveContainer width="70%" height={300}>
        <ReBarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
          barCategoryGap={8}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="category"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#e0e7ff', fontSize: 16, fontWeight: 500 }}
            width={120}
          />
          <Tooltip
            cursor={{ fill: '#a78bfa22' }}
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div className="bg-[#181028] border border-[#333] px-4 py-2 rounded-lg shadow-lg text-base text-white">
                  {payload[0].payload.category}: ₹{payload[0].payload.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              ) : null
            }
          />
          <Bar
            dataKey="amount"
            fill="#a78bfa"
            radius={[0, 12, 12, 0]}
            isAnimationActive={false}
          >
            {sorted.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={EXPENSE_BAR_COLORS[idx % EXPENSE_BAR_COLORS.length]} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [incomeByCategory, setIncomeByCategory] = React.useState<CategoryData[]>([]);
  const [expensesByCategory, setExpensesByCategory] = React.useState<CategoryData[]>([]);
  const [incomeByMonth, setIncomeByMonth] = React.useState<MonthData[]>([]);
  const [expensesByMonth, setExpensesByMonth] = React.useState<MonthData[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
  const [budget, setBudget] = React.useState<number>(0);
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [totalExpenses, setTotalExpenses] = React.useState<number>(0);
  const [remaining, setRemaining] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [incomeCat, expenseCat, incomeMonth, expenseMonth, recent] = await Promise.all([
          fetchIncomeCategorySummary(),
          fetchExpenseCategorySummary(),
          fetchIncomeMonthlySummary(),
          fetchExpenseMonthlySummary(),
          fetchRecentExpenses(),
        ]);
        setIncomeByCategory(incomeCat);
        setExpensesByCategory(expenseCat);
        setIncomeByMonth(incomeMonth);
        setExpensesByMonth(expenseMonth);
        setRecentTransactions(recent.map((tx: any) => ({
          id: tx._id,
          title: tx.title,
          amount: tx.amount,
          type: tx.type || 'expense',
          date: tx.date ? new Date(tx.date).toISOString().slice(0, 10) : '',
          category: tx.category,
        })));
        // Calculate budget, totals, remaining
        const totalIncomeVal = incomeMonth.reduce((sum: number, m: MonthData) => sum + m.amount, 0);
        const totalExpenseVal = expenseMonth.reduce((sum: number, m: MonthData) => sum + m.amount, 0);
        setTotalIncome(totalIncomeVal);
        setTotalExpenses(totalExpenseVal);
        setBudget(totalIncomeVal); // or fetch from user profile if available
        setRemaining(totalIncomeVal - totalExpenseVal);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        <BudgetOverviewCard 
          budget={budget}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          remaining={remaining}
        />
        <TransactionsOverview 
          incomeByMonth={incomeByMonth}
          expensesByMonth={expensesByMonth}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryPieChart 
            data={incomeByCategory}
            title="Income by Category"
            colorScheme="income"
          />
          <CategoryPieChart 
            data={expensesByCategory}
            title="Expenses by Category"
            colorScheme="expense"
          />
        </div>
        <TopExpenseCategories data={expensesByCategory} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
      {loading && <div className="text-white text-center mt-4">Loading...</div>}
      {error && <div className="text-red-400 text-center mt-4">{error}</div>}
    </div>
  );
};

export default Dashboard; 