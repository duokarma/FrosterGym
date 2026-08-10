// @ts-nocheck
import { db, isDemo } from './base.service';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export const fetchExpenses = async (gymId: string, filters?: any) => {
  if (isDemo()) {
    return {
      data: [
        { id: 'e1', category: 'Rent', amount: 5000, date: '2023-10-01', description: 'Monthly rent' },
        { id: 'e2', category: 'Electricity', amount: 300, date: '2023-10-05', description: 'Electricity bill' },
        { id: 'e3', category: 'Equipment Repair', amount: 150, date: '2023-10-10', description: 'Treadmill repair' },
      ],
      error: null,
    };
  }
  let query = db.from('expenses').select('*').eq('gym_id', gymId);
  if (filters?.month) {
    // Basic filter placeholder
  }
  const { data, error } = await query;
  return { data, error };
};

export const addExpense = async (gymId: string, expenseData: Omit<Expense, 'id'>) => {
  if (isDemo()) {
    return { data: { id: 'e4', ...expenseData }, error: null };
  }
  const { data, error } = await db
    .from('expenses')
    .insert([{ gym_id: gymId, ...expenseData }])
    .select()
    .single();
  return { data, error };
};

export const getExpenseCategories = async (gymId: string) => {
  if (isDemo()) {
    return {
      data: ['Rent', 'Electricity', 'Equipment Repair', 'Salaries', 'Marketing', 'Other'],
      error: null,
    };
  }
  return {
      data: ['Rent', 'Electricity', 'Equipment Repair', 'Salaries', 'Marketing', 'Other'],
      error: null
  };
};

export const expensesService = {
  fetchExpenses,
  addExpense,
  getExpenseCategories
};

