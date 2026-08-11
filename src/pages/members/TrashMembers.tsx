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
            <Card key={i} className="p-4 bg-[#11110F] backdrop-blur-xl border-[rgba(255,255,255,0.04)] animate-pulse h-[160px]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-[#8B4B4B]/20 border border-[#8B4B4B]/30 rounded-xl text-[#8B4B4B]">
          {error}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="w-12 h-12 text-[#706D66]" />}
          title="Trash is empty"
          description="No deleted members found."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map(member => (
            <Card key={member.id} className="p-4 bg-[#11110F] backdrop-blur-xl border-[rgba(255,255,255,0.04)] flex flex-col min-h-[160px]">
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#F4F1E8] mb-1 line-clamp-1">{member.full_name}</h3>
                <p className="text-sm text-[#A7A39A] mb-2">{member.phone}</p>
                <div className="text-xs text-[#706D66] flex items-center gap-1.5 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Deleted: {member.deleted_at ? new Date(member.deleted_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-[rgba(255,255,255,0.02)] hover:bg-[#1D1B17] text-[#F4F1E8] border-none"
                  onClick={() => handleRestore(member.id)}
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Restore
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-[#8B4B4B]/20 hover:bg-[#8B4B4B]/20 text-[#8B4B4B] border-none"
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

