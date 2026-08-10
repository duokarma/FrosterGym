import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, RefreshCw, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { fetchMemberById, type MemberWithMembership } from '../../services/members.service';
import { fetchPlans, renewMembership, type MembershipPlan } from '../../services/memberships.service';

export function RenewMembership() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gym } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [member, setMember] = useState<MemberWithMembership | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  // Membership State
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Track if paid amount was manually edited
  const [isPaidAmountEdited, setIsPaidAmountEdited] = useState(false);

  const fetchData = async () => {
    if (!id || !gym) return;
    setLoading(true);
    try {
      const [memberResult, plansResult] = await Promise.all([
        fetchMemberById(gym.id, id),
        fetchPlans(gym.id)
      ]);

      if (memberResult.error) throw new Error(memberResult.error);
      
      setMember(memberResult.data);
      setPlans(plansResult);

      if (plansResult.length > 0) {
        setPlanId(plansResult[0].id);
      }

      if (memberResult.data?.current_membership?.status === 'active' && memberResult.data.current_membership.end_date) {
        const endDate = new Date(memberResult.data.current_membership.end_date);
        if (endDate >= new Date()) {
          const nextDay = new Date(endDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setStartDate(nextDay.toISOString().split('T')[0]);
        }
      }

    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, gym]);

  const selectedPlan = useMemo(() => plans.find(p => p.id === planId), [plans, planId]);
  const planAmount = selectedPlan ? selectedPlan.price : 0;

  // Derived Values
  const discountAmount = discountType === 'fixed' 
    ? discountValue 
    : (planAmount * discountValue) / 100;
  const finalAmount = Math.max(0, planAmount - discountAmount);
  const dueAmount = Math.max(0, finalAmount - paidAmount);

  // Auto-set paid amount when final amount changes, unless user edited it
  useEffect(() => {
    if (!isPaidAmountEdited) {
      setPaidAmount(finalAmount);
    }
  }, [finalAmount, isPaidAmountEdited]);

  const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPaidAmountEdited(true);
    setPaidAmount(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !gym || !selectedPlan) return;

    setSaving(true);
    try {
      const response = await renewMembership(gym.id, {
        member_id: id,
        plan_id: planId,
        start_date: startDate,
        original_amount: planAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        paid_amount: paidAmount,
        payment_method: paymentMethod
      });

      if (response.error) throw new Error(response.error);

      toast('success', 'Membership renewed successfully!');
      navigate(`/members/${id}`);

    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'Failed to renew membership');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState fullScreen />;
  if (error) return <ErrorState title="Error" message={error.message} onRetry={fetchData} />;
  if (!member) return <ErrorState title="Not Found" message="Member not found" onRetry={fetchData} />;

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Renew Membership" showBack />

      <div className="px-4 py-3 sm:px-0 mb-6">
        <Card className="flex items-center gap-4">
          <Avatar name={member.full_name} src={member.photo_url} size="lg" />
          <div>
            <h3 className="font-semibold text-white text-lg">{member.full_name}</h3>
            <p className="text-sm text-slate-400">
              Current Status: <span className={member.current_membership?.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}>{member.current_membership?.status || 'No active plan'}</span>
            </p>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-0">
        
        {/* Plan Selection */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Select Plan</h2>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">Plan</label>
            <select 
              className="w-full h-[44px] bg-[#0a0f1c] border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
              value={planId}
              onChange={e => setPlanId(e.target.value)}
              required
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price}
                </option>
              ))}
              {plans.length === 0 && <option value="" disabled>No plans available</option>}
            </select>
          </div>

          <Input 
            label="Start Date" 
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            icon={<Calendar className="w-5 h-5" />}
            required
          />
        </Card>

        {/* Pricing & Discount */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Payment Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Discount</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full h-[44px] bg-[#0a0f1c] border border-white/10 rounded-xl pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  value={discountValue}
                  onChange={e => setDiscountValue(Number(e.target.value))}
                  min={0}
                />
                <button 
                  type="button"
                  className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-white/5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  onClick={() => setDiscountType(t => t === 'fixed' ? 'percentage' : 'fixed')}
                >
                  {discountType === 'fixed' ? '₹' : '%'}
                </button>
              </div>
            </div>

            <Input 
              label="Amount Paid Now" 
              type="number"
              value={paidAmount}
              onChange={handlePaidAmountChange}
              min={0}
              max={finalAmount}
            />
          </div>

          {/* Payment Summary Box */}
          <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-4 space-y-2 mt-4">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Plan Amount</span>
              <span>₹{planAmount}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
              <span>Final Amount</span>
              <span>₹{finalAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-amber-400 pt-1">
              <span>Due Amount</span>
              <span>₹{dueAmount}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-sm font-medium text-slate-300">Payment Method</label>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {['upi', 'cash', 'card'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize flex-1 border transition-colors ${
                    paymentMethod === method 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                    : 'bg-[#0a0f1c] border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Floating Action Button for Save */}
        <div className="fixed bottom-20 left-0 right-0 px-4 pt-4 pb-safe bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c] to-transparent z-40 lg:static lg:bg-none lg:px-0 lg:p-0 lg:pt-4">
          <Button type="submit" fullWidth size="lg" loading={saving} className="shadow-lg shadow-cyan-500/20 font-bold">
            <RefreshCw className="w-5 h-5 mr-2" />
            Process Renewal
          </Button>
        </div>
      </form>
    </div>
  );
}
