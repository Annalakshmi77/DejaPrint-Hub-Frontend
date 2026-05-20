import { useState, useEffect } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download, Calendar, Filter, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);

  const data = [
    { name: 'Week 1', sales: 4000, revenue: 2400 },
    { name: 'Week 2', sales: 3000, revenue: 1398 },
    { name: 'Week 3', sales: 2000, revenue: 9800 },
    { name: 'Week 4', sales: 2780, revenue: 3908 },
    { name: 'Week 5', sales: 1890, revenue: 4800 },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Generating analytical reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="adm-page-header">
        <div className="adm-page-label">Analytics</div>
        <h1 className="adm-page-title">Performance Reports</h1>
        <p className="adm-page-sub">Deep-dive into sales trends, customer behavior, and product performance metrics.</p>
      </div>

      {/* Stats Overview */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Conversion Rate</p>
            <p className="adm-kpi-value">3.4%</p>
          </div>
          <div className="adm-kpi-icon teal"><TrendingUp size={24} /></div>
        </div>
        <div className="adm-kpi-card">
          <div>
            <p className="adm-kpi-label">Avg. Order Value</p>
            <p className="adm-kpi-value">₹2,450</p>
          </div>
          <div className="adm-kpi-icon green"><FileText size={24} /></div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="adm-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">Sales vs Revenue Trend</h2>
          <button className="adm-icon-btn"><Download size={16} /></button>
        </div>
        <div className="adm-card-body">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d8a9e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2d8a9e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--adm-text-sub)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--adm-text-sub)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--adm-surface2)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'var(--adm-text)' }}
              />
              <Area type="monotone" dataKey="sales" stroke="var(--adm-teal)" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
            </AreaChart>

          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
