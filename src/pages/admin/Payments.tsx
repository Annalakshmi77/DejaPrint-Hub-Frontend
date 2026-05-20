import { useState, useEffect } from 'react';
import { Search, Filter, CreditCard, Download, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockPayments = [
      { id: '1', orderId: 'ORD-001', customer: 'John Doe', amount: 5000, date: new Date(), method: 'Razorpay', status: 'paid' },
      { id: '2', orderId: 'ORD-002', customer: 'Jane Smith', amount: 7500, date: new Date(), method: 'Bank Transfer', status: 'paid' },
      { id: '3', orderId: 'ORD-003', customer: 'Robert Fox', amount: 3200, date: new Date(), method: 'Razorpay', status: 'unpaid' },
    ];
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Syncing financial records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="adm-page-header">
        <div className="adm-page-label">Finance</div>
        <h1 className="adm-page-title">Payment Transactions</h1>
        <p className="adm-page-sub">Monitor all incoming payments, transaction fees, and payout status.</p>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input type="text" placeholder="Search by transaction, order, or customer..." className="adm-toolbar-input" />
        </div>
        <button className="adm-icon-btn" title="Export CSV">
          <Download size={16} />
        </button>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Transaction Date</th>
              <th>Gateway</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(pay => (
              <tr key={pay.id}>
                <td><span className="font-bold text-[var(--adm-text)]">{pay.orderId}</span></td>
                <td><p className="font-semibold text-[var(--adm-text)]">{pay.customer}</p></td>
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--adm-text-sub)]">
                    <Calendar size={12} />
                    {pay.date.toLocaleDateString()}
                  </div>
                </td>
                <td><span className="text-xs uppercase tracking-wider text-[var(--adm-text-sub)]">{pay.method}</span></td>
                <td><p className="font-black text-[var(--adm-teal-lt)]">₹{pay.amount.toLocaleString()}</p></td>
                <td>
                  <span className={`adm-badge ${pay.status}`}>
                    {pay.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="adm-action-btn"><Download size={14} /></button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
