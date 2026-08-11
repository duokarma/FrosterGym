import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export function ReportsDashboard() {
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-white mb-2">Reports & Analytics</h1>
      <p className="text-zinc-400 text-sm mb-6">Overview of your gym's performance</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <TrendingUp className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Revenue (This Month)</h3>
          <p className="text-2xl font-bold text-white mt-1">₹1,25,000</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <Users className="w-6 h-6 text-[#E5D3B3] mb-2" />
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Active Members</h3>
          <p className="text-2xl font-bold text-white mt-1">150</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <AlertCircle className="w-6 h-6 text-amber-400 mb-2" />
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Renewals Due</h3>
          <p className="text-2xl font-bold text-white mt-1">12</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Attendance Rate</h3>
          <p className="text-2xl font-bold text-white mt-1">68%</p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Placeholder for Charts</h3>
        <div className="h-48 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-dashed border-zinc-700">
          <p className="text-sm text-zinc-500">Chart.js / Recharts visualization goes here</p>
        </div>
      </Card>
    </div>
  );
}
