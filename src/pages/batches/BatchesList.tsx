import { useState, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchBatches, type Batch } from '../../services/batches.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function BatchesList() {
  const { gym } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBatches = async () => {
      if (!gym?.id) return;
      try {
        const data = await fetchBatches(gym.id);
        setBatches(data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBatches();
  }, [gym?.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#d4af37]" />
            Gym Batches
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage morning and evening time slots</p>
        </div>
        <Button onClick={() => alert('Add Batch dialog coming soon')} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <Card className="bg-[#111] border-white/5">
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading batches...</div>
          ) : batches.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Batches Configured</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Organize your members by creating morning, afternoon, or evening batches.
              </p>
              <Button onClick={() => alert('Add Batch dialog coming soon')} className="bg-white/5 text-white hover:bg-white/10">
                Create First Batch
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-400">
                    <th className="pb-4 font-medium">Batch Name</th>
                    <th className="pb-4 font-medium">Timing</th>
                    <th className="pb-4 font-medium">Trainer</th>
                    <th className="pb-4 font-medium">Capacity</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {batches.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-white text-sm font-medium">{b.name}</td>
                      <td className="py-4 text-gray-300 text-sm">{b.time_slot}</td>
                      <td className="py-4 text-gray-400 text-sm">{(b as any).trainer?.name || 'Unassigned'}</td>
                      <td className="py-4 text-gray-300 text-sm flex items-center gap-2">
                        {b.max_capacity > 0 ? `0 / ${b.max_capacity}` : 'Unlimited'}
                      </td>
                      <td className="py-4">
                        <Badge variant={b.status === 'active' ? 'success' : 'default'}>{b.status}</Badge>
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
