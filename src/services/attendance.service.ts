// @ts-nocheck
import { db, isDemo } from './base.service';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  timeIn: string;
  timeOut?: string;
}

export const attendanceService = {
  async markAttendance(gymId: string, memberId: string, date: string, memberName: string = 'Unknown') {
    if (isDemo()) {
      return { data: { success: true }, error: null };
    }
    const { data, error } = await db
      .from('attendance')
      .insert([{ gym_id: gymId, member_id: memberId, date, member_name: memberName }])
      .select()
      .single();
    return { data, error };
  },

  async getTodaysAttendance(gymId: string) {
    if (isDemo()) {
      return {
        data: [
          { id: '1', memberId: 'm1', memberName: 'John Doe', date: new Date().toISOString().split('T')[0], timeIn: '08:00 AM' },
          { id: '2', memberId: 'm2', memberName: 'Jane Smith', date: new Date().toISOString().split('T')[0], timeIn: '09:30 AM' },
        ],
        error: null,
      };
    }
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await db
      .from('attendance')
      .select('*')
      .eq('gym_id', gymId)
      .eq('date', today);
    return { data, error };
  },

  async getMemberAttendanceHistory(gymId: string, memberId: string) {
    if (isDemo()) {
      return {
        data: [
          { id: '1', memberId, memberName: 'Demo Member', date: '2023-10-01', timeIn: '07:00 AM' },
          { id: '2', memberId, memberName: 'Demo Member', date: '2023-10-02', timeIn: '07:15 AM' },
        ],
        error: null,
      };
    }
    const { data, error } = await db
      .from('attendance')
      .select('*')
      .eq('gym_id', gymId)
      .eq('member_id', memberId)
      .order('date', { ascending: false });
    return { data, error };
  }
};

