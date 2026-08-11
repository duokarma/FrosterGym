import { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchServices, type Service } from '../../services/services.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ServicesList() {
  const { gym } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      if (!gym?.id) return;
      try {
        const data = await fetchServices(gym.id);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [gym?.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#d4af37]" />
            Additional Services
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage spa, lockers, merchandise, etc.</p>
        </div>
        <Button onClick={() => alert('Add Service dialog coming soon')} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card className="bg-[#111] border-white/5">
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Services Added</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Add additional paid services like lockers, steam rooms, or protein shakes.
              </p>
              <Button onClick={() => alert('Add Service dialog coming soon')} className="bg-white/5 text-white hover:bg-white/10">
                Create First Service
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-400">
                    <th className="pb-4 font-medium">Service Name</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-white text-sm font-medium">{s.name}</td>
                      <td className="py-4 text-gray-400 text-sm">{s.description || '-'}</td>
                      <td className="py-4 text-white text-sm font-bold">₹{s.price}</td>
                      <td className="py-4">
                        <Badge variant={s.status === 'active' ? 'success' : 'default'}>{s.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
