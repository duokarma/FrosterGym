import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';

import { 
  fetchMembers, 
  type MemberWithMembership, 
  type MemberFilter, 
  type MemberSort 
} from '../../services/members.service';

const FILTERS: { label: string; value: MemberFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Expiring', value: 'expiring_7' },
  { label: 'Due', value: 'due' },
  { label: 'Birthday', value: 'birthday_today' },
];

const SORTS: { label: string; value: MemberSort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Expiry Soonest', value: 'expiry_soonest' },
  { label: 'Due Highest', value: 'due_highest' },
  { label: 'Due Lowest', value: 'due_lowest' },
];

export function MembersList() {
  const navigate = useNavigate();
  const { gym } = useAuth();
  
  const [members, setMembers] = useState<MemberWithMembership[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<MemberFilter>('all');
  const [sort, setSort] = useState<MemberSort>('newest');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMembers = useCallback(async () => {
    if (!gym) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMembers(gym.id, {
        search: debouncedSearch,
        filter,
        sort,
        page: 1,
        pageSize: 50
      });
      setMembers(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError(err instanceof Error ? err : new Error('Failed to load members'));
    } finally {
      setLoading(false);
    }
  }, [gym, debouncedSearch, filter, sort]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Format expiry status
  const getExpiryStatus = (member: MemberWithMembership) => {
    if (!member.current_membership) return { text: 'No Plan', color: 'gray' };
    
    const endDate = new Date(member.current_membership.end_date);
    const today = new Date();
    // Reset time parts for accurate day diff
    endDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (member.current_membership.status === 'expired' || diffDays < 0) {
      return { text: `Expired ${Math.abs(diffDays)}d ago`, color: 'red' };
    }
    
    if (diffDays <= 7) {
      return { text: `Expires in ${diffDays}d`, color: 'amber' };
    }
    
    return { text: 'Active', color: 'green' };
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'expired': return 'danger';
      case 'blocked': return 'danger';
      case 'frozen': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return <ErrorState title="Failed to load members" message={error.message} onRetry={loadMembers} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 sm:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Members</h1>
            {!loading && (
              <Badge variant="default" className="bg-[#131b2f] text-slate-300 border border-white/10">
                {total} total
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage your gym members</p>
        </div>
        <Button onClick={() => navigate('/members/add')} className="hidden sm:flex">
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input 
              placeholder="Search by name, phone, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div className="sm:w-48 shrink-0">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value as MemberSort)}
              className="w-full h-11 px-3 py-2 bg-[#131b2f]/80 backdrop-blur-xl border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
            >
              {SORTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                filter === f.value 
                  ? f.value === 'active' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg shadow-cyan-500/20'
                    : 'bg-white/10 text-white border-white/20'
                  : 'bg-transparent text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4 bg-[#131b2f]/80 backdrop-blur-xl border-white/5 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                <div className="h-11 bg-white/5 rounded flex-1" />
                <div className="h-11 bg-white/5 rounded flex-1" />
              </div>
            </Card>
          ))}
        </div>
      ) : members.length === 0 ? (
        /* Empty State */
        <EmptyState 
          icon={<Search className="w-12 h-12 text-slate-500" />}
          title="No members found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        /* Member Cards */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => {
            const expiry = getExpiryStatus(member);
            return (
              <Card 
                key={member.id} 
                className="p-4 bg-[#131b2f]/80 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all cursor-pointer group flex flex-col min-h-[220px]"
                onClick={() => navigate(`/members/${member.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.full_name} src={member.photo_url || undefined} size="md" />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {member.full_name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{member.member_id}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(member.status)} className="capitalize">
                    {member.status === 'active' && member.current_membership?.status === 'expired' 
                      ? 'Expired' : member.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 flex-1 mt-2">
                  <div className="flex items-center text-sm text-slate-400">
                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                    {member.phone}
                  </div>
                  
                  {member.current_membership ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        expiry.color === 'red' ? 'text-red-400' : 
                        expiry.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {expiry.text}
                      </span>
                      {member.current_membership.due_amount > 0 && (
                        <span className="text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded text-xs">
                          {formatCurrency(member.current_membership.due_amount)} Due
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic">No active membership</div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 min-h-[44px] bg-white/5 hover:bg-white/10 text-white border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${member.phone}`);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-1.5" />
                    Call
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 min-h-[44px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      // @ts-ignore
                      const gymName = gym?.name || 'our gym';
                      const msg = encodeURIComponent(`Hi ${member.full_name}, this is from ${gymName}`);
                      window.open(`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    WhatsApp
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-4 sm:hidden z-40">
        <Button 
          className="w-14 h-14 rounded-full shadow-xl shadow-cyan-500/30 flex items-center justify-center p-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          onClick={() => navigate('/members/add')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
