import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Ticket, Check, XCircle } from 'lucide-react';
import { toast } from '../../utils/toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage', // or fixed
    value: 0,
    minCartValue: 0,
    maxUses: 0,
    expiry: ''
  });

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/admin/coupons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const payload = { ...formData };
      if (!payload.expiry) delete payload.expiry; // Send null/undefined if empty
      
      await axios.post(`${apiUrl}/api/admin/coupons`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Coupon created successfully');
      setShowModal(false);
      setFormData({ code: '', type: 'percentage', value: 0, minCartValue: 0, maxUses: 0, expiry: '' });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create coupon');
    }
  };

  return (
    <>
      <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Discount Coupons</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage promotional codes.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'filter 0.2s' }}
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Code</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Discount</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Min Value</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Uses</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Expiry</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : coupons.length > 0 ? coupons.map((coupon) => (
              <tr key={coupon._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ticket size={16} color="var(--accent-orange)" /> {coupon.code}
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                </td>
                <td style={{ padding: '1rem' }}>₹{coupon.minCartValue || 0}</td>
                <td style={{ padding: '1rem' }}>{coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}</td>
                <td style={{ padding: '1rem', color: coupon.expiry && new Date(coupon.expiry) < new Date() ? '#ef4444' : 'var(--text-muted)' }}>
                  {coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : 'Never'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(coupon._id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No coupons created yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: '500px', background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Create Coupon</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Coupon Code *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER25" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Discount Type *</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', outline: 'none' }}>
                    <option value="percentage" style={{ background: '#1f2937' }}>Percentage (%)</option>
                    <option value="fixed" style={{ background: '#1f2937' }}>Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Value *</label>
                  <input required type="number" min="1" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Max Uses (0 = unlimited)</label>
                  <input type="number" min="0" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: Number(e.target.value)})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Min Cart Value (₹)</label>
                  <input type="number" min="0" value={formData.minCartValue} onChange={e => setFormData({...formData, minCartValue: Number(e.target.value)})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Expiry Date (Optional)</label>
                <input type="date" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', colorScheme: 'dark' }} />
              </div>

              <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '1rem', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Create Coupon</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Coupons;
