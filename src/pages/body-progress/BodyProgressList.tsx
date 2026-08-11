import { useState, useEffect } from 'react';
import { Ruler, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchBodyMeasurements, type BodyMeasurement } from '../../services/body-progress.service';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export function BodyProgressList() {
  const { gym } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMeasurements = async () => {
      if (!gym?.id) return;
      try {
        const data = await fetchBodyMeasurements(gym.id);
        setMeasurements(data);
      } catch (error) {
        console.error('Error fetching body measurements:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMeasurements();
  }, [gym?.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <Ruler className="w-8 h-8 text-[#d4af37]" />
            Body Progress
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Track member body measurements over time</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">
          <Plus className="w-4 h-4 mr-2" />
          Record Progress
        </Button>
      </div>

      <Card className="bg-[#111] border-white/5">
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading measurements...</div>
          ) : measurements.length === 0 ? (
            <div className="text-center py-16">
              <Ruler className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Records Yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Start tracking member body metrics like weight, body fat, and body dimensions to show their progress.
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="bg-white/5 text-white hover:bg-white/10">
                Record First Measurement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-400">
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Member</th>
                    <th className="pb-4 font-medium text-right">Weight (kg)</th>
                    <th className="pb-4 font-medium text-right">Body Fat (%)</th>
                    <th className="pb-4 font-medium text-right">Chest (in)</th>
                    <th className="pb-4 font-medium text-right">Waist (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {measurements.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-white text-sm">{new Date(m.measurement_date).toLocaleDateString()}</td>
                      <td className="py-4 text-white text-sm font-medium">{(m as any).member?.full_name || 'Unknown'}</td>
                      <td className="py-4 text-gray-300 text-sm text-right">{m.weight || '-'}</td>
                      <td className="py-4 text-gray-300 text-sm text-right">{m.body_fat_percentage ? `${m.body_fat_percentage}%` : '-'}</td>
                      <td className="py-4 text-gray-300 text-sm text-right">{m.chest || '-'}</td>
                      <td className="py-4 text-gray-300 text-sm text-right">{m.waist || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Body Measurement">
        <div className="space-y-4">
          <Input label="Member ID or Name" placeholder="Search member..." />
          <Input label="Measurement Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight (kg)" type="number" placeholder="0.0" />
            <Input label="Body Fat (%)" type="number" placeholder="0.0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Chest (in)" type="number" placeholder="0.0" />
            <Input label="Waist (in)" type="number" placeholder="0.0" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="border-white/10 text-white hover:bg-white/5">Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">Save Measurement</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
