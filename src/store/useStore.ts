import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type IncomeType = 'Student/Non-Working' | 'Working';

export interface Expense {
  category: string;
  amount: number;
  icon: string;
}

export interface UserData {
  incomeType: IncomeType;
  monthlyIncome: number;
  expenses: Expense[];
  biggestWorry: string;
  goals: string[];
  timeline: number; // in months
  onboarded: boolean;
  healthScore: number;
  personalizedTips: string[];
  socialMotto: string;
}

interface FinAidState {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetData: () => void;
}

const initialUserData: UserData = {
  incomeType: 'Student/Non-Working',
  monthlyIncome: 0,
  expenses: [
    { category: 'Food 🍚', amount: 0, icon: 'Utensils' },
    { category: 'Rent 🏠', amount: 0, icon: 'Home' },
    { category: 'Transport 🚌', amount: 0, icon: 'Bus' },
    { category: 'Bills 💡', amount: 0, icon: 'Zap' },
    { category: 'Health 📚', amount: 0, icon: 'Heart' },
    { category: 'Fun 🎮', amount: 0, icon: 'Gamepad' },
    { category: 'EMI/Loans', amount: 0, icon: 'CreditCard' },
    { category: 'Others', amount: 0, icon: 'MoreHorizontal' },
  ],
  biggestWorry: '',
  goals: [],
  timeline: 3,
  onboarded: false,
  healthScore: 0,
  personalizedTips: [],
  socialMotto: 'Financial freedom for every Indian family.',
};

export const useStore = create<FinAidState>()(
  persist(
    (set) => ({
      userData: initialUserData,
      setUserData: (data) =>
        set((state) => ({
          userData: { ...state.userData, ...data },
        })),
      resetData: () => set({ userData: initialUserData }),
    }),
    {
      name: 'finaid-buddy-v2-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
