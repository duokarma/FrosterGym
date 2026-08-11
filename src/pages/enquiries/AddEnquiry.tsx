// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, User, Phone, Mail, Target, Clock, MessageSquare, Dumbbell, Calendar, Apple } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { addEnquiry } from '../../services/enquiries.service';
import { useAuth } from '../../contexts/AuthContext';

export function AddEnquiry() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { gym } = useAuth();
  
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interested_plan: '',
    duration: '',
    training_required: false,
    diet_required: false,
    source: 'Walk-in',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;

    if (!formData.name || !formData.phone) {
      toast('error', 'Please fill the required fields');
      return;
    }

    setSaving(true);
    const { error } = await addEnquiry(gym.id, formData);
    setSaving(false);

    if (error) {
      toast('error', 'Failed to add enquiry');
    } else {
      toast('success', 'Enquiry added successfully');
      navigate('/app/enquiries');
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="New Enquiry" showBack onBack={() => navigate('/app/enquiries')} />
      
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto space-y-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-lg font-semibold text-white">Prospect Details</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              label="Full Name *" 
              icon={<User className="w-4 h-4" />} 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Phone Number *" 
              type="tel" 
              icon={<Phone className="w-4 h-4" />} 
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <Input 
              label="Email Address" 
              type="email" 
              icon={<Mail className="w-4 h-4" />} 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Source</label>
              <select 
                className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                value={formData.source}
                onChange={e => setFormData({...formData, source: e.target.value})}
              >
                <option value="Walk-in">Walk-in</option>
                <option value="Phone">Phone</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Interest & Requirements</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              label="Interested Plan" 
              icon={<Dumbbell className="w-4 h-4" />} 
              placeholder="e.g. Premium Plan"
              value={formData.interested_plan}
              onChange={e => setFormData({...formData, interested_plan: e.target.value})}
            />
            <Input 
              label="Duration" 
              icon={<Clock className="w-4 h-4" />} 
              placeholder="e.g. 6 Months"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
            />
            
            <div className="flex items-center gap-2 mt-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={() => setFormData({...formData, training_required: !formData.training_required})}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.training_required ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                {formData.training_required && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium text-zinc-300">Requires Personal Training</span>
            </div>

            <div className="flex items-center gap-2 mt-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={() => setFormData({...formData, diet_required: !formData.diet_required})}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.diet_required ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                {formData.diet_required && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium text-zinc-300">Requires Diet Plan</span>
            </div>
          </div>

          <div className="space-y-1.5 mt-4">
            <label className="block text-sm font-medium text-zinc-300">Additional Notes / Message</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              placeholder="Any specific goals, medical conditions, or requests..."
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>
        </Card>

        <div className="pt-4">
          <Button type="submit" fullWidth size="lg" disabled={saving}>
            <Check className="w-5 h-5 mr-2" />
            {saving ? 'Adding Enquiry...' : 'Add Enquiry'}
          </Button>
        </div>
      </form>
    </div>
  );
}

