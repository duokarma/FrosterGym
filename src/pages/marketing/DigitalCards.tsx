import { useState } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function DigitalCards() {
  const [memberId, setMemberId] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#d4af37]" />
            Digital ID Cards
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Generate and share digital membership cards with QR codes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <Card className="bg-[#111] border-white/5 p-6">
          <h3 className="text-lg font-medium text-white mb-6">Generate Card</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Member ID or Phone Number</label>
              <Input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="e.g., FG-1001 or 9876543210"
                className="bg-[#0a0a0a]"
              />
            </div>
            <Button onClick={() => alert('Search functionality coming soon')} className="w-full bg-[#d4af37] text-black hover:bg-[#b38b22]">
              Load Member
            </Button>
          </div>
        </Card>

        {/* Live Preview */}
        <div className="flex justify-center items-center">
          <div className="w-[300px] h-[480px] bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl border border-[#d4af37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden flex flex-col items-center py-8">
            <div className="absolute top-0 w-full h-2 bg-[#d4af37]" />
            
            <h2 className="text-2xl font-serif text-[#d4af37] tracking-widest mb-6">FROSTER</h2>
            
            <div className="w-32 h-32 bg-zinc-800 rounded-full border-4 border-[#d4af37]/20 mb-4 flex items-center justify-center overflow-hidden">
               <span className="text-zinc-600 text-sm">No Photo</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">Member Name</h3>
            <p className="text-sm text-gray-400 mb-6">ID: FG-XXXX</p>
            
            <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center mt-auto">
               <QrCode className="w-full h-full text-black" />
            </div>
            <p className="text-[10px] text-gray-500 mt-3 uppercase tracking-widest">Scan at Reception</p>
          </div>
        </div>
      </div>
    </div>
  );
}
