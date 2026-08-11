import { supabase } from '../lib/supabase';

export interface Batch {
  id: string;
  gym_id: string;
  name: string;
  time_slot: string;
  trainer_id: string | null;
  description: string | null;
  max_capacity: number;
  status: string;
  created_at: string;
}

export const fetchBatches = async (gymId: string): Promise<Batch[]> => {
  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      trainer:trainers(name)
    `)
    .eq('gym_id', gymId)
    .order('time_slot');

  if (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
  return data as any[];
};
