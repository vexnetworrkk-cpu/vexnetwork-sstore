import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Eye, XCircle, Mail, DollarSign, Package } from 'lucide-react';
import { toast } from '../../utils/toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Profile Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [notesEdit, setNotesEdit] = useState('');

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openProfile = async (username) => {
    setSelectedCustomer(username);
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/customers/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerProfile(res.data);
      setNotesEdit(res.data.profile.notes || '');
    } catch (err) {
      toast.error('Failed to load profile');
      setSelectedCustomer(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/admin/customers/${customerProfile.profile._id}/notes`, { notes: notesEdit }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notes updated successfully');
      setCustomerProfile(prev => ({
        ...prev,
        profile: { ...prev.profile, notes: notesEdit }
      }));
    } catch (err) {
      toast.error('Failed to save notes');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.username.toLowerCase().includes(search.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading Customers...</div>;

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Customers</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage user profiles, purchase history, and store credits.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" placeholder="Search by username or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Username</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Spend</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Orders</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? filteredCustomers.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
                  <img src={`https://minotar.net/helm/${user.username}/32.png`} alt={user.username} style={{ borderRadius: '4px', width: '24px', height: '24px' }} />
                  {user.username}
                </td>
                <td style={{ padding: '1rem', color: user.email ? '#fff' : 'var(--text-muted)' }}>{user.email || 'No email provided'}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>₹{user.totalSpend || 0}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {user.orderCount}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => openProfile(user.username)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <Eye size={18} /> View Profile
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div className="animate-slide-left" style={{ width: '100%', maxWidth: '500px', height: '100vh', background: 'var(--bg-color)', borderLeft: '1px solid var(--border-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--panel-bg)' }}>
              {loadingProfile ? <h3>Loading Profile...</h3> : (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={`https://minotar.net/helm/${selectedCustomer}/64.png`} alt={selectedCustomer} style={{ borderRadius: '8px', width: '64px', height: '64px', border: '2px solid var(--accent-orange)' }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedCustomer}</h2>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      <Mail size={14} /> {customerProfile?.profile?.email || 'No Email'}
                    </span>
                  </div>
                </div>
              )}
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <XCircle size={24} />
              </button>
            </div>

            {!loadingProfile && customerProfile && (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <DollarSign size={24} color="var(--accent-orange)" style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spend</span>
                    <strong style={{ fontSize: '1.2rem' }}>₹{customerProfile.profile.totalSpend || 0}</strong>
                  </div>
                  <div style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Package size={24} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</span>
                    <strong style={{ fontSize: '1.2rem' }}>{customerProfile.history.filter(o => o.status === 'paid').length}</strong>
                  </div>
                </div>

                {/* Active Ranks */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Active Ranks</h3>
                  {customerProfile.profile.activeRanks?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {customerProfile.profile.activeRanks.map((rank, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem' }}>{rank}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No active ranks.</p>
                  )}
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Admin Notes</h3>
                  <textarea 
                    value={notesEdit} 
                    onChange={e => setNotesEdit(e.target.value)}
                    placeholder="Add private notes about this customer..."
                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', resize: 'vertical', minHeight: '100px', marginBottom: '0.5rem' }}
                  />
                  <button onClick={handleSaveNotes} style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
                    Save Notes
                  </button>
                </div>

                {/* Purchase History */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Purchase History</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {customerProfile.history.length > 0 ? customerProfile.history.map(order => (
                      <div key={order._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {order.isCartCheckout ? `Cart Checkout (${order.cartItems.length} items)` : (order.packageId?.name || 'Unknown Package')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()} • {order.orderId}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                          <strong style={{ color: order.status === 'paid' ? '#10b981' : (order.status === 'failed' ? '#ef4444' : 'var(--text-muted)') }}>
                            ₹{order.amount}
                          </strong>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.1rem 0.4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No purchase history found.</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
