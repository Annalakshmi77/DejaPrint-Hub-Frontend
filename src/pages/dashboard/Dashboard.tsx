import { Link } from 'react-router-dom'
import { Package, FileText, CreditCard, Bell, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers'
import { useAuthStore } from '@/store/auth.store'

// Mock data
const stats = [
  { label: 'Active Orders', value: 3, icon: Package, href: '/dashboard/orders' },
  { label: 'Total Spent', value: 45230, icon: CreditCard, isCurrency: true },
  { label: 'Invoices', value: 12, icon: FileText, href: '/dashboard/invoices' },
  { label: 'Notifications', value: 5, icon: Bell, href: '/dashboard/notifications' },
]

const recentOrders = [
  {
    id: '1',
    order_number: 'PC-ABC123',
    status: 'printing',
    total: 2999,
    created_at: '2024-01-15',
    items: [{ product_name: 'Premium Wall Calendar', quantity: 50 }],
  },
  {
    id: '2',
    order_number: 'PC-DEF456',
    status: 'shipped',
    total: 5499,
    created_at: '2024-01-12',
    items: [{ product_name: 'Leather Bound Diary', quantity: 100 }],
  },
  {
    id: '3',
    order_number: 'PC-GHI789',
    status: 'delivered',
    total: 1299,
    created_at: '2024-01-08',
    items: [{ product_name: 'Spiral Notebook', quantity: 25 }],
  },
]


function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your orders today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">
                      {stat.isCurrency
                        ? formatCurrency(stat.value)
                        : stat.value}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {stat.href && (
                  <Link
                    to={stat.href}
                    className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.order_number}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items[0].product_name} x {order.items[0].quantity}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/orders/${order.id}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link to="/products">
                <Package className="h-6 w-6" />
                <span>Browse Products</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link to="/dashboard/invoices">
                <CreditCard className="h-6 w-6" />
                <span>View Invoices</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link to="/contact">
                <CheckCircle2 className="h-6 w-6" />
                <span>Request Quote</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link to="/dashboard/account">
                <Bell className="h-6 w-6" />
                <span>Account Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
