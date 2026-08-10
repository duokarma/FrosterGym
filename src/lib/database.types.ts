export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      gyms: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          logo_url: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          logo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          owner_id?: string;
          logo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          gym_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'owner' | 'staff';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gym_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gym_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_permissions: {
        Row: {
          id: string;
          gym_id: string;
          user_id: string;
          module_name: string;
          can_view: boolean;
          can_create: boolean;
          can_edit: boolean;
          can_delete: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          user_id: string;
          module_name: string;
          can_view?: boolean;
          can_create?: boolean;
          can_edit?: boolean;
          can_delete?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          user_id?: string;
          module_name?: string;
          can_view?: boolean;
          can_create?: boolean;
          can_edit?: boolean;
          can_delete?: boolean;
          created_at?: string;
        };
      };
      gym_settings: {
        Row: {
          id: string;
          gym_id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          key: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      membership_plans: {
        Row: {
          id: string;
          gym_id: string;
          name: string;
          duration_months: number;
          duration_days: number;
          price: number;
          description: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          name: string;
          duration_months?: number;
          duration_days?: number;
          price?: number;
          description?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          name?: string;
          duration_months?: number;
          duration_days?: number;
          price?: number;
          description?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          gym_id: string;
          member_id: string;
          full_name: string;
          phone: string;
          email: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          address: string | null;
          emergency_contact: string | null;
          photo_url: string | null;
          notes: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          member_id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          address?: string | null;
          emergency_contact?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          member_id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          address?: string | null;
          emergency_contact?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          gym_id: string;
          member_id: string;
          plan_id: string | null;
          start_date: string;
          end_date: string;
          status: 'active' | 'expired' | 'cancelled';
          original_amount: number;
          discount_amount: number;
          discount_type: 'fixed' | 'percentage';
          final_amount: number;
          paid_amount: number;
          due_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          member_id: string;
          plan_id?: string | null;
          start_date: string;
          end_date: string;
          status?: 'active' | 'expired' | 'cancelled';
          original_amount?: number;
          discount_amount?: number;
          discount_type?: 'fixed' | 'percentage';
          final_amount?: number;
          paid_amount?: number;
          due_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          member_id?: string;
          plan_id?: string | null;
          start_date?: string;
          end_date?: string;
          status?: 'active' | 'expired' | 'cancelled';
          original_amount?: number;
          discount_amount?: number;
          discount_type?: 'fixed' | 'percentage';
          final_amount?: number;
          paid_amount?: number;
          due_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          gym_id: string;
          member_id: string;
          membership_id: string | null;
          amount: number;
          payment_date: string;
          payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          reference_number: string | null;
          notes: string | null;
          processed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          member_id: string;
          membership_id?: string | null;
          amount: number;
          payment_date?: string;
          payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          reference_number?: string | null;
          notes?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          member_id?: string;
          membership_id?: string | null;
          amount?: number;
          payment_date?: string;
          payment_method?: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          reference_number?: string | null;
          notes?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          gym_id: string;
          member_id: string;
          check_in_time: string;
          check_out_time: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          member_id: string;
          check_in_time?: string;
          check_out_time?: string | null;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          member_id?: string;
          check_in_time?: string;
          check_out_time?: string | null;
          date?: string;
          created_at?: string;
        };
      };
      diet_plans: {
        Row: {
          id: string;
          gym_id: string;
          name: string;
          description: string | null;
          breakfast: string | null;
          mid_morning: string | null;
          lunch: string | null;
          evening: string | null;
          dinner: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          name: string;
          description?: string | null;
          breakfast?: string | null;
          mid_morning?: string | null;
          lunch?: string | null;
          evening?: string | null;
          dinner?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          name?: string;
          description?: string | null;
          breakfast?: string | null;
          mid_morning?: string | null;
          lunch?: string | null;
          evening?: string | null;
          dinner?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      member_diet_plans: {
        Row: {
          id: string;
          gym_id: string;
          member_id: string;
          diet_plan_id: string;
          start_date: string;
          end_date: string | null;
          assigned_by: string | null;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          member_id: string;
          diet_plan_id: string;
          start_date?: string;
          end_date?: string | null;
          assigned_by?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          member_id?: string;
          diet_plan_id?: string;
          start_date?: string;
          end_date?: string | null;
          assigned_by?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          gym_id: string;
          title: string;
          category: 'rent' | 'electricity' | 'equipment' | 'maintenance' | 'salary' | 'marketing' | 'supplies' | 'other';
          amount: number;
          expense_date: string;
          payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          notes: string | null;
          recorded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          title: string;
          category: 'rent' | 'electricity' | 'equipment' | 'maintenance' | 'salary' | 'marketing' | 'supplies' | 'other';
          amount: number;
          expense_date?: string;
          payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          notes?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          title?: string;
          category?: 'rent' | 'electricity' | 'equipment' | 'maintenance' | 'salary' | 'marketing' | 'supplies' | 'other';
          amount?: number;
          expense_date?: string;
          payment_method?: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'other';
          notes?: string | null;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          gym_id: string;
          invoice_number: string;
          member_id: string;
          membership_id: string | null;
          payment_id: string | null;
          issue_date: string;
          due_date: string | null;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          status: 'draft' | 'unpaid' | 'paid' | 'cancelled' | 'refunded';
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          invoice_number: string;
          member_id: string;
          membership_id?: string | null;
          payment_id?: string | null;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          status?: 'draft' | 'unpaid' | 'paid' | 'cancelled' | 'refunded';
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          invoice_number?: string;
          member_id?: string;
          membership_id?: string | null;
          payment_id?: string | null;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          status?: 'draft' | 'unpaid' | 'paid' | 'cancelled' | 'refunded';
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Gym = Tables<'gyms'>;
export type StaffPermission = Tables<'staff_permissions'>;
export type GymSetting = Tables<'gym_settings'>;
export type MembershipPlan = Tables<'membership_plans'>;
export type Member = Tables<'members'>;
export type Membership = Tables<'memberships'>;
export type Payment = Tables<'payments'>;
export type Attendance = Tables<'attendance'>;
export type DietPlan = Tables<'diet_plans'>;
export type MemberDietPlan = Tables<'member_diet_plans'>;
export type Expense = Tables<'expenses'>;
export type Invoice = Tables<'invoices'>;
