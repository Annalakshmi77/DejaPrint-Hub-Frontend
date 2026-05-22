/** Preload route chunks so in-app navigation feels instant. */

const preloaded = new Set<string>()

function runOnce(key: string, loader: () => Promise<unknown>) {
  if (preloaded.has(key)) return
  preloaded.add(key)
  void loader()
}

export function preloadDashboardRoutes() {
  runOnce('dashboard', () =>
    Promise.all([
      import('@/pages/dashboard/Designs'),
      import('@/pages/dashboard/BrowseProducts'),
      import('@/pages/dashboard/Orders'),
      import('@/pages/dashboard/PlaceOrder'),
      import('@/pages/dashboard/Account'),
      import('@/pages/dashboard/OrderTracking'),
    ])
  )
}

export function preloadAdminRoutes() {
  runOnce('admin', () =>
    Promise.all([
      import('@/pages/admin/Dashboard'),
      import('@/pages/admin/Orders'),
      import('@/pages/admin/Products'),
      import('@/pages/admin/Customers'),
    ])
  )
}

const routePreloaders: Record<string, () => Promise<unknown>> = {
  '/dashboard': () => import('@/pages/dashboard/Designs'),
  '/dashboard/designs': () => import('@/pages/dashboard/Designs'),
  '/dashboard/products': () => import('@/pages/dashboard/BrowseProducts'),
  '/dashboard/orders': () => import('@/pages/dashboard/Orders'),
  '/dashboard/account': () => import('@/pages/dashboard/Account'),
  '/admin': () => import('@/pages/admin/Dashboard'),
  '/admin/orders': () => import('@/pages/admin/Orders'),
  '/admin/products': () => import('@/pages/admin/Products'),
  '/admin/customers': () => import('@/pages/admin/Customers'),
  '/admin/account': () => import('@/pages/dashboard/Account'),
  '/login': () => import('@/pages/auth/Login'),
  '/register': () => import('@/pages/auth/Register'),
}

export function prefetchRoute(path: string) {
  const loader = routePreloaders[path]
  if (loader) void loader()
}
