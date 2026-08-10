// @ts-nocheck
import { isDemo, db, type ServiceResult, type PaginatedResult } from './base.service';

export interface MemberWithMembership {
  id: string;
  gym_id: string;
  member_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'expired' | 'blocked' | 'frozen';
  deleted_at: string | null;
  occupation: string | null;
  goal: string | null;
  blood_group: string | null;
  referral_source: string | null;
  created_at: string;
  updated_at: string;
  current_membership?: {
    id: string;
    plan_id: string | null;
    plan_name?: string;
    start_date: string;
    end_date: string;
    status: string;
    original_amount: number;
    discount_amount: number;
    final_amount: number;
    paid_amount: number;
    due_amount: number;
  } | null;
}

export interface CreateMemberInput {
  full_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  occupation?: string;
  goal?: string;
  blood_group?: string;
  referral_source?: string;
  status?: 'active' | 'inactive';
}

export type MemberFilter = 'all' | 'active' | 'inactive' | 'expired' | 'blocked' | 'frozen' | 'expiring_3' | 'expiring_7' | 'expiring_15' | 'due' | 'paid' | 'partially_paid' | 'unpaid' | 'birthday_today';
export type MemberSort = 'newest' | 'oldest' | 'expiry_soonest' | 'due_highest' | 'due_lowest';

