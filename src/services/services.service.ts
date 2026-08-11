import { supabase } from '../lib/supabase';

export interface Service {
  id: string;
  gym_id: string;
  name: string;
  price: number;
  duration_text: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

export const fetchServices = async (gymId: string): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('gym_id', gymId)
    .order('name');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data as any[];
};
