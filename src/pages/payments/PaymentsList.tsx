import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, Download } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const MOCK_PAYMENTS = [
  { id: '1', member: 'Rahul Sharma', amount: 3000, method: 'UPI', status: 'completed', date: '2023-10-01' },
  { id: '2', member: 'Priya Patel', amount: 1500, method: 'Cash', status: 'completed', date: '2023-10-02' },
  { id: '3', member: 'Amit Kumar', amount: 8000, method: 'Card', status: 'completed', date: '2023-10-03' },
];

export function PaymentsList() {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-zinc-400 text-sm">View and manage all transactions</p>
        </div>
      </div>

      <div className="mb-6">
        <Input placeholder="Search payments..." icon={<Search className="w-5 h-5" />} />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {payments.map(payment => (
            <div key={payment.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{payment.member}</h3>
                  <p className="text-xs text-zinc-500">{new Date(payment.date).toLocaleDateString()} • {payment.method}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">+₹{payment.amount}</p>
                  <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider">{payment.status}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/payments/invoice/${payment.id}`)}>
                  <Download className="w-4 h-4 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
