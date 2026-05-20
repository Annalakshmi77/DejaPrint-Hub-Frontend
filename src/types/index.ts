export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  company_name?: string
  role: 'customer' | 'admin' | 'staff'
  avatar_url?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: ProductCategory
  base_price: number
  images: string[]
  specifications: ProductSpecification
  is_active: boolean
  is_featured: boolean
  created_at: string
}

export type ProductCategory = 
  | 'calendars'
  | 'diaries'
  | 'notebooks'
  | 'invitations'
  | 'custom'

export interface ProductSpecification {
  paper_types: string[]
  sizes: string[]
  binding_options?: string[]
  finishing_options?: string[]
  min_quantity: number
  max_quantity: number
}

export interface Order {
  _id: string
  orderNumber: string
  userId: any // can be string or populated user object
  status: OrderStatus
  paymentStatus: string
  items: any[]
  totalAmount: number
  paidAmount: number
  shippingAddress: any
  notes?: string
  deliveryDate?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'designing'
  | 'printing'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  specifications: OrderItemSpecification
  design_file_url?: string
  design_status: 'pending' | 'uploaded' | 'approved' | 'revision_needed'
}

export interface OrderItemSpecification {
  size: string
  paper_type: string
  paper_gsm?: number
  binding?: string
  finishing?: string[]
  custom_notes?: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface Quotation {
  id: string
  quotation_number: string
  user_id: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  items: QuotationItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  valid_until: string
  notes?: string
  created_at: string
}

export interface QuotationItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  specifications: OrderItemSpecification
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: 'razorpay' | 'bank_transfer' | 'cash'
  transaction_id?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'quotation' | 'payment' | 'system'
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  total_orders: number
  pending_orders: number
  total_revenue: number
  active_quotations: number
}

export interface AdminStats extends DashboardStats {
  total_customers: number
  orders_this_month: number
  revenue_this_month: number
  top_products: { name: string; count: number }[]
}
