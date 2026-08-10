// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { 
  getDeletedMembers, 
  restoreMember, 
  permanentDeleteMember, 
  type MemberWithMembership 
} from '../../services/members.service';

export function TrashMembers() {
  const { gym } = useAuth();
  const [members, setMembers] = useState<MemberWithMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!gym) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getDeletedMembers(gym.id);
      setMembers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch deleted members.');
    } finally {
      setLoading(false);
    }
  }, [gym]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRestore = async (memberId: string) => {
    if (!gym) return;
    try {
      const { error } = await restoreMember(gym.id, memberId);
      if (error) {
        alert('Failed to restore member: ' + error);
        return;
      }
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert('Failed to restore member: ' + err.message);
    }
  };

  const handlePermanentDelete = async (memberId: string) => {
    if (!gym) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this member? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const { error } = await permanentDeleteMember(gym.id, memberId);
      if (error) {
        alert('Failed to delete member: ' + error);
        return;
      }
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert('Failed to delete member: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 sm:pb-0">
      <PageHeader
        title="Trash"
        subtitle="Manage deleted members"
        showBack={true}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 bg-[#131b2f]/80 backdrop-blur-xl border-white/5 animate-pulse h-[160px]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="w-12 h-12 text-slate-500" />}
          title="Trash is empty"
          description="No deleted members found."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map(member => (
            <Card key={member.id} className="p-4 bg-[#131b2f]/80 backdrop-blur-xl border-white/5 flex flex-col min-h-[160px]">
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{member.full_name}</h3>
                <p className="text-sm text-slate-400 mb-2">{member.phone}</p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Deleted: {member.deleted_at ? new Date(member.deleted_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border-none"
                  onClick={() => handleRestore(member.id)}
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Restore
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none"
                  onClick={() => handlePermanentDelete(member.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

