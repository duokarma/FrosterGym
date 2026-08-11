import { supabase } from '../lib/supabase';
export interface BodyMeasurement {
  id: string;
  gym_id: string;
  member_id: string;
  measurement_date: string;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  body_fat_percentage: number | null;
  chest: number | null;
  waist: number | null;
  hip: number | null;
  arm: number | null;
  thigh: number | null;
  notes: string | null;
  created_at: string;
}

export const fetchBodyMeasurements = async (gymId: string): Promise<BodyMeasurement[]> => {
  const { data, error } = await supabase
    .from('body_measurements')
    .select(`
      *,
      member:members(full_name, member_id)
    `)
    .eq('gym_id', gymId)
    .order('measurement_date', { ascending: false });

  if (error) {
    console.error('Error fetching body measurements:', error);
    return [];
  }
  return data as any[];
};

export const addBodyMeasurement = async (measurement: Omit<BodyMeasurement, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase.from('body_measurements').insert(measurement as any).select().single();
  if (error) throw error;
  return data;
};
