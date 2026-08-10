import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Download, Printer } from 'lucide-react';

export function InvoiceView() {
  const { id } = useParams();

  return (
    <div className="pb-24 animate-in zoom-in-95 duration-300">
      <PageHeader title="Invoice Details" showBack />

      <div className="bg-white text-zinc-900 rounded-2xl p-6 sm:p-8 mt-6">
        <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-black text-cyan-600 uppercase tracking-tighter">Froster Gym</h1>
            <p className="text-sm text-zinc-500 mt-1">123 Fitness Street, Mumbai</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">INVOICE</h2>
            <p className="text-sm text-zinc-500">#INV-{id?.padStart(4, '0') || '0001'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase">Billed To</p>
            <p className="text-sm font-bold mt-1">Rahul Sharma</p>
            <p className="text-sm text-zinc-600">+91 9876543210</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-semibold uppercase">Date</p>
            <p className="text-sm font-bold mt-1">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border border-zinc-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr>
                <td className="px-4 py-4">1 Month Standard Plan</td>
                <td className="px-4 py-4 text-right font-medium">₹3,000</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-emerald-600">Special Discount</td>
                <td className="px-4 py-4 text-right text-emerald-600">-₹500</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-sm">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-zinc-200">
              <span>Total Paid</span>
              <span className="text-cyan-600">₹2,500</span>
            </div>
            <p className="text-xs text-zinc-500 text-right mt-1">Paid via UPI</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="secondary" className="flex-1 text-white">
          <Printer className="w-5 h-5 mr-2" />
          Print
        </Button>
        <Button className="flex-1">
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
