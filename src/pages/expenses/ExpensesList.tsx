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
          <h1 className="text-2xl font-bold text-[#F4F1E8]">Expenses</h1>
          <p className="text-[#A7A39A] text-sm">Track your outgoings</p>
        </div>
        <Button onClick={() => navigate('/app/expenses/add')}>
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="mb-6 bg-[#8B4B4B]/20 border border-[#8B4B4B]/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#8B4B4B]/20 flex items-center justify-center text-[#8B4B4B]">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[#8B4B4B]/80 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-[#8B4B4B]">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#706D66]">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-[#706D66]">No expenses found</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {expenses.map(expense => (
              <div key={expense.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#171613]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#8B4B4B]/20 text-[#8B4B4B] flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#F4F1E8]">{expense.description}</h3>
                    <p className="text-xs text-[#706D66] uppercase mt-0.5">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#8B4B4B]">-₹{expense.amount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-[#706D66] mt-0.5">{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
