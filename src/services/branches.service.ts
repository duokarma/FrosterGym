import { supabase } from '../lib/supabase';

export interface Branch {
  id: string;
  gym_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  manager_id: string | null;
  status: string;
  created_at: string;
}

export const fetchBranches = async (gymId: string): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select(`
      *,
      manager:profiles(full_name)
    `)
    .eq('gym_id', gymId)
    .order('name');

  if (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
  return data as any[];
};
