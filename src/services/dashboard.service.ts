// @ts-nocheck
import { isDemo, db } from './base.service';
import type { MemberWithMembership } from './members.service';
import { fetchMembers } from './members.service';

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  expiredMembers: number;
  blockedMembers: number;
  frozenMembers: number;
  todaysAttendance: number;
  todaysCollection: number;
  monthlyCollection: number;
  monthlyExpenses: number;
  pendingDues: number;
  revenueAtRisk: number;
  birthdaysToday: number;
  expiringSoon: number;
  activePT: number;
  ptDue: number;
}

export interface ExpiryAlert {
  member: MemberWithMembership;
  daysUntilExpiry: number;
  bucket: '1-3' | '4-7' | '8-15';
}

export interface BirthdayMember {
  id: string;
  full_name: string;
  phone: string;
  photo_url: string | null;
  date_of_birth: string;
  age: number;
}

export interface ActivityItem {
  id: string;
  type: 'member_added' | 'payment_received' | 'membership_renewed' | 'attendance' | 'expense_added' | 'enquiry_added';
  title: string;
  description: string;
  icon_color: string;
  time_ago: string;
  created_at: string;
}

export interface PaymentDueMember {
  id: string;
  full_name: string;
  phone: string;
  photo_url: string | null;
  member_id: string;
  due_amount: number;
  plan_name: string;
  expiry_date: string;
}

