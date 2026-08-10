import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Receipt, IndianRupee } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { fetchExpenses, type Expense } from '../../services/expenses.service';

export function ExpensesList() {
  const navigate = useNavigate();
  const { gym } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gym) return;
    const load = async () => {
      setLoading(true);
      const { data } = await fetchExpenses(gym.id);
      if (data) setExpenses(data);
      setLoading(false);
    };
    load();
  }, [gym]);

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-zinc-400 text-sm">Track your outgoings</p>
        </div>
        <Button onClick={() => navigate('/expenses/add')}>
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-red-400/80 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No expenses found</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {expenses.map(expense => (
              <div key={expense.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{expense.description}</h3>
                    <p className="text-xs text-zinc-500 uppercase mt-0.5">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-400">-₹{expense.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
