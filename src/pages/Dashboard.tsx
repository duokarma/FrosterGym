// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, IndianRupee, UserCheck, Clock, CreditCard, Cake,
  AlertCircle, Activity, UserPlus, CalendarCheck, Receipt,
  Search, TrendingUp, TrendingDown, ShieldAlert, Snowflake,
  Ban, Phone, MessageCircle, ChevronRight, Plus, Zap,
} from 'lucide-react';
import { StatCard, Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchDashboardStats,
  fetchExpiryAlerts,
  fetchBirthdaysToday,
  fetchRecentActivity,
  fetchPaymentsDue,
  type DashboardStats,
  type ExpiryAlert,
  type BirthdayMember,
  type ActivityItem,
  type PaymentDueMember,
} from '../services/dashboard.service';

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, gym } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayMember[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [paymentsDue, setPaymentsDue] = useState<PaymentDueMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gym) return;
    const load = async () => {
      setLoading(true);
      const [s, e, b, a, p] = await Promise.all([
        fetchDashboardStats(gym.id),
        fetchExpiryAlerts(gym.id),
        fetchBirthdaysToday(gym.id),
        fetchRecentActivity(gym.id),
        fetchPaymentsDue(gym.id),
      ]);
      setStats(s);
      setExpiryAlerts(e);
      setBirthdays(b);
      setActivity(a);
      setPaymentsDue(p);
      setLoading(false);
    };
    load();
  }, [gym]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading || !stats) {
    return (
      <div className="pb-6 space-y-4 animate-pulse">
        <div className="h-12 bg-white/5 rounded-2xl w-2/3" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Add Member', icon: <UserPlus className="w-5 h-5" />, path: '/app/members/add', color: 'text-[#E5D3B3] bg-[#D4AF37]/10' },
    { label: 'Payment', icon: <IndianRupee className="w-5 h-5" />, path: '/app/payments', color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" />, path: '/app/attendance', color: 'text-[#E5D3B3] bg-[#D4AF37]/10' },
    { label: 'Expense', icon: <Receipt className="w-5 h-5" />, path: '/app/expenses/add', color: 'text-red-400 bg-red-500/10' },
    { label: 'Enquiry', icon: <Search className="w-5 h-5" />, path: '/app/enquiries/add', color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Renew', icon: <Zap className="w-5 h-5" />, path: '/app/members', color: 'text-purple-400 bg-purple-500/10' },
  ];

  const statCards = [
    { label: "Today's Members", value: stats.todaysAttendance, icon: <Users className="w-5 h-5" />, bg: 'bg-[#D4AF37]/10 text-[#E5D3B3]' },
    { label: "Today's Collection", value: `₹${stats.todaysCollection.toLocaleString('en-IN')}`, icon: <IndianRupee className="w-5 h-5" />, bg: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'Active Members', value: stats.activeMembers, icon: <UserCheck className="w-5 h-5" />, bg: 'bg-[#D4AF37]/10 text-[#E5D3B3]' },
    { label: 'Expiring Soon', value: stats.expiringSoon, icon: <Clock className="w-5 h-5" />, bg: 'bg-amber-500/10 text-amber-400' },
    { label: 'Pending Dues', value: `₹${stats.pendingDues.toLocaleString('en-IN')}`, icon: <CreditCard className="w-5 h-5" />, bg: 'bg-red-500/10 text-red-400' },
    { label: 'Birthdays Today', value: stats.birthdaysToday, icon: <Cake className="w-5 h-5" />, bg: 'bg-purple-500/10 text-purple-400' },
  ];

  const alertBuckets = {
    '1-3': expiryAlerts.filter(a => a.bucket === '1-3'),
    '4-7': expiryAlerts.filter(a => a.bucket === '4-7'),
    '8-15': expiryAlerts.filter(a => a.bucket === '8-15'),
  };

  return (
    <div className="pb-6 animate-in fade-in duration-300">
      {/* ─── Greeting ─── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {greeting()}, {profile?.full_name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {gym?.name || 'Your Gym'} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1.5 min-w-[72px] group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Revenue At Risk ─── */}
      {stats.revenueAtRisk > 0 && (
        <Card className="mb-4 !p-4 cursor-pointer hover:border-amber-500/30 transition-colors" onClick={() => navigate('/app/members?filter=expiring_7')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-400">Revenue At Risk</p>
                <p className="text-xs text-slate-500">{stats.expiringSoon} members expiring soon</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">₹{stats.revenueAtRisk.toLocaleString('en-IN')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </Card>
      )}

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map(stat => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} iconBg={stat.bg} />
        ))}
      </div>

      {/* ─── More Stats Row ─── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="!p-3 text-center">
          <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Total</p>
        </Card>
        <Card className="!p-3 text-center">
          <p className="text-2xl font-bold text-white">₹{(stats.monthlyCollection / 1000).toFixed(0)}K</p>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Monthly Rev</p>
        </Card>
        <Card className="!p-3 text-center">
          <p className="text-2xl font-bold text-white">₹{(stats.monthlyExpenses / 1000).toFixed(0)}K</p>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Expenses</p>
        </Card>
      </div>

      {/* ─── Expiry Alerts ─── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Expiry Alerts</h2>
          </div>
          <button onClick={() => navigate('/app/members?filter=expiring_7')} className="text-xs text-[#E5D3B3] hover:underline">View all</button>
        </div>

        {expiryAlerts.length === 0 ? (
          <Card>
            <EmptyState icon={<Clock className="w-6 h-6" />} title="No expiring memberships" description="All memberships are healthy!" />
          </Card>
        ) : (
          <div className="space-y-2">
            {[{ key: '1-3' as const, label: '1-3 days', color: 'danger' as const },
              { key: '4-7' as const, label: '4-7 days', color: 'warning' as const },
              { key: '8-15' as const, label: '8-15 days', color: 'info' as const },
            ].map(bucket => {
              const items = alertBuckets[bucket.key];
              if (items.length === 0) return null;
              return (
                <Card key={bucket.key} className="!p-3 cursor-pointer" onClick={() => navigate(`/members?filter=expiring_${bucket.key === '1-3' ? '3' : bucket.key === '4-7' ? '7' : '15'}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={bucket.color}>{bucket.label}</Badge>
                      <div className="flex -space-x-2">
                        {items.slice(0, 3).map(a => (
                          <Avatar key={a.member.id} name={a.member.full_name} size="sm" className="border-2 border-[#131b2f]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{items.length}</span>
                      <span className="text-xs text-slate-500">members</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Birthdays ─── */}
      {birthdays.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Cake className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-semibold text-white">Birthdays Today 🎂</h2>
          </div>
          <div className="space-y-2">
            {birthdays.map(b => (
              <Card key={b.id} className="!p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={b.full_name} src={b.photo_url || undefined} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-white">{b.full_name}</p>
                      <p className="text-xs text-slate-500">Turns {b.age} today</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.open(`tel:${b.phone}`)} className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 text-[#E5D3B3] flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      const msg = encodeURIComponent(`Happy Birthday ${b.full_name}! 🎂🎉 Wishing you a wonderful year ahead! - From ${gym?.name || 'Froster Gym'}`);
                      window.open(`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                    }} className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── Payment Due ─── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-semibold text-white">Payment Due</h2>
          </div>
          <button onClick={() => navigate('/app/members?filter=due')} className="text-xs text-[#E5D3B3] hover:underline">View all</button>
        </div>
        {paymentsDue.length === 0 ? (
          <Card>
            <EmptyState icon={<CreditCard className="w-6 h-6" />} title="No pending payments" description="All payments are up to date!" />
          </Card>
        ) : (
          <div className="space-y-2">
            {paymentsDue.slice(0, 5).map(m => (
              <Card key={m.id} className="!p-3 cursor-pointer" onClick={() => navigate(`/members/${m.id}`)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.full_name} src={m.photo_url || undefined} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{m.full_name}</p>
                      <p className="text-xs text-slate-500">{m.member_id} • {m.plan_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">₹{m.due_amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-500">due</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-[#E5D3B3]" />
          <h2 className="text-base font-semibold text-white">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <Card>
            <EmptyState icon={<Activity className="w-6 h-6" />} title="No recent activity" description="Your gym activity will show up here" />
          </Card>
        ) : (
          <Card className="!p-0 divide-y divide-white/5">
            {activity.map(item => (
              <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 ${item.icon_color} shrink-0`}>
                  {item.type === 'payment_received' && <IndianRupee className="w-4 h-4" />}
                  {item.type === 'member_added' && <UserPlus className="w-4 h-4" />}
                  {item.type === 'membership_renewed' && <Zap className="w-4 h-4" />}
                  {item.type === 'attendance' && <CalendarCheck className="w-4 h-4" />}
                  {item.type === 'expense_added' && <Receipt className="w-4 h-4" />}
                  {item.type === 'enquiry_added' && <Search className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.description}</p>
                  <p className="text-[10px] text-slate-500">{item.time_ago}</p>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* ─── Mobile FAB ─── */}
      <div className="fixed bottom-24 right-4 sm:hidden z-40">
        <Button
          className="w-14 h-14 rounded-full shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center !p-0"
          onClick={() => navigate('/app/members/add')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

