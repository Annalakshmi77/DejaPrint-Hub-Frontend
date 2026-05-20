import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, Calendar, ShoppingBag, Package, X, Check, FileSearch, Printer, Truck, Clock, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '../../types';

import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    totalAmount: 0,
    paidAmount: 0,
    status: '',
    paymentStatus: ''
  });

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.deleteAdminOrder(orderId);
      setOrders(orders.filter(o => o._id !== orderId));
      setFilteredOrders(filteredOrders.filter(o => o._id !== orderId));
      toast.success('Order deleted');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      totalAmount: order.totalAmount || 0,
      paidAmount: order.paidAmount || 0,
      status: order.status,
      paymentStatus: order.paymentStatus || 'pending'
    });
    setIsModalOpen(true);
  };

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const response = await api.updateAdminOrder(selectedOrder._id, editForm);
      const updatedOrder = response.data.data;
      setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      setFilteredOrders(filteredOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      setIsModalOpen(false);
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getAdminOrders(1, 100);
        const data = response.data.data.orders;
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Failed to fetch admin orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        order =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Fetching order database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="adm-page-header">
        <div className="adm-page-label">Operations</div>
        <h1 className="adm-page-title">Order Management</h1>
        <p className="adm-page-sub">Track production progress, manage shipments, and handle customer requests.</p>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input
            type="text"
            placeholder="Search by order #, customer, or product..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="adm-toolbar-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#7aadba]" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="adm-toolbar-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order Info</th>
              <th>Customer</th>
              <th>Product Details</th>
              <th>Status</th>
              <th>Timeline</th>
              <th>Finance</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="adm-kpi-icon teal" style={{ width: '32px', height: '32px' }}>
                      <Package size={14} />
                    </div>
                    <p className="font-bold text-[var(--adm-text)]">{order.items[0]?.productName || 'Custom Design'}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="font-semibold text-[var(--adm-text)]">{order.shippingAddress?.name || order.userId?.name || 'Customer'}</p>
                    <p className="sub-text">{order.shippingAddress?.email || order.userId?.email || 'N/A'}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="text-sm">{order.items[0]?.productName || 'Multiple Items'}</p>
                    <p className="sub-text">Qty: {order.items.reduce((q, i) => q + i.quantity, 0)}</p>
                  </div>
                </td>
                <td>
                  <span className={`adm-badge ${
                    order.status === 'delivered' ? 'completed' : 
                    ['dispatched', 'printing', 'designing'].includes(order.status) ? 'processing' : 
                    order.status === 'cancelled' ? 'inactive' : 'pending'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--adm-text-sub)]">
                      <Calendar size={12} />
                      <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {order.deliveryDate && (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--adm-teal-lt)]">
                        <Calendar size={12} />
                        <span>Due: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-[var(--adm-text)]">₹{(order.totalAmount || 0).toLocaleString()}</p>
                    <span className={`adm-badge ${order.paymentStatus || 'pending'}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                      {(order.paymentStatus || 'pending').toUpperCase()}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleViewClick(order)} className="adm-action-btn" title="View Details">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => handleEditClick(order)} className="adm-action-btn" title="Edit Order">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(order._id)} className="adm-action-btn danger" title="Delete Order">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="adm-empty">
            <p>No orders found matching your search criteria.</p>
          </div>
        )}
      </div>
      {/* Edit/View Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--adm-surface)] border border-[var(--adm-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--adm-border)] flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="adm-page-label !mb-0">{selectedOrder.orderNumber}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--adm-text)]">Edit Quote & Status</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="adm-action-btn"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="adm-page-label block mb-2">Total Amount (₹)</label>
                  <input type="number" className="adm-toolbar-input w-full" value={editForm.totalAmount} onChange={e => setEditForm({...editForm, totalAmount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="adm-page-label block mb-2">Paid Amount (₹)</label>
                  <input type="number" className="adm-toolbar-input w-full" value={editForm.paidAmount} onChange={e => setEditForm({...editForm, paidAmount: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="adm-page-label block mb-2">Order Status</label>
                  <select className="adm-toolbar-select w-full" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="designing">Designing</option>
                    <option value="printing">Printing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="adm-page-label block mb-2">Payment Status</label>
                  <select className="adm-toolbar-select w-full" value={editForm.paymentStatus} onChange={e => setEditForm({...editForm, paymentStatus: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="bg-[var(--adm-surface2)] p-4 rounded-xl space-y-2 border border-[var(--adm-border)]">
                 <p className="text-xs font-bold text-[var(--adm-text-dim)] uppercase tracking-wider">Customer Details</p>
                 <p className="text-sm font-semibold text-[var(--adm-text)]">{selectedOrder.shippingAddress?.name || selectedOrder.userId?.name}</p>
                 <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress?.email || selectedOrder.userId?.email}</p>
                 {selectedOrder.notes && (
                   <div className="mt-3 pt-3 border-t border-[var(--adm-border)]">
                     <p className="text-xs font-bold text-[var(--adm-text-dim)] uppercase tracking-wider mb-1">Notes</p>
                     <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.notes}</p>
                   </div>
                 )}
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-[var(--adm-text-sub)] hover:text-[var(--adm-text)] transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[var(--adm-teal)] hover:bg-[var(--adm-teal-lt)] text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-teal-900/20 active:scale-95">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal (Tracking Design) */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-[var(--adm-bg)] border border-[var(--adm-border)] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--adm-border)] bg-[var(--adm-surface)] sticky top-0 z-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--adm-text)] leading-none">Order Details</h2>
                  <p className="text-xs text-[var(--adm-text-sub)] mt-1.5 flex items-center gap-2">
                    <Package size={12} className="text-[var(--adm-teal)]" />
                    {selectedOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--adm-surface2)] text-[var(--adm-text-sub)] hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-12">
              {/* Product Info Card */}
              <div className="p-6 rounded-2xl bg-[var(--adm-surface)] border border-[var(--adm-border)] flex flex-wrap gap-6 items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--adm-border)] bg-[var(--adm-surface2)]">
                    <div className="w-full h-full flex items-center justify-center opacity-20"><Package size={24} /></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--adm-text)]">{selectedOrder.items[0]?.productName || 'Custom Design'}</h3>
                    <p className="text-xs text-[var(--adm-teal)] font-black uppercase tracking-widest mt-1">
                      {selectedOrder.items.reduce((q: number, i: any) => q + i.quantity, 0)} Units • {selectedOrder.items[0]?.variantId || 'Standard'}
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
                    Placed: {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                      <div className="text-center hidden sm:block">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${step.active ? 'text-[var(--adm-text)]' : 'text-[var(--adm-text-dim)]'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-[var(--adm-surface)] border border-[var(--adm-border)] p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--adm-border)]">
                    <MapPin className="text-[var(--adm-teal)]" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--adm-text)]">Customer & Shipping</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold mb-1">Name</p>
                      <p className="text-sm font-semibold text-[var(--adm-text)]">{selectedOrder.shippingAddress?.name || selectedOrder.userId?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold mb-1">Contact</p>
                      <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress?.email || selectedOrder.userId?.email}</p>
                      <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress?.phone}</p>
                    </div>
                    {selectedOrder.shippingAddress?.line1 && (
                      <div>
                        <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold mb-1">Address</p>
                        <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress.line1}</p>
                        {selectedOrder.shippingAddress.line2 && <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress.line2}</p>}
                        <p className="text-sm text-[var(--adm-text-sub)]">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Finance Details */}
                <div className="bg-[var(--adm-surface)] border border-[var(--adm-border)] p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--adm-border)]">
                    <CreditCard className="text-[var(--adm-teal)]" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--adm-text)]">Financials</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold">Total Quote</p>
                      <p className="text-lg font-black text-[var(--adm-text)]">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold">Amount Paid</p>
                      <p className="text-sm font-bold text-[var(--adm-teal)]">₹{(selectedOrder.paidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[var(--adm-border)]">
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold">Payment Status</p>
                      <span className={`adm-badge ${selectedOrder.paymentStatus || 'pending'}`}>
                        {(selectedOrder.paymentStatus || 'pending').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div className="mt-6 pt-4 border-t border-[var(--adm-border)]">
                      <p className="text-[10px] text-[var(--adm-text-dim)] uppercase tracking-widest font-bold mb-2">Special Instructions</p>
                      <p className="text-sm text-[var(--adm-text-sub)] bg-[var(--adm-surface2)] p-3 rounded-lg border border-[var(--adm-border)]">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
