import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Gift, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '../../utils/toast';

const GiftCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/giftcards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(res.data);
    } catch (err) {
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleGenerate = async (amount) => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/admin/giftcards/generate`, { amount }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`₹${amount} Gift Card Generated!`);
      fetchCards();
    } catch (err) {
      toast.error('Failed to generate gift card');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gift card?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/admin/giftcards/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Gift Card deleted');
      fetchCards();
    } catch (err) {
      toast.error('Failed to delete gift card');
    }
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Gift Cards</h1>
          <p style={{ color: 'var(--text-muted)' }}>Generate store credit codes to give away to players.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {[100, 500, 1000].map(amt => (
          <button 
            key={amt}
            onClick={() => handleGenerate(amt)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-orange)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Gift size={32} color="var(--accent-orange)" />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Generate ₹{amt}</span>
          </button>
        ))}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Custom Amount</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="number" min="1" value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="₹ Amount" style={{ flex: 1, padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }} />
            <button onClick={() => { if(customAmount > 0) handleGenerate(customAmount); }} style={{ padding: '0.5rem 1rem', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Create</button>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Gift Code</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Value</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Created</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : cards.length > 0 ? cards.map((card) => (
              <tr key={card._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '1.1rem' }}>
                  {card.code}
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  ₹{card.amount}
                </td>
                <td style={{ padding: '1rem' }}>
                  {card.status === 'active' && <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={14} /> Active</span>}
                  {card.status === 'used' && <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> Used</span>}
                  {card.status === 'expired' && <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={14} /> Expired</span>}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(card.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(card._id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No gift cards generated yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GiftCards;
