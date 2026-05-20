import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Eye, Package, Calendar, Clock, Mail, Hash, X, Check, Truck, Printer, FileSearch } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../services/api'

function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getOrders(1, 50)
        if (response.data && response.data.data) {
          setOrders(response.data.data.orders)
        }
      } catch (error) {
        console.error('Failed to fetch orders', error)
        toast.error('Could not load your order history')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.items.some((item: any) => item.productName.toLowerCase().includes(search.toLowerCase()))
  )

  const activeOrdersCount = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length
  const totalRequests = orders.length

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Retrieving your order history...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="adm-page-header">
        <div className="adm-page-label">Order Tracking</div>
        <h1 className="adm-page-title">My Purchase History</h1>
        <p className="adm-page-sub">Monitor the production status and delivery progress of your custom orders.</p>
      </div>

      {/* KPI Style Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Active Orders</p>
            <p className="adm-kpi-value">{activeOrdersCount}</p>
          </div>
          <div className="adm-kpi-icon teal"><Clock size={22} /></div>
        </div>
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Total Requests</p>
            <p className="adm-kpi-value">{totalRequests}</p>
          </div>
          <div className="adm-kpi-icon teal"><Package size={22} /></div>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input 
            type="text" 
            placeholder="Search by order number or product..." 
            className="adm-toolbar-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="adm-icon-btn"><Filter size={16} /></button>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product Design</th>
                <th>Order Details</th>
                <th>Contact Point</th>
                <th>Order Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <p className="font-bold text-[var(--adm-text)] line-clamp-1">{order.items[0]?.productName || 'Multiple Items'}</p>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[var(--adm-teal)]">Qty: {order.items.reduce((q: number, i: any) => q + i.quantity, 0)} Units</p>
                      <p className="sub-text capitalize">{order.items[0]?.variantId || 'Standard Inquiry'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs text-[var(--adm-text-sub)]">
                      <Mail size={12} className="text-[var(--adm-teal)]" />
                      {order.shippingAddress?.email || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs text-[var(--adm-text-sub)]">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td>
                    <span className={`adm-badge ${
                      order.status === 'delivered' ? 'completed' : 
                      ['dispatched', 'printing', 'designing'].includes(order.status) ? 'processing' : 
                      order.status === 'cancelled' ? 'inactive' : 'pending'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="adm-action-btn" 
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

              ))}

            </tbody>
          </table>
        </div>
      ) : (
        <div className="adm-empty py-20">
          <Package size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-[var(--adm-text-sub)]">No orders found in your history.</p>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-[var(--adm-bg)] border border-[var(--adm-border)] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--adm-border)] bg-[var(--adm-surface)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--adm-text)] leading-none">Order Tracking</h2>
                  <p className="text-xs text-[var(--adm-text-sub)] mt-1.5 flex items-center gap-2">
                    <Package size={12} className="text-[var(--adm-teal)]" />
                    {selectedOrder.items[0]?.productName || 'Custom Design'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--adm-surface2)] text-[var(--adm-text-sub)] hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-12">
              {/* Product Info Card */}
              <div className="p-6 rounded-2xl bg-[var(--adm-surface)] border border-[var(--adm-border)] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--adm-border)] bg-[var(--adm-surface2)]">
                    <div className="w-full h-full flex items-center justify-center opacity-20"><Package size={24} /></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--adm-text)]">{selectedOrder.items[0]?.productName}</h3>
                    <p className="text-xs text-[var(--adm-teal)] font-black uppercase tracking-widest mt-1">
                      {selectedOrder.items.reduce((q: number, i: any) => q + i.quantity, 0)} Units • {selectedOrder.items[0]?.variantId || 'Standard Inquiry'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selectedOrder.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-[var(--adm-teal)]/10 text-[var(--adm-teal)]'
                  }`}>
                    {selectedOrder.status}
                  </span>
                  <p className="text-[10px] text-[var(--adm-text-dim)] font-medium mt-2">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="relative pt-4 pb-8">
                {/* Connecting Lines */}
                <div className="absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-[var(--adm-border)]" />
                <div 
                  className="absolute top-[44px] left-[10%] h-[2px] bg-[var(--adm-teal)] transition-all duration-1000" 
                  style={{ width: `${
                    selectedOrder.status === 'delivered' ? '80%' : 
                    selectedOrder.status === 'printing' ? '53%' : 
                    ['confirmed', 'designing'].includes(selectedOrder.status) ? '26%' : '0%'
                  }` }}
                />

                {/* Tracking Points */}
                <div className="relative flex justify-between px-[5%]">
                  {[
                    { label: 'Order Placed', icon: Check, active: true, done: true },
                    { label: 'Proof Review', icon: FileSearch, active: ['confirmed', 'designing', 'printing', 'dispatched', 'delivered'].includes(selectedOrder.status), done: ['confirmed', 'designing', 'printing', 'dispatched', 'delivered'].includes(selectedOrder.status) },
                    { label: 'Printing', icon: Printer, active: ['printing', 'dispatched', 'delivered'].includes(selectedOrder.status), done: ['printing', 'dispatched', 'delivered'].includes(selectedOrder.status) },
                    { label: 'Delivered', icon: Truck, active: selectedOrder.status === 'delivered', done: selectedOrder.status === 'delivered' }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                        step.done ? 'bg-[var(--adm-teal)] border-[var(--adm-teal)] text-white shadow-lg shadow-teal-900/30' : 
                        step.active ? 'bg-[var(--adm-surface)] border-[var(--adm-teal)] text-[var(--adm-teal)] animate-pulse' : 
                        'bg-[var(--adm-surface)] border-[var(--adm-border)] text-[var(--adm-text-dim)]'
                      }`}>
                        <step.icon size={22} />
                      </div>
                      <div className="text-center">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${step.active ? 'text-[var(--adm-text)]' : 'text-[var(--adm-text-dim)]'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Note */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--adm-teal)]/5 to-transparent border border-[var(--adm-teal)]/10 flex gap-4">
                <Clock className="text-[var(--adm-teal)] shrink-0" size={20} />
                <p className="text-[11px] text-[var(--adm-text-sub)] leading-relaxed italic">
                  Production timelines are estimated based on standard turnaround. Your specific configuration may vary. 
                  Please check your registered email for quotation and payment confirmations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
