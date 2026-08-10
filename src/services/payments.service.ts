// @ts-nocheck
import { isDemo, db, type ServiceResult, type PaginatedResult } from './base.service';

export interface Payment {
  id: string;
  gym_id: string;
  member_id: string;
  membership_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number: string | null;
  notes: string | null;
  processed_by: string | null;
  type: 'membership' | 'renewal' | 'pt' | 'service' | 'other';
  member_name?: string;
  member_phone?: string;
  created_at: string;
}

export interface RecordPaymentInput {
  member_id: string;
  membership_id?: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number?: string;
  notes?: string;
  type: 'membership' | 'renewal' | 'pt' | 'service' | 'other';
}

const DEMO_PAYMENTS: Payment[] = [
  { id: 'pay-1', gym_id: 'demo-gym', member_id: 'mem-1', membership_id: 'ms-1', amount: 1500, payment_date: '2026-08-10', payment_method: 'upi', status: 'completed', reference_number: 'UPI12345', notes: null, processed_by: null, type: 'membership', member_name: 'Rahul Sharma', member_phone: '+919876543210', created_at: '2026-08-10T08:00:00Z' },
  { id: 'pay-2', gym_id: 'demo-gym', member_id: 'mem-2', membership_id: 'ms-2', amount: 4000, payment_date: '2026-08-09', payment_method: 'card', status: 'completed', reference_number: 'TXN889', notes: null, processed_by: null, type: 'renewal', member_name: 'Priya Patel', member_phone: '+919876543211', created_at: '2026-08-09T10:00:00Z' },
  // ... more could be added, keeping it brief for demo
];

export const fetchPayments = async (gymId: string, options?: { search?: string; dateFrom?: string; dateTo?: string; method?: string; type?: string; page?: number; pageSize?: number }): Promise<PaginatedResult<Payment>> => {
  if (isDemo()) {
    return { data: DEMO_PAYMENTS.map(p => ({ ...p, gym_id: gymId })), total: DEMO_PAYMENTS.length, page: options?.page || 1, pageSize: options?.pageSize || 10 };
  }
  let query = db.from('payments').select('*, members(full_name, phone)', { count: 'exact' }).eq('gym_id', gymId);
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  
  if (options?.dateFrom) query = query.gte('payment_date', options.dateFrom);
  if (options?.dateTo) query = query.lte('payment_date', options.dateTo);
  if (options?.method) query = query.eq('payment_method', options.method);
  if (options?.type) query = query.eq('type', options.type);
  
  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1).order('created_at', { ascending: false });
  
  if (error) {
    return { data: [], total: 0, page, pageSize };
  }
  
  const formattedData = (data as any[]).map(d => ({
    ...d,
    member_name: d.members?.full_name,
    member_phone: d.members?.phone
  }));
  
  return { data: formattedData as Payment[], total: count || 0, page, pageSize };
};

export const recordPayment = async (gymId: string, data: RecordPaymentInput): Promise<ServiceResult<Payment>> => {
  if (isDemo()) return { data: { ...DEMO_PAYMENTS[0], ...data, id: 'pay-' + Date.now(), gym_id: gymId, created_at: new Date().toISOString() }, error: null };
  const { data: result, error } = await db.from('payments').insert({ ...data, gym_id: gymId }).select().single();
  return { data: result as any as Payment, error: error?.message || null };
};

export const getPaymentById = async (gymId: string, paymentId: string): Promise<ServiceResult<Payment>> => {
  if (isDemo()) return { data: DEMO_PAYMENTS.find(p => p.id === paymentId) || null, error: null };
  const { data, error } = await db.from('payments').select('*').eq('id', paymentId).eq('gym_id', gymId).single();
  return { data: data as any as Payment, error: error?.message || null };
};

export const getTodaysCollection = async (gymId: string): Promise<number> => {
  if (isDemo()) return 12500;
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await db.from('payments').select('amount').eq('gym_id', gymId).eq('payment_date', today).eq('status', 'completed');
  if (error) return 0;
  return (data as any[]).reduce((sum, p) => sum + (p.amount || 0), 0);
};

export const getMonthlyCollection = async (gymId: string): Promise<number> => {
  if (isDemo()) return 185000;
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  const { data, error } = await db.from('payments').select('amount').eq('gym_id', gymId).gte('payment_date', firstDay).eq('status', 'completed');
  if (error) return 0;
  return (data as any[]).reduce((sum, p) => sum + (p.amount || 0), 0);
};

export const getPendingDues = async (gymId: string): Promise<number> => {
  if (isDemo()) return 24500;
  const { data, error } = await db.from('memberships').select('due_amount').eq('gym_id', gymId).gt('due_amount', 0);
  if (error) return 0;
  return (data as any[]).reduce((sum, m) => sum + (m.due_amount || 0), 0);
};


