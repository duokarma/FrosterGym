// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, CreditCard, DollarSign, Calendar, User } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { fetchMembers } from '../../services/members.service';
import { recordPayment } from '../../services/payments.service';
import { useAuth } from '../../contexts/AuthContext';

export function RecordPayment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { gym } = useAuth();
  
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash'
  });

  useEffect(() => {
    if (!gym) return;
    const loadMembers = async () => {
      try {
        const res = await fetchMembers(gym.id);
        setMembers(res.data || []);
      } catch (error) {
        toast('error', 'Failed to load members');
      }
      setLoading(false);
    };
    loadMembers();
  }, [gym, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;

    if (!formData.member_id || !formData.amount) {
      toast('error', 'Please fill all required fields');
      return;
    }

    setSaving(true);
    const { error } = await recordPayment(gym.id, {
      member_id: formData.member_id,
      amount: parseFloat(formData.amount),
      payment_date: formData.payment_date,
      payment_method: formData.payment_method as any
    });
    setSaving(false);

    if (error) {
      toast('error', 'Failed to record payment');
    } else {
      toast('success', 'Payment recorded successfully');
      navigate('/app/payments');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#706D66]">Loading form...</div>;
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Record Payment" showBack />
      
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto space-y-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-[#F4F1E8]">Payment Details</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300">Member *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A39A]" />
                <select 
                  className="w-full h-[44px] bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-xl pl-10 pr-4 text-[#F4F1E8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                  value={formData.member_id}
                  onChange={e => setFormData({...formData, member_id: e.target.value})}
                  required
                >
                  <option value="">Select a member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.phone})</option>
                  ))}
                </select>
              </div>
            </div>

            <Input 
              label="Amount (₹) *" 
              type="number" 
              icon={<DollarSign className="w-4 h-4" />} 
              required 
              min="1"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />

            <Input 
              label="Payment Date" 
              type="date" 
              icon={<Calendar className="w-4 h-4" />} 
              required 
              value={formData.payment_date}
              onChange={e => setFormData({...formData, payment_date: e.target.value})}
            />

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A39A]" />
                <select 
                  className="w-full h-[44px] bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-xl pl-10 pr-4 text-[#F4F1E8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                  value={formData.payment_method}
                  onChange={e => setFormData({...formData, payment_method: e.target.value})}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="pt-4">
          <Button type="submit" fullWidth size="lg" disabled={saving}>
            <Check className="w-5 h-5 mr-2" />
            {saving ? 'Recording Payment...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}

