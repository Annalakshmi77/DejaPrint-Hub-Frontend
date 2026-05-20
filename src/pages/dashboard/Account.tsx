import { useState } from 'react'
import { User, Mail, Phone, Building, MapPin, Lock, Save, Loader2, ShieldCheck, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/utils/helpers'
import { toast } from 'sonner'

function Account() {
  const { user, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: user?.company_name || '',
  })
  const [addressData, setAddressData] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (user) {
        setUser({ ...user, ...profileData })
      }
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Address updated successfully')
    } catch {
      toast.error('Failed to update address')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password changed successfully')
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
    } catch {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="adm-page-header">
        <div className="adm-page-label">Identity & Security</div>
        <h1 className="adm-page-title">Account Settings</h1>
        <p className="adm-page-sub">Manage your personal details, shipping preferences, and security credentials.</p>
      </div>

      {/* Custom Tabs */}
      <div className="adm-toolbar flex gap-2">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'address', label: 'Address', icon: MapPin },
          { id: 'security', label: 'Security', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id
                ? 'bg-[var(--adm-teal)] text-white shadow-lg shadow-teal-900/20'
                : 'bg-[var(--adm-surface2)] text-[var(--adm-text-dim)] hover:text-[var(--adm-text)]'
              }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="adm-card p-8 border-[var(--adm-border)] bg-[var(--adm-surface)] shadow-2xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-[var(--adm-border)]">
              <div className="w-20 h-20 rounded-2xl bg-[var(--adm-teal)] flex items-center justify-center text-3xl font-serif text-white font-black shadow-xl shadow-teal-900/40">
                {getInitials(profileData.full_name || 'U')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--adm-text)]">Avatar & Branding</h2>
                <p className="text-sm text-[var(--adm-text-sub)]">Your initials will be used for your studio profile.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--adm-text-dim)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="adm-toolbar-input w-full pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--adm-text-dim)]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="adm-toolbar-input w-full pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--adm-text-dim)]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="adm-toolbar-input w-full pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--adm-text-dim)]">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                  <input
                    type="text"
                    value={profileData.company_name}
                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                    className="adm-toolbar-input w-full pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-[var(--adm-teal)] hover:bg-[var(--adm-teal-lt)] text-white font-black rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Update Profile
              </button>
            </div>
          </form>
        )}

        {activeTab === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-lg bg-[var(--adm-teal)]/10 flex items-center justify-center text-[var(--adm-teal)]">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold text-[var(--adm-text)]">Shipping Preferences</h2>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Address Line 1"
                className="adm-toolbar-input w-full"
                value={addressData.line1}
                onChange={(e) => setAddressData({ ...addressData, line1: e.target.value })}
              />
              <input
                placeholder="Address Line 2 (Optional)"
                className="adm-toolbar-input w-full"
                value={addressData.line2}
                onChange={(e) => setAddressData({ ...addressData, line2: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  className="adm-toolbar-input"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                />
                <input
                  placeholder="State"
                  className="adm-toolbar-input"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                />
                <input
                  placeholder="Postal Code"
                  className="adm-toolbar-input"
                  value={addressData.postal_code}
                  onChange={(e) => setAddressData({ ...addressData, postal_code: e.target.value })}
                />
                <input
                  placeholder="Country"
                  className="adm-toolbar-input"
                  value={addressData.country}
                  onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-[var(--adm-teal)] hover:bg-[var(--adm-teal-lt)] text-white font-black rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Address
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-lg bg-[var(--adm-teal)]/10 flex items-center justify-center text-[var(--adm-teal)]">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold text-[var(--adm-text)]">Password Management</h2>
            </div>

            <div className="max-w-md space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                <input
                  type="password"
                  placeholder="Current Password"
                  className="adm-toolbar-input w-full pl-10"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                <input
                  type="password"
                  placeholder="New Password"
                  className="adm-toolbar-input w-full pl-10"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-text-dim)]" size={16} />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="adm-toolbar-input w-full pl-10"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-[var(--adm-teal)] hover:bg-[var(--adm-teal-lt)] text-white font-black rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Account
