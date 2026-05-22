import { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const CHART_COLORS = ['#2d8a9e', '#5cbdb9', '#e8a838', '#e05c5c', '#7aadba'];

export default function AdminDashboard() {
  const [stats] = useState<any>({
    kpis: [
      { label: 'Total Revenue', value: '₹4,25,000', icon: TrendingUp, color: 'teal', change: '+12.5%' },
      { label: 'Active Orders', value: '156', icon: ShoppingBag, color: 'teal', change: '+8.2%' },
      { label: 'New Customers', value: '42', icon: Users, color: 'teal', change: '+15.1%' },
      { label: 'Conversion Rate', value: '3.2%', icon: FileText, color: 'teal', change: '-2.4%' },
    ],
    recentOrders: [
      { name: 'Week 1', value: 400 },
      { name: 'Week 2', value: 300 },
      { name: 'Week 3', value: 600 },
      { name: 'Week 4', value: 800 },
      { name: 'Week 5', value: 500 },
      { name: 'Week 6', value: 900 },
    ],
    orderStatus: [
      { name: 'Completed', value: 45 },
      { name: 'Processing', value: 30 },
      { name: 'Pending', value: 15 },
      { name: 'Cancelled', value: 10 },
    ],
    monthlyData: [
      { month: 'Jan', orders: 65 },
      { month: 'Feb', orders: 59 },
      { month: 'Mar', orders: 80 },
      { month: 'Apr', orders: 81 },
      { month: 'May', orders: 56 },
      { month: 'Jun', orders: 55 },
    ]
  });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="adm-page-header">
        <div className="adm-page-label">Overview</div>
        <h1 className="adm-page-title">Executive Dashboard</h1>
        <p className="adm-page-sub">Comprehensive real-time analytics and production monitoring for PrintCraft.</p>
      </div>

      {/* KPI Grid */}
      <div className="adm-kpi-grid">
        {stats.kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="adm-kpi-card">
            <div>
              <p className="adm-kpi-label">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="adm-kpi-value">{kpi.value}</p>
                <span className={`text-[10px] font-bold ${kpi.change.startsWith('+') ? 'text-[#5cbdb9]' : 'text-[#e05c5c]'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <div className={`adm-kpi-icon ${kpi.color}`}>
              <kpi.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="adm-chart-grid">
        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">Production Volume Trends</h2>
          </div>
          <div className="adm-card-body">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={stats.recentOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--adm-text-sub)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="var(--adm-text-sub)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--adm-surface2)', 
                    border: '1px solid var(--adm-border)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'var(--adm-text)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--adm-teal)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--adm-teal)', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">Order Status Distribution</h2>
          </div>
          <div className="adm-card-body">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={stats.orderStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.orderStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--adm-surface2)', 
                    border: '1px solid var(--adm-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="adm-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">Monthly Comparison Analysis</h2>
        </div>
        <div className="adm-card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--adm-text-sub)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--adm-text-sub)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'var(--adm-surface2)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--adm-surface2)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="orders" fill="var(--adm-teal)" radius={[4, 4, 0, 0]} name="Monthly Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
