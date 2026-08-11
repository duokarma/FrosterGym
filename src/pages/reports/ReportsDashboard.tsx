import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export function ReportsDashboard() {
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-[#F4F1E8] mb-2">Reports & Analytics</h1>
      <p className="text-[#A7A39A] text-sm mb-6">Overview of your gym's performance</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-4 rounded-2xl">
          <TrendingUp className="w-6 h-6 text-[#4D6B5A] mb-2" />
          <h3 className="text-[#A7A39A] text-xs font-semibold uppercase tracking-wider">Revenue (This Month)</h3>
          <p className="text-2xl font-bold text-[#F4F1E8] mt-1">₹1,25,000</p>
        </div>
        <div className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-4 rounded-2xl">
          <Users className="w-6 h-6 text-[#E2C46B] mb-2" />
          <h3 className="text-[#A7A39A] text-xs font-semibold uppercase tracking-wider">Active Members</h3>
          <p className="text-2xl font-bold text-[#F4F1E8] mt-1">150</p>
        </div>
        <div className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-4 rounded-2xl">
          <AlertCircle className="w-6 h-6 text-[#8E7135] mb-2" />
          <h3 className="text-[#A7A39A] text-xs font-semibold uppercase tracking-wider">Renewals Due</h3>
          <p className="text-2xl font-bold text-[#F4F1E8] mt-1">12</p>
        </div>
        <div className="bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-4 rounded-2xl">
          <BarChart3 className="w-6 h-6 text-[#5A6B7C] mb-2" />
          <h3 className="text-[#A7A39A] text-xs font-semibold uppercase tracking-wider">Attendance Rate</h3>
          <p className="text-2xl font-bold text-[#F4F1E8] mt-1">68%</p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-[#F4F1E8] mb-4">Placeholder for Charts</h3>
        <div className="h-48 bg-[#171613]/50 rounded-xl flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.12)]">
          <p className="text-sm text-[#706D66]">Chart.js / Recharts visualization goes here</p>
        </div>
      </Card>
    </div>
  );
}
