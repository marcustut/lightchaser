import create from 'zustand';

type S2StoreType = {
  amount: number;
  setAmount: (state: number) => void;
};

export const useS2 = create<S2StoreType>((set) => ({
  amount: 500,
  setAmount: (state) => set(() => ({ amount: state })),
}));
