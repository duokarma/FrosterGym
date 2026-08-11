// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Check, User, Phone, Mail, Calendar, MapPin, Briefcase, Target, Droplet, UserPlus } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { fetchMemberById, updateMember, type MemberWithMembership } from '../../services/members.service';
import { useAuth } from '../../contexts/AuthContext';

export function EditMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { gym } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState<MemberWithMembership | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    occupation: '',
    goal: '',
    blood_group: '',
    referral_source: ''
  });

  useEffect(() => {
    if (!gym || !id) return;
    const loadMember = async () => {
      const { data, error } = await fetchMemberById(gym.id, id);
      if (error || !data) {
        toast('error', 'Failed to load member');
        navigate('/members');
      } else {
        setMember(data);
        setFormData({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || 'male',
          address: data.address || '',
          occupation: data.occupation || '',
          goal: data.goal || '',
          blood_group: data.blood_group || '',
          referral_source: data.referral_source || ''
        });
      }
      setLoading(false);
    };
    loadMember();
  }, [gym, id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym || !id) return;

    setSaving(true);
    const { error } = await updateMember(gym.id, id, formData);
    setSaving(false);

    if (error) {
      toast('error', 'Failed to update member');
    } else {
      toast('success', 'Member updated successfully');
      navigate(`/members/${id}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading member details...</div>;
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <PageHeader title="Edit Member" showBack onBack={() => navigate(`/members/${id}`)} />
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-lg font-semibold text-white">Personal Details</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              icon={<User className="w-4 h-4" />} 
              required 
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Gender</label>
              <select 
                className="w-full h-[44px] bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 appearance-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input 
              label="Date of Birth" 
              type="date" 
              icon={<Calendar className="w-4 h-4" />} 
              value={formData.date_of_birth}
              onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
            />
            <Input 
              label="Blood Group" 
              icon={<Droplet className="w-4 h-4" />} 
              placeholder="e.g. O+" 
              value={formData.blood_group}
              onChange={e => setFormData({...formData, blood_group: e.target.value})}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Contact Details</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              label="Phone Number" 
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
            <div className="sm:col-span-2">
              <Input 
                label="Address" 
                icon={<MapPin className="w-4 h-4" />} 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Other Info</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              label="Occupation" 
              icon={<Briefcase className="w-4 h-4" />} 
              value={formData.occupation}
              onChange={e => setFormData({...formData, occupation: e.target.value})}
            />
            <Input 
              label="Fitness Goal" 
              icon={<Target className="w-4 h-4" />} 
              placeholder="e.g. Weight Loss" 
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            />
            <div className="sm:col-span-2">
              <Input 
                label="Referral Source" 
                icon={<UserPlus className="w-4 h-4" />} 
                placeholder="e.g. Walk-in, Google, Friend" 
                value={formData.referral_source}
                onChange={e => setFormData({...formData, referral_source: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <div className="pt-4">
          <Button type="submit" fullWidth size="lg" disabled={saving}>
            <Check className="w-5 h-5 mr-2" />
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

