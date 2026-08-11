import { useState } from 'react';
import { MessageSquare, Send, Users, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function SMSCampaigns() {
  const [message, setMessage] = useState('');
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#d4af37]" />
            SMS Campaigns
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Send bulk SMS for offers, renewals, and announcements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111] border-white/5 p-6 relative overflow-hidden cursor-pointer hover:border-[#d4af37]/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16 text-[#d4af37]" /></div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Target Audience</h3>
          <p className="text-2xl font-bold text-white">All Active Members</p>
        </Card>
        <Card className="bg-[#111] border-white/5 p-6 relative overflow-hidden cursor-pointer hover:border-[#d4af37]/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Calendar className="w-16 h-16 text-[#d4af37]" /></div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Target Audience</h3>
          <p className="text-2xl font-bold text-white">Expiring in 7 Days</p>
        </Card>
        <Card className="bg-[#111] border-white/5 p-6 relative overflow-hidden cursor-pointer hover:border-[#d4af37]/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10"><MessageSquare className="w-16 h-16 text-[#d4af37]" /></div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">SMS Credits Balance</h3>
          <p className="text-4xl font-bebas text-white">1,250</p>
        </Card>
      </div>

      <Card className="bg-[#111] border-white/5 p-6">
        <h3 className="text-lg font-medium text-white mb-6">Compose Message</h3>
        <div className="space-y-4">
          <div>
            <textarea
              className="w-full h-32 bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="Type your SMS message here... (e.g. Hi [Name], your membership at Froaster Gym expires on [Date]. Renew now to get 10% off!)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">{message.length} / 160 characters (1 SMS)</span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="text-xs py-1 h-auto">Insert [Name]</Button>
                <Button size="sm" variant="secondary" className="text-xs py-1 h-auto">Insert [Expiry Date]</Button>
              </div>
            </div>
          </div>
          <Button onClick={() => alert('SMS Gateway integration required to send messages.')} className="bg-[#d4af37] text-black hover:bg-[#b38b22]">
            <Send className="w-4 h-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </Card>
    </div>
  );
}
