// @ts-nocheck
import { db, isDemo } from './base.service';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  status: 'new' | 'hot' | 'cold' | 'converted';
  date: string;
  notes?: string;
  source?: string;
}

export const fetchEnquiries = async (gymId: string) => {
  if (isDemo()) {
    return {
      data: [],
      error: null,
    };
  }
  const { data, error } = await db
    .from('enquiries')
    .select('*')
    .eq('gym_id', gymId)
    .order('date', { ascending: false });
  return { data, error };
};

export const addEnquiry = async (gymId: string, enquiryData: Omit<Enquiry, 'id' | 'status'>) => {
  if (isDemo()) {
    return { data: { id: 'enq5', status: 'new', ...enquiryData }, error: null };
  }
  const { data, error } = await db
    .from('enquiries')
    .insert([{ gym_id: gymId, status: 'new', ...enquiryData }])
    .select()
    .single();
  return { data, error };
};

export const convertEnquiry = async (gymId: string, enquiryId: string) => {
  if (isDemo()) {
    return { data: { success: true }, error: null };
  }
  const { data, error } = await db
    .from('enquiries')
    .update({ status: 'converted' })
    .eq('gym_id', gymId)
    .eq('id', enquiryId)
    .select()
    .single();
  return { data, error };
};

export const enquiriesService = {
  fetchEnquiries,
  addEnquiry,
  convertEnquiry
};

