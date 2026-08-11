// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Salad } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { dietService, type DietPlan } from '../../services/diet.service';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

export function DietPlansList() {
  const navigate = useNavigate();
  const { gym } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [gym]);

  const loadPlans = async () => {
    if (!gym) return;
    setLoading(true);
    const { data, error } = await dietService.fetchDietPlans(gym.id);
    if (error) {
      toast('error', 'Failed to load diet plans');
    } else if (data) {
      setPlans(data);
    }
    setLoading(false);
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1E8]">Diet Plans</h1>
          <p className="text-[#A7A39A] text-sm">Manage nutrition templates</p>
        </div>
        <Button onClick={() => navigate('/app/diet-plans/add')}>
          <Plus className="w-5 h-5 mr-2" />
          Add Diet
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-[#A7A39A] py-10">Loading plans...</div>
      ) : plans.length === 0 ? (
        <EmptyState icon={<Salad className="w-12 h-12" />} title="No diet plans" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#4D6B5A]/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Salad className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F4F1E8]">{plan.name}</h3>
                  <p className="text-xs text-[#706D66]">{plan.target || 'General'} • {plan.calories} kcal</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" fullWidth>View Details</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


