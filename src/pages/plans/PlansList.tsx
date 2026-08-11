import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const MOCK_PLANS = [
  { id: 'p1', name: '1 Month Standard', duration: '1 Month', price: 3000, status: 'active' },
  { id: 'p3', name: '3 Months Standard', duration: '3 Months', price: 8000, status: 'active' },
  { id: 'p12', name: 'Annual Pro', duration: '12 Months', price: 25000, status: 'active' },
];

export function PlansList() {
  const navigate = useNavigate();
  const [plans] = useState(MOCK_PLANS);

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1E8]">Membership Plans</h1>
          <p className="text-[#A7A39A] text-sm">Manage your gym's pricing packages</p>
        </div>
        <Button onClick={() => navigate('/app/memberships/add')}>
          <Plus className="w-5 h-5 mr-2" />
          Add Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <EmptyState icon={<Tag className="w-12 h-12" />} title="No plans created" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 hover:border-[#D4AF37]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#F4F1E8]">{plan.name}</h3>
                <Badge variant={plan.status === 'active' ? 'success' : 'default'}>
                  {plan.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#706D66]">Duration</span>
                  <span className="text-zinc-200 font-medium">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#706D66]">Price</span>
                  <span className="text-[#4D6B5A] font-semibold">₹{plan.price}</span>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