const d = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().split('T')[0];
const today = new Date();
const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const DEMO_MEMBERS: MemberWithMembership[] = [
  { id: '1', gym_id: 'demo', member_id: 'FG-1001', full_name: 'Rahul Sharma', phone: '+919876543210', email: 'rahul@example.com', date_of_birth: '1992-05-15', gender: 'male', address: 'Mumbai', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: 'weight_loss', blood_group: 'O+', referral_source: 'walk_in', created_at: d(-158), updated_at: d(-158), current_membership: { id: 'm1', plan_id: 'p1', plan_name: '6 Months', start_date: d(-158), end_date: d(22), status: 'active', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 7000, due_amount: 0 } },
  { id: '2', gym_id: 'demo', member_id: 'FG-1002', full_name: 'Priya Patel', phone: '+919876543211', email: 'priya@example.com', date_of_birth: '1994-08-10', gender: 'female', address: 'Delhi', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: 'muscle_gain', blood_group: 'A+', referral_source: 'friend', created_at: d(-215), updated_at: d(-215), current_membership: { id: 'm2', plan_id: 'p2', plan_name: '12 Months', start_date: d(-215), end_date: d(150), status: 'active', original_amount: 12000, discount_amount: 1000, final_amount: 11000, paid_amount: 5000, due_amount: 6000 } },
  { id: '3', gym_id: 'demo', member_id: 'FG-1003', full_name: 'Amit Kumar', phone: '+919876543212', email: null, date_of_birth: '1988-12-20', gender: 'male', address: 'Bangalore', emergency_contact: null, photo_url: null, notes: null, status: 'expired', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-100), updated_at: d(-100), current_membership: { id: 'm3', plan_id: 'p3', plan_name: '3 Months', start_date: d(-100), end_date: d(-10), status: 'expired', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
  { id: '4', gym_id: 'demo', member_id: 'FG-1004', full_name: 'Sneha Reddy', phone: '+919876543213', email: null, date_of_birth: `1995-${todayStr}`, gender: 'female', address: 'Hyderabad', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-28), updated_at: d(-28), current_membership: { id: 'm4', plan_id: 'p4', plan_name: '1 Month', start_date: d(-28), end_date: d(2), status: 'active', original_amount: 1500, discount_amount: 0, final_amount: 1500, paid_amount: 1500, due_amount: 0 } },
  { id: '5', gym_id: 'demo', member_id: 'FG-1005', full_name: 'Vikram Singh', phone: '+919876543214', email: null, date_of_birth: '1991-03-05', gender: 'male', address: 'Pune', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-175), updated_at: d(-175), current_membership: { id: 'm5', plan_id: 'p1', plan_name: '6 Months', start_date: d(-175), end_date: d(5), status: 'active', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 7000, due_amount: 0 } },
  { id: '6', gym_id: 'demo', member_id: 'FG-1006', full_name: 'Neha Gupta', phone: '+919876543215', email: null, date_of_birth: '1990-01-15', gender: 'female', address: 'Chennai', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-45), updated_at: d(-45), current_membership: { id: 'm6', plan_id: 'p3', plan_name: '3 Months', start_date: d(-45), end_date: d(45), status: 'active', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
  { id: '7', gym_id: 'demo', member_id: 'FG-1007', full_name: 'Arjun Mehta', phone: '+919876543216', email: null, date_of_birth: '1985-06-22', gender: 'male', address: 'Kolkata', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-165), updated_at: d(-165), current_membership: { id: 'm7', plan_id: 'p2', plan_name: '12 Months', start_date: d(-165), end_date: d(200), status: 'active', original_amount: 12000, discount_amount: 0, final_amount: 12000, paid_amount: 7000, due_amount: 5000 } },
  { id: '8', gym_id: 'demo', member_id: 'FG-1008', full_name: 'Kavita Joshi', phone: '+919876543217', email: null, date_of_birth: '1993-11-05', gender: 'female', address: 'Jaipur', emergency_contact: null, photo_url: null, notes: null, status: 'inactive', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-300), updated_at: d(-300), current_membership: null },
  { id: '9', gym_id: 'demo', member_id: 'FG-1009', full_name: 'Rohan Verma', phone: '+919876543218', email: null, date_of_birth: '1996-02-18', gender: 'male', address: 'Ahmedabad', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-168), updated_at: d(-168), current_membership: { id: 'm9', plan_id: 'p1', plan_name: '6 Months', start_date: d(-168), end_date: d(12), status: 'active', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 7000, due_amount: 0 } },
  { id: '10', gym_id: 'demo', member_id: 'FG-1010', full_name: 'Anjali Desai', phone: '+919876543219', email: null, date_of_birth: `1997-${todayStr}`, gender: 'female', address: 'Surat', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-30), updated_at: d(-30), current_membership: { id: 'm10', plan_id: 'p3', plan_name: '3 Months', start_date: d(-30), end_date: d(60), status: 'active', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
  { id: '11', gym_id: 'demo', member_id: 'FG-1011', full_name: 'Sanjay Rao', phone: '+919876543220', email: null, date_of_birth: '1989-09-12', gender: 'male', address: 'Lucknow', emergency_contact: null, photo_url: null, notes: null, status: 'expired', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-35), updated_at: d(-35), current_membership: { id: 'm11', plan_id: 'p4', plan_name: '1 Month', start_date: d(-35), end_date: d(-5), status: 'expired', original_amount: 1500, discount_amount: 0, final_amount: 1500, paid_amount: 1500, due_amount: 0 } },
  { id: '12', gym_id: 'demo', member_id: 'FG-1012', full_name: 'Pooja Nair', phone: '+919876543221', email: null, date_of_birth: '1998-12-01', gender: 'female', address: 'Kochi', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-90), updated_at: d(-90), current_membership: { id: 'm12', plan_id: 'p1', plan_name: '6 Months', start_date: d(-90), end_date: d(90), status: 'active', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 3500, due_amount: 3500 } },
  { id: '13', gym_id: 'demo', member_id: 'FG-1013', full_name: 'Manish Tiwari', phone: '+919876543222', email: null, date_of_birth: '1987-04-14', gender: 'male', address: 'Bhopal', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-60), updated_at: d(-60), current_membership: { id: 'm13', plan_id: 'p1', plan_name: '6 Months', start_date: d(-60), end_date: d(120), status: 'active', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 3000, due_amount: 4000 } },
  { id: '14', gym_id: 'demo', member_id: 'FG-1014', full_name: 'Divya Chauhan', phone: '+919876543223', email: null, date_of_birth: '1992-07-25', gender: 'female', address: 'Indore', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-89), updated_at: d(-89), current_membership: { id: 'm14', plan_id: 'p3', plan_name: '3 Months', start_date: d(-89), end_date: d(1), status: 'active', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
  { id: '15', gym_id: 'demo', member_id: 'FG-1015', full_name: 'Karan Malhotra', phone: '+919876543224', email: null, date_of_birth: '1990-10-30', gender: 'male', address: 'Chandigarh', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-65), updated_at: d(-65), current_membership: { id: 'm15', plan_id: 'p2', plan_name: '12 Months', start_date: d(-65), end_date: d(300), status: 'active', original_amount: 12000, discount_amount: 0, final_amount: 12000, paid_amount: 5000, due_amount: 7000 } },
  { id: '16', gym_id: 'demo', member_id: 'FG-1016', full_name: 'Ritu Saxena', phone: '+919876543225', email: null, date_of_birth: '1986-05-08', gender: 'female', address: 'Kanpur', emergency_contact: null, photo_url: null, notes: null, status: 'blocked', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-150), updated_at: d(-150), current_membership: { id: 'm16', plan_id: 'p3', plan_name: '3 Months', start_date: d(-150), end_date: d(-60), status: 'expired', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
  { id: '17', gym_id: 'demo', member_id: 'FG-1017', full_name: 'Deepak Yadav', phone: '+919876543226', email: null, date_of_birth: '1994-11-20', gender: 'male', address: 'Patna', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-23), updated_at: d(-23), current_membership: { id: 'm17', plan_id: 'p4', plan_name: '1 Month', start_date: d(-23), end_date: d(7), status: 'active', original_amount: 1500, discount_amount: 0, final_amount: 1500, paid_amount: 1500, due_amount: 0 } },
  { id: '18', gym_id: 'demo', member_id: 'FG-1018', full_name: 'Swati Bhatt', phone: '+919876543227', email: null, date_of_birth: '1991-08-14', gender: 'female', address: 'Dehradun', emergency_contact: null, photo_url: null, notes: null, status: 'frozen', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-100), updated_at: d(-100), current_membership: { id: 'm18', plan_id: 'p1', plan_name: '6 Months', start_date: d(-100), end_date: d(80), status: 'frozen', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 7000, due_amount: 0 } },
  { id: '19', gym_id: 'demo', member_id: 'FG-1019', full_name: 'Nikhil Jain', phone: '+919876543228', email: null, date_of_birth: '1989-02-28', gender: 'male', address: 'Raipur', emergency_contact: null, photo_url: null, notes: null, status: 'expired', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-200), updated_at: d(-200), current_membership: { id: 'm19', plan_id: 'p1', plan_name: '6 Months', start_date: d(-200), end_date: d(-20), status: 'expired', original_amount: 7000, discount_amount: 0, final_amount: 7000, paid_amount: 7000, due_amount: 0 } },
  { id: '20', gym_id: 'demo', member_id: 'FG-1020', full_name: 'Meera Kapoor', phone: '+919876543229', email: null, date_of_birth: '1995-06-10', gender: 'female', address: 'Agra', emergency_contact: null, photo_url: null, notes: null, status: 'active', deleted_at: null, occupation: null, goal: null, blood_group: null, referral_source: null, created_at: d(-15), updated_at: d(-15), current_membership: { id: 'm20', plan_id: 'p3', plan_name: '3 Months', start_date: d(-15), end_date: d(75), status: 'active', original_amount: 4000, discount_amount: 0, final_amount: 4000, paid_amount: 4000, due_amount: 0 } },
];

