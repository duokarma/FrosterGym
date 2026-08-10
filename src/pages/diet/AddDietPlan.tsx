import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Check } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { dietService } from '../../services/diet.service';
import { useAuth } from '../../contexts/AuthContext';

export function AddDietPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { gym } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    calories: '',
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;

    setLoading(true);
    const { error } = await dietService.createDietPlan(gym.id, {
      name: formData.name,
      target: formData.target,
      calories: parseInt(formData.calories) || 0,
      meals: {
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner
      }
    });

    setLoading(false);

    if (error) {
      toast('error', 'Failed to create diet plan');
    } else {
      toast('success', 'Diet Plan Saved!');
      navigate('/diet-plans');
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Create Diet Plan" showBack />
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">
          <Input 
            label="Plan Name" 
            placeholder="e.g. Extreme Weight Loss" 
            required 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input 
            label="Target (e.g. Fat Loss, Muscle Gain)" 
            placeholder="e.g. Fat Loss" 
            value={formData.target}
            onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
          />
          <Input 
            label="Target Calories (kcal)" 
            type="number" 
            placeholder="e.g. 1500" 
            required 
            value={formData.calories}
            onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
          />
          
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase">Meals</h2>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Breakfast</label>
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" 
                rows={2}
                value={formData.breakfast}
                onChange={(e) => setFormData(prev => ({ ...prev, breakfast: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Lunch</label>
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" 
                rows={2}
                value={formData.lunch}
                onChange={(e) => setFormData(prev => ({ ...prev, lunch: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Dinner</label>
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" 
                rows={2}
                value={formData.dinner}
                onChange={(e) => setFormData(prev => ({ ...prev, dinner: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={loading}>
          <Check className="w-5 h-5 mr-2" />
          {loading ? 'Saving...' : 'Save Diet Plan'}
        </Button>
      </form>
    </div>
  );
}
