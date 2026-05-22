import { create } from 'zustand'
import type { CollegeId } from '../types'

interface FilterState {
  searchQuery: string
  selectedCollege: CollegeId | 'all'
  setSearchQuery: (query: string) => void
  setSelectedCollege: (college: CollegeId | 'all') => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCollege: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCollege: (college) => set({ selectedCollege: college }),
  reset: () => set({ searchQuery: '', selectedCollege: 'all' }),
}))
