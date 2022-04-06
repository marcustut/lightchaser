import create from 'zustand';
import { combine } from 'zustand/middleware';

export const useSearch = create(
  combine({ searchString: '' }, (set) => ({
    setSearchString: (searchString: string) => set({ searchString }),
  }))
);
