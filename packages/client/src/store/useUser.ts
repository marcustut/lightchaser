import { User } from '@opening/server/dist/entity/user';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUser = create<UserState>(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
    }),
    { name: 'lightchaser-user' }
  )
);
