import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import AdminLayout from '@/layouts/AdminLayout'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

// Public pages
const Home = lazy(() => import('@/pages/public/Home'))


// Auth pages
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const VerifyOtp = lazy(() => import('@/pages/auth/VerifyOtp'))

// Dashboard pages
const CustomerDesigns = lazy(() => import('@/pages/dashboard/Designs'))
const BrowseProducts = lazy(() => import('@/pages/dashboard/BrowseProducts'))
const Orders = lazy(() => import('@/pages/dashboard/Orders'))
const PlaceOrder = lazy(() => import('@/pages/dashboard/PlaceOrder'))
const Account = lazy(() => import('@/pages/dashboard/Account'))
const OrderTracking = lazy(() => import('@/pages/dashboard/OrderTracking'))




// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders'))
const AdminProducts = lazy(() => import('@/pages/admin/Products'))
const AdminCustomers = lazy(() => import('@/pages/admin/Customers'))
const AdminAccount = lazy(() => import('@/pages/dashboard/Account'))

function AppRoutes() {
  return (
    <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth routes — no global header/footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        {/* Dashboard routes (protected) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<CustomerDesigns />} />
            <Route path="/dashboard/designs" element={<CustomerDesigns />} />
            <Route path="/dashboard/products" element={<BrowseProducts />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/orders/:orderId" element={<OrderTracking />} />
            <Route path="/dashboard/place-order/:productId" element={<PlaceOrder />} />
            <Route path="/dashboard/account" element={<Account />} />
          </Route>
        </Route>



        {/* Admin routes (protected + admin only) */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/account" element={<AdminAccount />} />
          </Route>
        </Route>
    </Routes>
  )
}

export default AppRoutes
