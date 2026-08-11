import { supabase } from '../lib/supabase';

export interface Trainer {
  id: string;
  gym_id: string;
  name: string;
  phone: string;
  specialization: string;
  status: string;
  created_at: string;
}

export interface PTPlan {
  id: string;
  gym_id: string;
  name: string;
  price: number;
  duration_months: number;
}

export interface PTMembership {
  id: string;
  gym_id: string;
  member_id: string;
  trainer_id: string;
  pt_plan_id: string;
  start_date: string;
  end_date: string;
  final_amount: number;
  status: string;
}

export const fetchTrainers = async (gymId: string): Promise<Trainer[]> => {
  const { data, error } = await supabase.from('trainers').select('*').eq('gym_id', gymId);
  if (error) {
    console.error('Error fetching trainers:', error);
    return [];
  }
  return data as any[];
};

export const fetchPTMemberships = async (gymId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('pt_memberships')
    .select(`
      *,
      member:members(full_name, member_id),
      trainer:trainers(name)
    `)
    .eq('gym_id', gymId);
  
  if (error) {
    console.error('Error fetching PT memberships:', error);
    return [];
  }
  return data as any[];
};
