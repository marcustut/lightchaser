import { User } from '@opening/server/dist/entity/user';
import create from 'zustand';

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
