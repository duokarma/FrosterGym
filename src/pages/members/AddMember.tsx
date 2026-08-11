import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, User, Phone, Mail, Calendar, MapPin, Check, Plus, Briefcase, Target, Droplet, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { createMember } from '../../services/members.service';
import { fetchPlans, assignMembership, type MembershipPlan } from '../../services/memberships.service';

export function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();
  const enquiryState = location.state?.enquiry;
  const { gym } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form State - Personal Info
  const [fullName, setFullName] = useState(enquiryState?.name || '');
  const [phone, setPhone] = useState(enquiryState?.phone || '');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  
  // Form State - Contact & Other Info
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [goal, setGoal] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [referralSource, setReferralSource] = useState(enquiryState?.notes || '');

  // Plans
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  
  // Membership State
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    async function loadPlans() {
      if (!gym) return;
      try {
        const activePlans = await fetchPlans(gym.id);
        setPlans(activePlans);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadPlans();
  }, [gym]);

  // Derived Values
  const selectedPlan = plans.find(p => p.id === planId);
  const planAmount = selectedPlan ? selectedPlan.price : 0;
  
  const discountAmount = discountType === 'fixed' 
    ? discountValue 
    : (planAmount * discountValue) / 100;
    
  const finalAmount = Math.max(0, planAmount - discountAmount);
  const dueAmount = Math.max(0, finalAmount - paidAmount);

  // When plan changes, reset amounts
  useEffect(() => {
    if (selectedPlan) {
      setDiscountValue(0);
      setPaidAmount(selectedPlan.price);
    } else {
      setPaidAmount(0);
    }
  }, [planId, selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone) {
      toast('error', 'Name and Phone are required');
      return;
    }

    if (!gym) return;

    setLoading(true);

    try {
      // 1. Create Member
      const memberResponse = await createMember(gym.id, {
        full_name: fullName,
        phone,
        email: email || undefined,
        date_of_birth: dob || undefined,
        gender: gender || undefined,
        address: address || undefined,
        occupation: occupation || undefined,
        goal: goal || undefined,
        blood_group: bloodGroup || undefined,
        referral_source: referralSource || undefined,
        status: 'active'
      });

      if (memberResponse.error || !memberResponse.data) {
        throw new Error(memberResponse.error || 'Failed to create member');
      }

      const member = memberResponse.data;

      // 2. Assign Membership (if plan selected)
      if (planId && selectedPlan) {
        const assignResponse = await assignMembership(gym.id, {
          member_id: member.id,
          plan_id: planId,
          start_date: startDate,
          original_amount: planAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          paid_amount: paidAmount,
          payment_method: paymentMethod
        });

        if (assignResponse.error) {
          throw new Error(assignResponse.error);
        }
      }

      toast('success', 'Member added successfully!');
      navigate(`/members/${member.id}`);

    } catch (err: any) {
      console.error(err);
      toast('error', err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-zinc-400">Loading...</div>;
  }

  return (
    <div className="pb-24 animate-in slide-in-from-bottom duration-300">
      <PageHeader title="Add New Member" showBack />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Photo Upload Area (UI Only for now) */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-900/50 backdrop-blur-xl border-2 border-dashed border-zinc-700 flex items-center justify-center">
              <Camera className="w-8 h-8 text-zinc-600" />
            </div>
            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-zinc-950 text-white shadow-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[#E5D3B3] uppercase tracking-wider mb-2">Personal Details</h2>
          
          <Input 
            label="Full Name" 
            placeholder="e.g. Rahul Sharma" 
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            icon={<User className="w-5 h-5" />}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              icon={<Calendar className="w-5 h-5" />}
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Gender</label>
              <select 
                className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Occupation" 
              placeholder="e.g. Software Engineer" 
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              icon={<Briefcase className="w-5 h-5" />}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Blood Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Droplet className="w-5 h-5 text-zinc-500" />
                </div>
                <select 
                  className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Contact Details */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[#E5D3B3] uppercase tracking-wider mb-2">Contact Details</h2>
          
          <Input 
            label="Phone Number" 
            type="tel"
            placeholder="e.g. 9876543210" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            icon={<Phone className="w-5 h-5" />}
            required
          />

          <Input 
            label="Email (Optional)" 
            type="email"
            placeholder="e.g. rahul@example.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
          />

          <Input 
            label="Address" 
            placeholder="Enter full address" 
            value={address}
            onChange={e => setAddress(e.target.value)}
            icon={<MapPin className="w-5 h-5" />}
          />
        </Card>
        
        {/* Section 3: Extra Info */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[#E5D3B3] uppercase tracking-wider mb-2">Other Info</h2>
          <div className="grid grid-cols-2 gap-4">
             <Input 
                label="Fitness Goal" 
                placeholder="e.g. Weight Loss" 
                value={goal}
                onChange={e => setGoal(e.target.value)}
                icon={<Target className="w-5 h-5" />}
              />
              <Input 
                label="Referral Source" 
                placeholder="e.g. Walk-in, Friend" 
                value={referralSource}
                onChange={e => setReferralSource(e.target.value)}
                icon={<Users className="w-5 h-5" />}
              />
          </div>
        </Card>

        {/* Section 4: Membership & Payment */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-[#E5D3B3] uppercase tracking-wider mb-2">Membership & Payment</h2>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Select Plan</label>
            <select 
              className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
              value={planId}
              onChange={e => setPlanId(e.target.value)}
            >
              <option value="">No Plan (Add member only)</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
              ))}
            </select>
          </div>

          {planId && selectedPlan && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200 pt-2">
              <Input 
                label="Start Date" 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                icon={<Calendar className="w-5 h-5" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-300">Discount</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      value={discountValue}
                      onChange={e => setDiscountValue(Number(e.target.value))}
                      min={0}
                    />
                    <button 
                      type="button"
                      className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-zinc-800/80 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
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
                  onChange={e => setPaidAmount(Number(e.target.value))}
                  min={0}
                  max={finalAmount}
                />
              </div>

              {/* Payment Summary Box */}
              <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4 space-y-2 mt-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Plan Amount</span>
                  <span>₹{planAmount}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-zinc-800/50">
                  <span>Final Amount</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-amber-400 pt-1">
                  <span>Due Amount</span>
                  <span>₹{dueAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-sm font-medium text-zinc-300">Payment Method</label>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {['upi', 'cash', 'card'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium capitalize flex-1 border transition-all ${
                        paymentMethod === method 
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 text-[#E5D3B3] shadow-sm shadow-[#D4AF37]/20' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Floating Action Button for Save */}
        <div className="fixed bottom-20 left-0 right-0 px-4 pt-4 pb-safe bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-40 lg:static lg:bg-none lg:px-0 lg:p-0 lg:pt-4">
          <Button type="submit" fullWidth size="lg" loading={loading} className="shadow-lg shadow-[#D4AF37]/20">
            <Check className="w-5 h-5 mr-2" />
            Save Member
          </Button>
        </div>
      </form>
    </div>
  );
}
