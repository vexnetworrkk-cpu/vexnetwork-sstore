import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, XCircle, Clock, CalendarDays, Calendar } from 'lucide-react';
import { toast } from '../../utils/toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ successful: 0, failed: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // all, today, week, month

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/payments?timeframe=${timeframe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data.payments);
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [timeframe]);

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Payments Ledger</h1>
          <p style={{ color: 'var(--text-muted)' }}>View successful and failed transactions.</p>
        </div>
        
        {/* Filter Tabs */}
        <div style={{ display: 'flex', background: 'var(--panel-bg)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'today', label: 'Today', icon: <Clock size={14} /> },
            { id: 'week', label: 'This Week', icon: <CalendarDays size={14} /> },
            { id: 'month', label: 'This Month', icon: <Calendar size={14} /> },
            { id: 'all', label: 'All Time', icon: <CreditCard size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', background: timeframe === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', borderRadius: '6px', color: timeframe === tab.id ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', fontWeight: timeframe === tab.id ? 'bold' : 'normal', transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <CheckCircle size={18} color="#10b981" /> Successful Payments
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.successful}</h2>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <XCircle size={18} color="#ef4444" /> Failed / Refunded
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.failed}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <CreditCard size={18} color="var(--accent-orange)" /> Total Collected
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--accent-orange)' }}>₹{stats.totalAmount}</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Username</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Transaction ID (Razorpay)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : payments.length > 0 ? payments.map((payment) => (
              <tr key={payment._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{payment.username}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{payment.amount}</td>
                <td style={{ padding: '1rem' }}>
                  {payment.status === 'paid' && <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>SUCCESS</span>}
                  {(payment.status === 'failed' || payment.status === 'refunded') && <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>FAILED</span>}
                  {payment.status === 'created' && <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>PENDING</span>}
                </td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {payment.paymentId || 'N/A'}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found for this timeframe.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Payments;
