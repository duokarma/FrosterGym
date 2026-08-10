// @ts-nocheck
import { db, isDemo } from './base.service';

export interface DietMeal {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  target?: string;
  calories: number;
  meals?: DietMeal;
  gym_id?: string;
}

export const dietService = {
  async fetchDietPlans(gymId: string) {
    if (isDemo()) {
      return {
        data: [
          { id: 'diet1', name: 'Weight Loss Pro', target: 'Fat Loss', calories: 1500, meals: { breakfast: 'Oats', lunch: 'Salad', dinner: 'Soup' } },
          { id: 'diet2', name: 'Muscle Builder', target: 'Muscle Gain', calories: 2800, meals: { breakfast: 'Eggs & Toast', lunch: 'Chicken & Rice', dinner: 'Steak & Potatoes' } },
        ],
        error: null,
      };
    }
    const { data, error } = await db
      .from('diet_plans')
      .select('*')
      .eq('gym_id', gymId)
      .order('name', { ascending: true });
    return { data, error };
  },

  async createDietPlan(gymId: string, dietData: Omit<DietPlan, 'id' | 'gym_id'>) {
    if (isDemo()) {
      return { data: { id: `diet${Math.floor(Math.random() * 1000)}`, ...dietData }, error: null };
    }
    const { data, error } = await db
      .from('diet_plans')
      .insert([{ gym_id: gymId, ...dietData }])
      .select()
      .single();
    return { data, error };
  }
};

