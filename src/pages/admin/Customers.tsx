import { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, MapPin, User as UserIcon, Building2 } from 'lucide-react';
import api from '../../services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: Date;
  city: string;
  status: 'active' | 'inactive';
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminCustomers(1, 100);
        const users = res.data.data.users;

        const mappedCustomers: Customer[] = users.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          company: u.company || '',
          totalOrders: 0,
          totalSpent: 0,
          joinDate: new Date(u.createdAt),
          city: u.addresses && u.addresses.length > 0 ? u.addresses[0].city : 'N/A',
          status: 'active',
        }));

        setCustomers(mappedCustomers);
        setFilteredCustomers(mappedCustomers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <span>Retrieving customer records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="adm-page-header">
        <div className="adm-page-label">Management</div>
        <h1 className="adm-page-title">Customers</h1>
        <p className="adm-page-sub">View and manage your verified customer base and their purchasing history.</p>
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
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
            <option value="all">All Status</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Customer Details</th>
              <th>Company</th>
              <th>Activity</th>
              <th>Location</th>
              <th>Member Since</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="adm-avatar" style={{ width: '36px', height: '36px' }}>
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--adm-text)]">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--adm-text-sub)]">
                        <span className="flex items-center gap-1"><Mail size={12} /> {customer.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-[var(--adm-text-sub)]">
                    <Building2 size={14} />
                    <span>{customer.company || 'Private Individual'}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="text-sm font-medium">{customer.totalOrders} Orders</p>
                    <p className="sub-text">Spent ₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-[var(--adm-text-sub)]">
                    <MapPin size={14} />
                    {customer.city}
                  </div>
                </td>
                <td>
                  <span className="text-[var(--adm-text-sub)]">{customer.joinDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </td>
                <td>
                  <span className={`adm-badge ${customer.status}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="adm-empty">
            <p>No customers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
