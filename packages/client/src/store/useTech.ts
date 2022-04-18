/* eslint-disable @typescript-eslint/no-unused-vars */
import create from 'zustand';
import { persist } from 'zustand/middleware';

type TechGameState = {
  [x: number]: boolean;
};

type TechStoreType = {
  gameState: TechGameState;
  pass: (task: number) => void;
};

export const useTech = create<TechStoreType>(
  persist(
    (set, get) => ({
      gameState: {
        1: false,
        2: false,
        3: false,
      },
      pass: (task) => set((state) => ({ gameState: { ...state.gameState, [task]: true } })),
    }),
    { name: 'techGameStorage' }
  )
);
