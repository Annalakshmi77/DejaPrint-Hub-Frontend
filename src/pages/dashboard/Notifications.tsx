import { useState } from 'react'
import { Bell, Package, FileText, CreditCard, Settings, Check, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order PC-ABC123 has been shipped and is on its way.',
    is_read: false,
    created_at: '2024-01-20T10:30:00',
  },
  {
    id: '2',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order PC-DEF456 has been confirmed and is being processed.',
    is_read: false,
    created_at: '2024-01-19T15:45:00',
  },
  {
    id: '3',
    type: 'quotation',
    title: 'New Quotation',
    message: 'A new quotation QT-XYZ123 has been created for your request.',
    is_read: true,
    created_at: '2024-01-18T09:00:00',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Received',
    message: 'We have received your payment of Rs. 5,499 for order PC-GHI789.',
    is_read: true,
    created_at: '2024-01-17T14:20:00',
  },
  {
    id: '5',
    type: 'system',
    title: 'Design Approved',
    message: 'Your design for order PC-JKL012 has been approved. Production will begin shortly.',
    is_read: false,
    created_at: '2024-01-16T11:00:00',
  },
]

const typeIcons: Record<string, React.ElementType> = {
  order: Package,
  quotation: FileText,
  payment: CreditCard,
  system: Settings,
}

function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.is_read
    return n.type === filter
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success('Notification deleted')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="adm-page-header flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="adm-page-label">Account Activity</div>
          <h1 className="adm-page-title">Notifications</h1>
          <p className="adm-page-sub">Stay updated with your orders, designs, and billing status.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="adm-icon-btn px-4 flex items-center gap-2">
              <Check size={16} />
              <span className="text-xs font-bold">Mark all read</span>
            </button>
          )}
          <button 
            onClick={() => setNotifications([])} 
            className="adm-icon-btn px-4 flex items-center gap-2 border-red-900/20 text-red-400 hover:bg-red-900/10"
          >
            <Trash2 size={16} />
            <span className="text-xs font-bold">Clear all</span>
          </button>
        </div>
      </div>

      <div className="adm-toolbar flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'unread', 'order', 'quotation', 'payment'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-[var(--adm-teal)] text-white shadow-lg shadow-teal-900/20' 
                : 'bg-[var(--adm-surface2)] text-[var(--adm-text-dim)] hover:text-[var(--adm-text)]'
            }`}
          >
            {f === 'all' ? `All (${notifications.length})` : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell
            return (
              <div 
                key={n.id}
                className={`adm-card p-6 border-[var(--adm-border)] flex gap-6 items-start transition-all hover:border-[var(--adm-teal)]/30 ${!n.is_read ? 'border-l-4 border-l-[var(--adm-teal)]' : 'opacity-70'}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-[var(--adm-surface2)] flex items-center justify-center shrink-0 ${!n.is_read ? 'text-[var(--adm-teal)]' : 'text-[var(--adm-text-dim)]'}`}>
                  <Icon size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[var(--adm-text)] text-lg">{n.title}</h3>
                    {!n.is_read && <span className="adm-badge pending">NEW</span>}
                  </div>
                  <p className="text-[var(--adm-text-sub)] mb-3 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 text-[var(--adm-text-dim)] text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.is_read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="adm-action-btn"
                      title="Mark as Read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="adm-action-btn hover:bg-red-900/10 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="adm-empty py-20">
            <Bell size={64} className="mx-auto mb-6 opacity-5" />
            <p className="text-[var(--adm-text-sub)] italic">Your notification center is clear.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
