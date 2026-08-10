import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Check, Tag, Clock } from 'lucide-react';

export function AddPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast('success', 'Plan created successfully! (Demo)');
    navigate('/memberships');
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Add New Plan" showBack />
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">
          <Input label="Plan Name" placeholder="e.g. 6 Months Pro" icon={<Tag className="w-5 h-5" />} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (Months)" type="number" placeholder="6" icon={<Clock className="w-5 h-5" />} required />
            <Input label="Price (₹)" type="number" placeholder="15000" required />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Description (Optional)</label>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              rows={4}
              placeholder="Features included in this plan..."
            ></textarea>
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-4 pt-4 pb-safe bg-gradient-to-t from-zinc-950 to-transparent lg:static lg:bg-none lg:px-0 lg:p-0">
          <Button type="submit" fullWidth size="lg">
            <Check className="w-5 h-5 mr-2" />
            Save Plan
          </Button>
        </div>
      </form>
    </div>
  );
}
