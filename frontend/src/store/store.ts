import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Install if needed: npm i @react-native-async-storage/async-storage

interface RaffleState {
  raffles: any[];
  myRaffles: any[];
  user: any | null;
  setRaffles: (raffles: any[]) => void;
  setMyRaffles: (myRaffles: any[]) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useStore = create<RaffleState>()(
  persist(
    (set) => ({
      raffles: [],
      myRaffles: [],
      user: null,
      setRaffles: (raffles) => set({ raffles }),
      setMyRaffles: (myRaffles) => set({ myRaffles }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, raffles: [], myRaffles: [] }),
    }),
    {
      name: 'raffle-storage',
      storage: {
        getItem: AsyncStorage.getItem,
        setItem: AsyncStorage.setItem,
        removeItem: AsyncStorage.removeItem,
      },
    }
  )
);