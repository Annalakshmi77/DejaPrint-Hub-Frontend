import { useState } from 'react'
import { Search, Download, Eye, FileText, Filter, Receipt, CreditCard, Clock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

// Mock data
const mockInvoices = [
  {
    id: '1',
    invoice_number: 'INV-2024-001',
    order_number: 'PC-ABC123',
    amount: 2999,
    status: 'paid',
    due_date: '2024-02-15',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    invoice_number: 'INV-2024-002',
    order_number: 'PC-DEF456',
    amount: 5499,
    status: 'paid',
    due_date: '2024-02-12',
    created_at: '2024-01-12',
  },
  {
    id: '3',
    invoice_number: 'INV-2024-003',
    order_number: 'PC-GHI789',
    amount: 8500,
    status: 'pending',
    due_date: '2024-02-20',
    created_at: '2024-01-18',
  },
  {
    id: '4',
    invoice_number: 'INV-2024-004',
    order_number: 'PC-JKL012',
    amount: 3200,
    status: 'overdue',
    due_date: '2024-01-25',
    created_at: '2024-01-10',
  },
]

function Invoices() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      invoice.order_number.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPaid = mockInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0)
  const totalPending = mockInvoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="adm-page-header">
        <div className="adm-page-label">Financial Records</div>
        <h1 className="adm-page-title">Invoices & Billing</h1>
        <p className="adm-page-sub">Access your transaction history, download invoices, and manage pending payments.</p>
      </div>

      {/* KPI Style Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Total Invoices</p>
            <p className="adm-kpi-value">{mockInvoices.length}</p>
          </div>
          <div className="adm-kpi-icon teal"><Receipt size={22} /></div>
        </div>
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Total Paid</p>
            <p className="adm-kpi-value">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="adm-kpi-icon teal"><CreditCard size={22} /></div>
        </div>
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Pending Total</p>
            <p className="adm-kpi-value">₹{totalPending.toLocaleString()}</p>
          </div>
          <div className="adm-kpi-icon teal"><Clock size={22} /></div>
        </div>
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Overdue Items</p>
            <p className="adm-kpi-value text-red-500">{mockInvoices.filter(i => i.status === 'overdue').length}</p>
          </div>
          <div className="adm-kpi-icon teal"><AlertTriangle size={22} className="text-red-500" /></div>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-box flex-1">
          <Search />
          <input 
            type="text" 
            placeholder="Search by invoice or order number..." 
            className="adm-toolbar-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="adm-toolbar-input min-w-[150px] bg-[var(--adm-surface2)]"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="adm-icon-btn"><Filter size={16} /></button>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Reference Order</th>
              <th>Billed Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <span className="font-bold text-[var(--adm-text)]">{invoice.invoice_number}</span>
                  </td>
                  <td>
                    <span className="text-xs text-[var(--adm-teal)] font-black uppercase">{invoice.order_number}</span>
                  </td>
                  <td>
                    <span className="text-[var(--adm-text-sub)] text-xs">{new Date(invoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </td>
                  <td>
                    <span className="text-[var(--adm-text-sub)] text-xs">{new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </td>
                  <td>
                    <span className={`adm-badge ${
                      invoice.status === 'paid' ? 'completed' : 
                      invoice.status === 'pending' ? 'processing' : 'inactive'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-bold text-[var(--adm-text)]">₹{invoice.amount.toLocaleString()}</span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="adm-action-btn" title="View PDF"><Eye size={14} /></button>
                      <button 
                        className="adm-action-btn" 
                        title="Download"
                        onClick={() => toast.success(`Downloading ${invoice.invoice_number}...`)}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-20 opacity-30 italic">
                  No matching invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Invoices

