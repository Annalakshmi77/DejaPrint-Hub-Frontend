import { useState, useEffect } from 'react';
import { Search, Filter, FileText, Send, Clock, CheckCircle2, Download } from 'lucide-react';

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockQuotes = [
      { id: '1', quoteNo: 'QT-2024-001', customer: 'Vogue Magazine', type: 'Bulk Notebooks', qty: 500, amount: 85000, date: new Date(), status: 'sent' },
      { id: '2', quoteNo: 'QT-2024-002', customer: 'Tech Corp', type: 'Custom Calendars', qty: 1000, amount: 150000, date: new Date(), status: 'pending' },
      { id: '3', quoteNo: 'QT-2024-003', customer: 'Global Schools', type: 'Student Diaries', qty: 2000, amount: 280000, date: new Date(), status: 'completed' },
    ];
    setTimeout(() => {
      setQuotations(mockQuotes);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Drafting quotations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="adm-page-header">
        <div className="adm-page-label">Sales</div>
        <h1 className="adm-page-title">Bulk Quotations</h1>
        <p className="adm-page-sub">Review custom requests, send pricing estimates, and track quote approvals.</p>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input type="text" placeholder="Search by quote # or customer..." className="adm-toolbar-input" />
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Client</th>
              <th>Request Details</th>
              <th>Est. Value</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q.id}>
                <td><span className="font-bold text-[var(--adm-text)]">{q.quoteNo}</span></td>
                <td><p className="font-semibold text-[var(--adm-text)]">{q.customer}</p></td>
                <td>
                  <div>
                    <p className="text-sm">{q.type}</p>
                    <p className="sub-text">Volume: {q.qty} units</p>
                  </div>
                </td>
                <td><p className="font-black text-[var(--adm-teal-lt)]">₹{q.amount.toLocaleString()}</p></td>
                <td>
                  <span className={`adm-badge ${q.status}`}>
                    {q.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex items-center justify-end gap-2">
                    <button className="adm-action-btn"><Send size={14} /></button>
                    <button className="adm-action-btn"><Download size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
