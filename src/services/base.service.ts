import { supabase, supabaseConfigured } from '../lib/supabase';

export const isDemo = () => !supabaseConfigured;
export const db = supabase;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}
