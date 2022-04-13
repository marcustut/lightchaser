import create from 'zustand';

type S2StoreType = {
  amount: number;
  change: (state: number) => void;
};

export const useS2 = create<S2StoreType>((set) => ({
  amount: 0,
  change: (state) => set(() => ({ amount: state })),
}));