// ─── Dashboard Stats ──────────────────────────
export async function fetchDashboardStats(gymId: string): Promise<DashboardStats> {
  if (isDemo()) {
    return {
      totalMembers: 20,
      activeMembers: 12,
      inactiveMembers: 2,
      expiredMembers: 3,
      blockedMembers: 1,
      frozenMembers: 1,
      todaysAttendance: 8,
      todaysCollection: 12500,
      monthlyCollection: 185000,
      monthlyExpenses: 62000,
      pendingDues: 24500,
      revenueAtRisk: 18400,
      birthdaysToday: 2,
      expiringSoon: 4,
      activePT: 5,
      ptDue: 3500,
    };
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Members by status
    const membersRes: any = await db.from('members').select('status', { count: 'exact' }).eq('gym_id', gymId).is('deleted_at', null);
    const allMembers = membersRes.data || [];
    const totalMembers = allMembers.length;
    const activeMembers = allMembers.filter((m: any) => m.status === 'active').length;
    const inactiveMembers = allMembers.filter((m: any) => m.status === 'inactive').length;
    const expiredMembers = allMembers.filter((m: any) => m.status === 'expired').length;
    const blockedMembers = allMembers.filter((m: any) => m.status === 'blocked').length;
    const frozenMembers = allMembers.filter((m: any) => m.status === 'frozen').length;

    // Today's attendance
    const attendRes: any = await db.from('attendance').select('id', { count: 'exact' }).eq('gym_id', gymId).eq('date', today);
    const todaysAttendance = attendRes.data?.length || 0;

    // Today's collection
    const todayPayRes: any = await db.from('payments').select('amount').eq('gym_id', gymId).eq('status', 'completed').gte('payment_date', today + 'T00:00:00').lte('payment_date', today + 'T23:59:59');
    const todaysCollection = (todayPayRes.data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    // Monthly collection
    const monthPayRes: any = await db.from('payments').select('amount').eq('gym_id', gymId).eq('status', 'completed').gte('payment_date', monthStart);
    const monthlyCollection = (monthPayRes.data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    // Monthly expenses
    const expenseRes: any = await db.from('expenses').select('amount').eq('gym_id', gymId).gte('expense_date', monthStart);
    const monthlyExpenses = (expenseRes.data || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    // Pending dues
    const dueRes: any = await db.from('memberships').select('due_amount').eq('gym_id', gymId).gt('due_amount', 0);
    const pendingDues = (dueRes.data || []).reduce((sum: number, m: any) => sum + Number(m.due_amount), 0);

    // Expiring soon (next 15 days)
    const in15Days = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
    const expiringRes: any = await db.from('memberships').select('final_amount').eq('gym_id', gymId).eq('status', 'active').gte('end_date', today).lte('end_date', in15Days);
    const expiringSoon = expiringRes.data?.length || 0;
    const revenueAtRisk = (expiringRes.data || []).reduce((sum: number, m: any) => sum + Number(m.final_amount), 0);

    return {
      totalMembers, activeMembers, inactiveMembers, expiredMembers, blockedMembers, frozenMembers,
      todaysAttendance, todaysCollection, monthlyCollection, monthlyExpenses,
      pendingDues, revenueAtRisk, birthdaysToday: 0, expiringSoon, activePT: 0, ptDue: 0,
    };
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return {
      totalMembers: 0, activeMembers: 0, inactiveMembers: 0, expiredMembers: 0, blockedMembers: 0, frozenMembers: 0,
      todaysAttendance: 0, todaysCollection: 0, monthlyCollection: 0, monthlyExpenses: 0,
      pendingDues: 0, revenueAtRisk: 0, birthdaysToday: 0, expiringSoon: 0, activePT: 0, ptDue: 0,
    };
  }
}

// ─── Expiry Alerts ──────────────────────────
export async function fetchExpiryAlerts(gymId: string): Promise<ExpiryAlert[]> {
  const result = await fetchMembers(gymId, { filter: 'all', pageSize: 100 });
  const now = new Date();
  const alerts: ExpiryAlert[] = [];

  for (const member of result.data) {
    if (!member.current_membership || member.status !== 'active') continue;
    const end = new Date(member.current_membership.end_date);
    const days = Math.ceil((end.getTime() - now.getTime()) / 86400000);

    if (days >= 1 && days <= 3) alerts.push({ member, daysUntilExpiry: days, bucket: '1-3' });
    else if (days >= 4 && days <= 7) alerts.push({ member, daysUntilExpiry: days, bucket: '4-7' });
    else if (days >= 8 && days <= 15) alerts.push({ member, daysUntilExpiry: days, bucket: '8-15' });
  }

  return alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

// ─── Birthdays ──────────────────────────
export async function fetchBirthdaysToday(gymId: string): Promise<BirthdayMember[]> {
  if (isDemo()) {
    const today = new Date();
    return [
      {
        id: 'b1', full_name: 'Sneha Reddy', phone: '+91 9876543213', photo_url: null,
        date_of_birth: `1995-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`, age: today.getFullYear() - 1995,
      },
      {
        id: 'b2', full_name: 'Anjali Desai', phone: '+91 9876543219', photo_url: null,
        date_of_birth: `1990-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`, age: today.getFullYear() - 1990,
      },
    ];
  }

  try {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // PostgreSQL: extract month/day from date_of_birth
    const res: any = await db.rpc('get_birthdays_today', { p_gym_id: gymId, p_month: parseInt(mm), p_day: parseInt(dd) });
    return (res.data || []).map((m: any) => ({
      ...m,
      age: today.getFullYear() - new Date(m.date_of_birth).getFullYear(),
    }));
  } catch {
    return [];
  }
}

// ─── Recent Activity ──────────────────────────
export async function fetchRecentActivity(gymId: string, limit = 10): Promise<ActivityItem[]> {
  if (isDemo()) {
    const now = new Date();
    return [
      { id: '1', type: 'payment_received', title: 'Payment Received', description: 'Rahul Sharma paid ₹3,000 for Monthly plan', icon_color: 'text-emerald-400', time_ago: '10 min ago', created_at: new Date(now.getTime() - 600000).toISOString() },
      { id: '2', type: 'member_added', title: 'New Member', description: 'Karan Malhotra joined the gym', icon_color: 'text-[#E5D3B3]', time_ago: '25 min ago', created_at: new Date(now.getTime() - 1500000).toISOString() },
      { id: '3', type: 'membership_renewed', title: 'Membership Renewed', description: 'Priya Patel renewed for 3 months', icon_color: 'text-[#E5D3B3]', time_ago: '1 hr ago', created_at: new Date(now.getTime() - 3600000).toISOString() },
      { id: '4', type: 'attendance', title: 'Attendance', description: '8 members checked in today', icon_color: 'text-purple-400', time_ago: '2 hrs ago', created_at: new Date(now.getTime() - 7200000).toISOString() },
      { id: '5', type: 'expense_added', title: 'Expense Logged', description: 'Electricity bill ₹8,000', icon_color: 'text-red-400', time_ago: '3 hrs ago', created_at: new Date(now.getTime() - 10800000).toISOString() },
      { id: '6', type: 'enquiry_added', title: 'New Enquiry', description: 'Walk-in enquiry from Rohit Mehra', icon_color: 'text-amber-400', time_ago: '5 hrs ago', created_at: new Date(now.getTime() - 18000000).toISOString() },
    ];
  }

  try {
    const res: any = await db.from('activity_logs').select('*').eq('gym_id', gymId).order('created_at', { ascending: false }).limit(limit);
    return (res.data || []).map((log: any) => ({
      id: log.id,
      type: log.action,
      title: log.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description: log.details?.description || log.action,
      icon_color: 'text-[#E5D3B3]',
      time_ago: getTimeAgo(new Date(log.created_at)),
      created_at: log.created_at,
    }));
  } catch {
    return [];
  }
}

// ─── Payments Due ──────────────────────────
export async function fetchPaymentsDue(gymId: string): Promise<PaymentDueMember[]> {
  if (isDemo()) {
    return [
      { id: 'd1', full_name: 'Priya Patel', phone: '+91 9876543211', photo_url: null, member_id: 'FG-1002', due_amount: 1500, plan_name: '3 Months', expiry_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0] },
      { id: 'd2', full_name: 'Manish Tiwari', phone: '+91 9876543222', photo_url: null, member_id: 'FG-1013', due_amount: 4000, plan_name: '6 Months', expiry_date: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0] },
      { id: 'd3', full_name: 'Karan Malhotra', phone: '+91 9876543224', photo_url: null, member_id: 'FG-1015', due_amount: 7000, plan_name: '12 Months', expiry_date: new Date(Date.now() + 300 * 86400000).toISOString().split('T')[0] },
    ];
  }
  
  try {
    const res: any = await db.from('memberships').select(`
      id, due_amount, end_date, plan_id,
      member:members!inner(id, full_name, phone, photo_url, member_id),
      plan:membership_plans(name)
    `).eq('gym_id', gymId).eq('status', 'active').gt('due_amount', 0);
    
    return (res.data || []).map((m: any) => ({
      id: m.member.id,
      full_name: m.member.full_name,
      phone: m.member.phone,
      photo_url: m.member.photo_url,
      member_id: m.member.member_id,
      due_amount: m.due_amount,
      plan_name: m.plan?.name || 'Custom Plan',
      expiry_date: m.end_date
    }));
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

