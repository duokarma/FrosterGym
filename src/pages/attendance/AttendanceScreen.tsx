import { useState } from 'react';
import { Search, ScanLine, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function AttendanceScreen() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMarkPresent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setQuery('');
    }, 2000);
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300 flex flex-col items-center pt-8">
      <div className="w-20 h-20 bg-[#C9A24D]/10 text-[#E2C46B] rounded-full flex items-center justify-center mb-6">
        <ScanLine className="w-10 h-10" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#F4F1E8] mb-2 text-center">Gym Attendance</h1>
      <p className="text-[#A7A39A] text-sm text-center mb-8 max-w-xs">
        Enter member ID or phone number to mark attendance
      </p>

      <form onSubmit={handleMarkPresent} className="w-full max-w-sm space-y-4">
        <Input 
          placeholder="e.g. FG-1001 or 9876543210" 
          icon={<Search className="w-5 h-5" />} 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        
        <Button fullWidth size="lg" type="submit" className={status === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 text-[#F4F1E8] border-emerald-600' : ''}>
          {status === 'success' ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Marked Present!
            </>
          ) : (
            'Mark Attendance'
          )}
        </Button>
      </form>

      <div className="mt-12 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-[#A7A39A] uppercase tracking-wider mb-4">Recent Check-ins</h3>
        <div className="space-y-3">
          {['Rahul Sharma', 'Priya Patel', 'Amit Kumar'].map((name, i) => (
            <div key={i} className="flex justify-between items-center bg-[#11110F] border border-[rgba(255,255,255,0.08)] p-3 rounded-xl">
              <span className="text-sm font-medium text-[#F4F1E8]">{name}</span>
              <span className="text-xs text-[#4D6B5A]">10 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
