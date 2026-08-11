// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, UserCheck, Phone, Calendar, Mail, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEnquiries, convertEnquiry, type Enquiry } from '../../services/enquiries.service';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export function EnquiriesList() {
  const navigate = useNavigate();
  const { gym } = useAuth();
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const loadEnquiries = useCallback(async () => {
    if (!gym) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEnquiries(gym.id);
      if (response.error) throw new Error(response.error.message || 'Failed to load enquiries');
      setEnquiries(response.data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setError(err instanceof Error ? err : new Error('Failed to load enquiries'));
    } finally {
      setLoading(false);
    }
  }, [gym]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const handleConvert = async (enquiryId: string) => {
    if (!gym) return;
    try {
      const { error } = await convertEnquiry(gym.id, enquiryId);
      if (error) throw new Error(error.message);
      // Reload to reflect conversion
      loadEnquiries();
      // Normally, you might navigate to add member page passing the enquiry data
      const enquiryToConvert = enquiries.find(e => e.id === enquiryId);
      navigate(`/members/add`, { state: { enquiry: enquiryToConvert } });
    } catch (err) {
      console.error('Error converting enquiry:', err);
      alert('Failed to convert enquiry');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return { variant: 'info' as const, label: 'New' };
      case 'hot': return { variant: 'success' as const, label: 'Hot' };
      case 'cold': return { variant: 'danger' as const, label: 'Cold' };
      case 'converted': return { variant: 'default' as const, label: 'Converted' };
      default: return { variant: 'default' as const, label: status };
    }
  };

  const filteredEnquiries = enquiries.filter(enq => 
    enq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    enq.phone.includes(searchTerm)
  );

  if (error) {
    return <ErrorState title="Failed to load enquiries" message={error.message} onRetry={loadEnquiries} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 sm:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Enquiries</h1>
            {!loading && (
              <Badge variant="default" className="bg-zinc-900 text-slate-300 border border-white/10">
                {enquiries.length} total
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage leads and conversions</p>
        </div>
        <Button onClick={() => navigate('/app/enquiries/add')} className="hidden sm:flex">
          <Plus className="w-5 h-5 mr-2" />
          Add Enquiry
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input 
            placeholder="Search leads by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5 text-slate-400" />}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 bg-zinc-900/80 backdrop-blur-xl border-white/5 animate-pulse min-h-[220px]">
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
            </Card>
          ))}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <EmptyState 
          icon={<TrendingUp className="w-12 h-12 text-slate-500" />}
          title="No enquiries found"
          description={searchTerm ? "Try adjusting your search criteria." : "You have no active leads yet."}
        />
      ) : (
        /* Grid of Enquiries */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEnquiries.map((enquiry) => {
            const badge = getStatusBadge(enquiry.status);
            return (
              <Card 
                key={enquiry.id} 
                className="p-4 bg-zinc-900/80 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all group flex flex-col min-h-[220px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={enquiry.name} size="md" />
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {enquiry.name}
                      </h3>
                      <div className="flex items-center text-xs text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(enquiry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={badge.variant} className="capitalize">
                    {badge.label}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 flex-1 mt-2">
                  <div className="flex items-center text-sm text-slate-400">
                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                    {enquiry.phone}
                  </div>
                  {enquiry.notes && (
                    <div className="text-sm text-slate-300 bg-white/5 p-2 rounded-lg mt-2">
                      <p className="line-clamp-2 italic">{enquiry.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white border-none"
                    onClick={() => window.open(`tel:${enquiry.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-1.5" />
                    Call
                  </Button>
                  {enquiry.status !== 'converted' && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] hover:from-[#E5D3B3] hover:to-[#E5D3B3] border-none shadow-lg shadow-[#D4AF37]/20"
                      onClick={() => handleConvert(enquiry.id)}
                    >
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      Convert
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-4 sm:hidden z-40">
        <Button 
          className="w-14 h-14 rounded-full shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center p-0 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] hover:from-[#E5D3B3] hover:to-[#E5D3B3]"
          onClick={() => navigate('/app/enquiries/add')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}