export const fetchMembers = async (gymId: string, options?: { search?: string; filter?: MemberFilter; sort?: MemberSort; page?: number; pageSize?: number }): Promise<PaginatedResult<MemberWithMembership>> => {
  if (isDemo()) {
    let results = [...DEMO_MEMBERS].map(m => ({ ...m, gym_id: gymId }));
    
    // Filtering
    if (options?.filter && options.filter !== 'all') {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const tzOffset = todayDate.getTimezoneOffset() * 60000;
      const todayStrLocal = new Date(Date.now() - tzOffset).toISOString().split('T')[0];
      const monthDayStr = todayStrLocal.substring(5);

      switch (options.filter) {
        case 'active':
        case 'inactive':
        case 'expired':
        case 'blocked':
        case 'frozen':
          results = results.filter(m => m.status === options.filter);
          break;
        case 'expiring_3':
        case 'expiring_7':
        case 'expiring_15': {
          const days = options.filter === 'expiring_3' ? 3 : options.filter === 'expiring_7' ? 7 : 15;
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + days);
          maxDate.setHours(23, 59, 59, 999);
          
          results = results.filter(m => {
            if (m.status !== 'active' || !m.current_membership?.end_date) return false;
            const endDate = new Date(m.current_membership.end_date);
            return endDate >= todayDate && endDate <= maxDate;
          });
          break;
        }
        case 'due':
          results = results.filter(m => m.current_membership && m.current_membership.due_amount > 0);
          break;
        case 'paid':
          results = results.filter(m => m.current_membership && m.current_membership.due_amount === 0);
          break;
        case 'partially_paid':
          results = results.filter(m => m.current_membership && m.current_membership.paid_amount > 0 && m.current_membership.due_amount > 0);
          break;
        case 'unpaid':
          results = results.filter(m => m.current_membership && m.current_membership.paid_amount === 0);
          break;
        case 'birthday_today':
          results = results.filter(m => m.date_of_birth && m.date_of_birth.endsWith(monthDayStr));
          break;
      }
    }

    if (options?.search) {
      const s = options.search.toLowerCase();
      results = results.filter(m => m.full_name.toLowerCase().includes(s) || m.phone.includes(s) || m.member_id.toLowerCase().includes(s));
    }

    // Sorting
    if (options?.sort) {
      results.sort((a, b) => {
        switch (options.sort) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'expiry_soonest':
            if (!a.current_membership?.end_date) return 1;
            if (!b.current_membership?.end_date) return -1;
            return new Date(a.current_membership.end_date).getTime() - new Date(b.current_membership.end_date).getTime();
          case 'due_highest':
            return (b.current_membership?.due_amount || 0) - (a.current_membership?.due_amount || 0);
          case 'due_lowest':
            return (a.current_membership?.due_amount || 0) - (b.current_membership?.due_amount || 0);
          default:
            return 0;
        }
      });
    }

    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    
    return { data: results.slice((page - 1) * pageSize, page * pageSize), total: results.length, page, pageSize };
  }

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  
  let query = db.from('members').select('*', { count: 'exact' }).eq('gym_id', gymId).is('deleted_at', null);

  if (options?.search) {
    query = query.or(`full_name.ilike.%${options.search}%,phone.ilike.%${options.search}%,member_id.ilike.%${options.search}%`);
  }

  if (options?.filter && options.filter !== 'all') {
    if (['active', 'inactive', 'expired', 'blocked', 'frozen'].includes(options.filter)) {
      query = query.eq('status', options.filter);
    } else if (options.filter === 'birthday_today') {
      const todayDate = new Date();
      const monthStr = String(todayDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(todayDate.getDate()).padStart(2, '0');
      query = query.like('date_of_birth', `%-${monthStr}-${dayStr}`);
    }
  }

  if (options?.sort) {
    if (options.sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (options.sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  
  if (error) return { data: [], total: 0, page, pageSize };

  const members = data as any as MemberWithMembership[];

  if (members.length > 0) {
    const memberIds = members.map(m => m.id);
    
    // Fetch latest membership for each member
    const { data: membershipsData } = await db.from('memberships')
      .select('*')
      .in('member_id', memberIds)
      .order('end_date', { ascending: false });

    if (membershipsData) {
      members.forEach(member => {
        const memberMemberships = membershipsData.filter((m: any) => m.member_id === member.id);
        if (memberMemberships.length > 0) {
          member.current_membership = memberMemberships[0] as any;
        } else {
          member.current_membership = null;
        }
      });
    }

    if (options?.filter && ['expiring_3', 'expiring_7', 'expiring_15', 'due', 'paid', 'partially_paid', 'unpaid'].includes(options.filter)) {
      let filteredMembers = members;
      
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      switch (options.filter) {
        case 'expiring_3':
        case 'expiring_7':
        case 'expiring_15': {
          const days = options.filter === 'expiring_3' ? 3 : options.filter === 'expiring_7' ? 7 : 15;
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + days);
          maxDate.setHours(23, 59, 59, 999);
          
          filteredMembers = filteredMembers.filter(m => {
            if (m.status !== 'active' || !m.current_membership?.end_date) return false;
            const endDate = new Date(m.current_membership.end_date);
            return endDate >= todayDate && endDate <= maxDate;
          });
          break;
        }
        case 'due':
          filteredMembers = filteredMembers.filter(m => m.current_membership && m.current_membership.due_amount > 0);
          break;
        case 'paid':
          filteredMembers = filteredMembers.filter(m => m.current_membership && m.current_membership.due_amount === 0);
          break;
        case 'partially_paid':
          filteredMembers = filteredMembers.filter(m => m.current_membership && m.current_membership.paid_amount > 0 && m.current_membership.due_amount > 0);
          break;
        case 'unpaid':
          filteredMembers = filteredMembers.filter(m => m.current_membership && m.current_membership.paid_amount === 0);
          break;
      }

      if (options?.sort) {
        filteredMembers.sort((a, b) => {
          switch (options.sort) {
            case 'expiry_soonest':
              if (!a.current_membership?.end_date) return 1;
              if (!b.current_membership?.end_date) return -1;
              return new Date(a.current_membership.end_date).getTime() - new Date(b.current_membership.end_date).getTime();
            case 'due_highest':
              return (b.current_membership?.due_amount || 0) - (a.current_membership?.due_amount || 0);
            case 'due_lowest':
              return (a.current_membership?.due_amount || 0) - (b.current_membership?.due_amount || 0);
            default:
              return 0;
          }
        });
      }

      return { 
        data: filteredMembers, 
        total: filteredMembers.length,
        page, 
        pageSize 
      };
    } else if (options?.sort && ['expiry_soonest', 'due_highest', 'due_lowest'].includes(options.sort)) {
       members.sort((a, b) => {
        switch (options.sort) {
          case 'expiry_soonest':
            if (!a.current_membership?.end_date) return 1;
            if (!b.current_membership?.end_date) return -1;
            return new Date(a.current_membership.end_date).getTime() - new Date(b.current_membership.end_date).getTime();
          case 'due_highest':
            return (b.current_membership?.due_amount || 0) - (a.current_membership?.due_amount || 0);
          case 'due_lowest':
            return (a.current_membership?.due_amount || 0) - (b.current_membership?.due_amount || 0);
          default:
            return 0;
        }
      });
    }
  }

  return { data: members, total: count || 0, page, pageSize };
};

export const fetchMemberById = async (gymId: string, memberId: string): Promise<ServiceResult<MemberWithMembership>> => {
  if (isDemo()) return { data: DEMO_MEMBERS.find(m => m.id === memberId) || null, error: null };
  const { data, error } = await db.from('members').select(`*, current_membership:memberships(*)`).eq('id', memberId).eq('gym_id', gymId).single();
  return { data: data as any as MemberWithMembership, error: error?.message || null };
};

export const createMember = async (gymId: string, data: CreateMemberInput): Promise<ServiceResult<MemberWithMembership>> => {
  if (isDemo()) return { data: { ...DEMO_MEMBERS[0], ...data, id: 'm-' + Date.now(), gym_id: gymId, member_id: 'FG-9999', status: data.status || 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null } as MemberWithMembership, error: null };
  const member_id = await generateMemberId(gymId);
  const { data: result, error } = await db.from('members').insert({ ...data, gym_id: gymId, member_id }).select().single();
  return { data: result as any as MemberWithMembership, error: error?.message || null };
};

export const updateMember = async (gymId: string, memberId: string, data: Partial<CreateMemberInput>): Promise<ServiceResult<MemberWithMembership>> => {
  if (isDemo()) return { data: { ...DEMO_MEMBERS[0], ...data } as MemberWithMembership, error: null };
  const { data: result, error } = await db.from('members').update(data).eq('id', memberId).eq('gym_id', gymId).select().single();
  return { data: result as any as MemberWithMembership, error: error?.message || null };
};

export const deleteMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ deleted_at: new Date().toISOString() }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const restoreMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ deleted_at: null }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const permanentDeleteMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').delete().eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const blockMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ status: 'blocked' }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const unblockMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ status: 'active' }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const freezeMember = async (gymId: string, memberId: string, startDate: string, endDate: string, reason: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ status: 'frozen' }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const unfreezeMember = async (gymId: string, memberId: string): Promise<ServiceResult<boolean>> => {
  if (isDemo()) return { data: true, error: null };
  const { error } = await db.from('members').update({ status: 'active' }).eq('id', memberId).eq('gym_id', gymId);
  return { data: !error, error: error?.message || null };
};

export const generateMemberId = async (gymId: string): Promise<string> => {
  if (isDemo()) return `FG-${Math.floor(1000 + Math.random() * 9000)}`;
  const { count } = await db.from('members').select('*', { count: 'exact', head: true }).eq('gym_id', gymId);
  return `FG-${1000 + (count || 0) + 1}`;
};

export const getDeletedMembers = async (gymId: string): Promise<MemberWithMembership[]> => {
  if (isDemo()) return [];
  const { data, error } = await db.from('members').select('*').eq('gym_id', gymId).not('deleted_at', 'is', null);
  return (data || []) as any as MemberWithMembership[];
};


