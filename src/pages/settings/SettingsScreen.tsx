import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Save, Plus, Building2, UploadCloud, Building, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is used, if not we'll handle it or change to custom Toast

export const SettingsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [gymName, setGymName] = useState('Froster Gym HQ');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('admin@frostergym.com');
  const [address, setAddress] = useState('123 Fitness Street, Gym City');
  
  const [gstPercent, setGstPercent] = useState('18');
  const [currency, setCurrency] = useState('₹');
  const [invoicePrefix, setInvoicePrefix] = useState('FG-');

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate toast
      const event = new CustomEvent('show-toast', { detail: { message: 'Settings saved successfully', type: 'success' } });
      window.dispatchEvent(event);
      // fallback if using react-hot-toast
      if (typeof toast !== 'undefined' && toast.success) {
        toast.success('Settings saved successfully');
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Settings" 
          subtitle="Manage your gym profile, billing, and branches" 
        />
        <Button 
          variant="primary" 
          icon={<Save className="w-4 h-4" />} 
          onClick={handleSave}
          loading={loading}
        >
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <Card className="p-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-[#F4F1E8] font-medium transition-colors">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Gym Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 text-[#A7A39A] hover:text-[#F4F1E8] transition-colors">
              <Percent className="w-5 h-5" />
              Billing & Taxes
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 text-[#A7A39A] hover:text-[#F4F1E8] transition-colors">
              <Building className="w-5 h-5" />
              Branches
            </button>
          </Card>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Gym Profile Section */}
          <Card>
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-[#F4F1E8]">Gym Profile</h2>
              <p className="text-sm text-[#A7A39A] mt-1">Basic information about your business</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Logo Upload (Placeholder) */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-300">Gym Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-[#706D66]" />
                  </div>
                  <Button variant="secondary" icon={<UploadCloud className="w-4 h-4" />}>
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Gym Name" 
                  value={gymName} 
                  onChange={(e) => setGymName(e.target.value)} 
                  placeholder="Enter gym name"
                />
                <Input 
                  label="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Enter phone number"
                />
                <Input 
                  label="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter email address"
                  type="email"
                />
                <Input 
                  label="Address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </Card>

          {/* Billing & Taxes Section */}
          <Card>
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-[#F4F1E8]">Billing & Taxes</h2>
              <p className="text-sm text-[#A7A39A] mt-1">Configure your invoice and tax settings</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="GST Percentage (%)" 
                value={gstPercent} 
                onChange={(e) => setGstPercent(e.target.value)} 
                placeholder="e.g. 18"
                type="number"
              />
              <Input 
                label="Currency Symbol" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                placeholder="e.g. ₹ or $"
              />
              <Input 
                label="Invoice Prefix" 
                value={invoicePrefix} 
                onChange={(e) => setInvoicePrefix(e.target.value)} 
                placeholder="e.g. FG-"
              />
            </div>
          </Card>

          {/* Branches Section */}
          <Card>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#F4F1E8]">Branches</h2>
                <p className="text-sm text-[#A7A39A] mt-1">Manage multiple gym locations</p>
              </div>
              <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>
                Add Branch
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#F4F1E8] font-medium">Main Branch (HQ)</h3>
                    <p className="text-sm text-[#A7A39A]">{address}</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
