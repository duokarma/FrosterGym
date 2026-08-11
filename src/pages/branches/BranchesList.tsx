import { useState, useEffect } from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchBranches, type Branch } from '../../services/branches.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function BranchesList() {
  const { gym } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranches = async () => {
      if (!gym?.id) return;
      try {
        const data = await fetchBranches(gym.id);
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, [gym?.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#d4af37]" />
            Gym Branches
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage multiple locations and franchises</p>
        </div>
        <Button onClick={() => alert('Add Branch dialog coming soon')} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <Card className="bg-[#111] border-white/5">
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading branches...</div>
          ) : branches.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Single Location Setup</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                You currently don't have any secondary branches. Add a branch when you expand to a new location.
              </p>
              <Button onClick={() => alert('Add Branch dialog coming soon')} className="bg-white/5 text-white hover:bg-white/10">
                Add New Location
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((b) => (
                <div key={b.id} className="border border-white/10 rounded-xl p-5 bg-[#0a0a0a] hover:border-[#d4af37]/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{b.name}</h3>
                    <Badge variant={b.status === 'active' ? 'success' : 'default'}>{b.status}</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{b.address || 'No address provided'}</span>
                    </div>
                    {b.phone && (
                      <div className="text-sm text-gray-400 pl-7">{b.phone}</div>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                      <span className="text-gray-500">Manager:</span>
                      <span className="text-gray-300">{(b as any).manager?.full_name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
