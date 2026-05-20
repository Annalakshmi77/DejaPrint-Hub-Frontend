import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Hash, 
  X, 
  Check, 
  Truck, 
  Printer, 
  FileSearch, 
  ArrowLeft, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.getOrderById(orderId!);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Opening Order Studio...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="adm-empty py-20">
        <Package size={48} className="mx-auto mb-4 opacity-10" />
        <p className="text-[var(--adm-text-sub)]">Order not found.</p>
        <button onClick={() => navigate('/dashboard/orders')} className="mt-4 text-[var(--adm-teal)] font-bold">Back to History</button>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', icon: Check, active: true, done: true },
    { label: 'Proof Review', icon: FileSearch, active: ['confirmed', 'designing', 'printing', 'dispatched', 'delivered'].includes(order.status), done: ['confirmed', 'designing', 'printing', 'dispatched', 'delivered'].includes(order.status) },
    { label: 'Printing', icon: Printer, active: ['printing', 'dispatched', 'delivered'].includes(order.status), done: ['printing', 'dispatched', 'delivered'].includes(order.status) },
    { label: 'Delivered', icon: Truck, active: order.status === 'delivered', done: order.status === 'delivered' }
  ];

  const getProgressWidth = () => {
    if (order.status === 'delivered') return '80%';
    if (order.status === 'printing') return '53%';
    if (['confirmed', 'designing'].includes(order.status)) return '26%';
    return '0%';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/orders')}
          className="flex items-center gap-2 text-[var(--adm-text-sub)] hover:text-[var(--adm-teal)] transition-colors text-sm font-bold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </button>
        <div className="text-right">
          <p className="text-[10px] text-[var(--adm-text-dim)] font-black uppercase tracking-widest">Inquiry Date</p>
          <p className="text-sm font-bold text-[var(--adm-text)]">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="adm-card overflow-hidden border-[var(--adm-border)] bg-[var(--adm-bg)] shadow-2xl">
        {/* Title Bar */}
        <div className="px-10 py-8 border-b border-[var(--adm-border)] bg-[var(--adm-surface)]/50 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--adm-teal)]/10 text-[var(--adm-teal)] flex items-center justify-center">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black text-[var(--adm-text)]">Order Tracking</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--adm-teal)] bg-[var(--adm-teal)]/5 px-3 py-1 rounded-full border border-[var(--adm-teal)]/10">
                  <Hash size={10} /> {order.orderNumber}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
              order.status === 'delivered' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 
              order.status === 'cancelled' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
              'bg-[var(--adm-teal)]/20 text-[var(--adm-teal)] border border-[var(--adm-teal)]/20'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            
            {/* Product Snapshot Card */}
            <div className="p-8 rounded-3xl bg-[var(--adm-surface)] border border-[var(--adm-border)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--adm-teal)]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:w-40 group-hover:h-40" />
              <div className="relative flex items-center gap-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--adm-border)] shadow-xl bg-[var(--adm-surface2)] shrink-0">
                   <div className="w-full h-full flex items-center justify-center opacity-20"><Package size={40} /></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-[var(--adm-text)]">{order.items[0]?.productName}</h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--adm-teal)]" />
                      <span className="text-xs text-[var(--adm-text-sub)] font-bold">{order.items.reduce((q: number, i: any) => q + i.quantity, 0)} Units</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--adm-teal)]/40" />
                      <span className="text-xs text-[var(--adm-text-sub)] font-bold capitalize">{order.items[0]?.variantId || 'Standard Inquiry'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="py-12 px-4">
              <div className="relative">
                {/* Background Line */}
                <div className="absolute top-[32px] left-[10%] right-[10%] h-[2px] bg-[var(--adm-border)]" />
                {/* Active Progress Line */}
                <div 
                  className="absolute top-[32px] left-[10%] h-[2px] bg-[var(--adm-teal)] transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                  style={{ width: getProgressWidth() }}
                />

                {/* Nodes */}
                <div className="relative flex justify-between px-[5%]">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-6 relative z-10 group">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                        step.done ? 'bg-[var(--adm-teal)] border-[var(--adm-teal)] text-white shadow-[0_0_20px_rgba(45,212,191,0.4)] scale-110' : 
                        step.active ? 'bg-[var(--adm-surface)] border-[var(--adm-teal)] text-[var(--adm-teal)] animate-pulse' : 
                        'bg-[var(--adm-surface)] border-[var(--adm-border)] text-[var(--adm-text-dim)]'
                      }`}>
                        <step.icon size={26} />
                      </div>
                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${step.active ? 'text-[var(--adm-text)]' : 'text-[var(--adm-text-dim)]'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--adm-teal)]/10 to-transparent border border-[var(--adm-teal)]/20 flex gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--adm-teal)]/20 flex items-center justify-center text-[var(--adm-teal)] shrink-0">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--adm-text)]">Production Notice</p>
                <p className="text-xs text-[var(--adm-text-sub)] leading-relaxed italic opacity-80">
                  Production timelines are estimated based on standard turnaround. Your specific configuration may vary. 
                  Please check your registered email for quotation and payment confirmations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
