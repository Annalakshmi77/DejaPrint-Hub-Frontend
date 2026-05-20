import { create } from 'zustand'
import type { Product, ProductCategory } from '@/types'

interface ProductFilters {
  category: ProductCategory | null
  search: string
  minPrice: number | null
  maxPrice: number | null
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'newest'
}

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  selectedProduct: Product | null
  filters: ProductFilters
  isLoading: boolean
  setProducts: (products: Product[]) => void
  setFeaturedProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product | null) => void
  setFilters: (filters: Partial<ProductFilters>) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
  getFilteredProducts: () => Product[]
}

const defaultFilters: ProductFilters = {
  category: null,
  search: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  filters: defaultFilters,
  isLoading: false,

  setProducts: (products) => set({ products }),
  setFeaturedProducts: (products) => set({ featuredProducts: products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setLoading: (isLoading) => set({ isLoading }),

  getFilteredProducts: () => {
    const { products, filters } = get()
    let filtered = [...products]

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      )
    }

    if (filters.minPrice !== null) {
      filtered = filtered.filter((p) => p.base_price >= filters.minPrice!)
    }

    if (filters.maxPrice !== null) {
      filtered = filtered.filter((p) => p.base_price <= filters.maxPrice!)
    }

    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price_asc':
        filtered.sort((a, b) => a.base_price - b.base_price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.base_price - a.base_price)
        break
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
    }

    return filtered
  },
}))
