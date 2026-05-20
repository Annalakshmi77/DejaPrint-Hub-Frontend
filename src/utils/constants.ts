export const PRODUCT_CATEGORIES = [
  { value: 'calendars', label: 'Calendars', icon: 'Calendar' },
  { value: 'diaries', label: 'Diaries', icon: 'BookOpen' },
  { value: 'notebooks', label: 'Notebooks', icon: 'Notebook' },
  { value: 'invitations', label: 'Invitations', icon: 'Mail' },
  { value: 'custom', label: 'Custom Products', icon: 'Palette' },
] as const

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'designing', label: 'Designing', color: 'bg-purple-100 text-purple-800' },
  { value: 'printing', label: 'Printing', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'quality_check', label: 'Quality Check', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-orange-100 text-orange-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
] as const

export const PAPER_TYPES = [
  'Art Paper',
  'Matte Paper',
  'Glossy Paper',
  'Cardstock',
  'Recycled Paper',
  'Premium Bond',
  'Textured Paper',
] as const

export const PAPER_GSM_OPTIONS = [80, 100, 120, 150, 170, 200, 250, 300, 350] as const

export const BINDING_OPTIONS = [
  'Spiral Binding',
  'Perfect Binding',
  'Saddle Stitch',
  'Wire-O Binding',
  'Case Binding',
  'Comb Binding',
] as const

export const FINISHING_OPTIONS = [
  'Lamination (Glossy)',
  'Lamination (Matte)',
  'UV Coating',
  'Embossing',
  'Foil Stamping',
  'Die Cutting',
  'Spot UV',
] as const

export const SIZES = {
  calendars: ['A3', 'A4', 'A5', 'Desk Calendar', 'Wall Calendar'],
  diaries: ['A4', 'A5', 'A6', 'Pocket'],
  notebooks: ['A4', 'A5', 'A6', 'B5'],
  invitations: ['5x7"', '4x6"', 'A5', 'Square 6x6"'],
  custom: ['Custom Size'],
} as const

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export const DASHBOARD_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/dashboard/orders', label: 'My Orders', icon: 'Package' },
  { href: '/dashboard/quotations', label: 'Quotations', icon: 'FileText' },
  { href: '/dashboard/design-upload', label: 'Upload Design', icon: 'Upload' },
  { href: '/dashboard/invoices', label: 'Invoices', icon: 'Receipt' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: 'Bell' },
  { href: '/dashboard/account', label: 'Account', icon: 'User' },
] as const

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/orders', label: 'Orders', icon: 'Package' },
  { href: '/admin/products', label: 'Products', icon: 'Box' },
  { href: '/admin/customers', label: 'Customers', icon: 'Users' },
  { href: '/admin/quotations', label: 'Quotations', icon: 'FileText' },
  { href: '/admin/payments', label: 'Payments', icon: 'CreditCard' },
  { href: '/admin/reports', label: 'Reports', icon: 'BarChart3' },
] as const
