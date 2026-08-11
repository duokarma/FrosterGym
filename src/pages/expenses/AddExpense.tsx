import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Check } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { addExpense, getExpenseCategories } from '../../services/expenses.service';

export function AddExpense() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { gym } = useAuth();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!gym) return;
    const loadCats = async () => {
      const { data } = await getExpenseCategories(gym.id);
      if (data) {
        setCategories(data);
        if (data.length > 0) setCategory(data[0]);
      }
    };
    loadCats();
  }, [gym]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;
    
    setSubmitting(true);
    const { error } = await addExpense(gym.id, {
      description,
      amount: Number(amount),
      date,
      category,
    });
    setSubmitting(false);

    if (error) {
      toast('error', 'Failed to add expense');
    } else {
      toast('success', 'Expense Logged!');
      navigate('/expenses');
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Add Expense" showBack />
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Input 
          label="Description" 
          placeholder="e.g. Electricity Bill" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required 
        />
        <Input 
          label="Amount (₹)" 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required 
        />
        <Input 
          label="Date" 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required 
        />
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Category</label>
          <select 
            className="w-full h-[44px] bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          <Check className="w-5 h-5 mr-2" />
          {submitting ? 'Saving...' : 'Save Expense'}
        </Button>
      </form>
    </div>
  );
}
