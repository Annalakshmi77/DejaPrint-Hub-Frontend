import { create } from 'zustand'
import type { Order, OrderItem } from '@/types'

interface CartItem extends Omit<OrderItem, 'id' | 'design_file_url' | 'design_status'> {
  tempId: string
}

interface OrderState {
  cart: CartItem[]
  currentOrder: Order | null
  addToCart: (item: Omit<CartItem, 'tempId'>) => void
  removeFromCart: (tempId: string) => void
  updateCartItem: (tempId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  setCurrentOrder: (order: Order | null) => void
  getCartTotal: () => { subtotal: number; tax: number; total: number }
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  currentOrder: null,
  
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, { ...item, tempId: crypto.randomUUID() }],
    })),
  
  removeFromCart: (tempId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.tempId !== tempId),
    })),
  
  updateCartItem: (tempId, updates) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.tempId === tempId ? { ...item, ...updates } : item
      ),
    })),
  
  clearCart: () => set({ cart: [] }),
  
  setCurrentOrder: (order) => set({ currentOrder: order }),
  
  getCartTotal: () => {
    const { cart } = get()
    const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax
    return { subtotal, tax, total }
  },
}))
