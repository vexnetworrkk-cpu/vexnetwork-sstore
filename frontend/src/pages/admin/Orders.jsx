import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { IndianRupee, RefreshCw, Send, CheckCircle, XCircle, Search, Eye } from 'lucide-react';
import { toast } from '../../utils/toast';

const Orders = () => {
  const { adminUser } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/orders?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleAction = async (orderId, actionType) => {
    const token = localStorage.getItem('admin_token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      if (actionType === 'mark_delivered') {
        await axios.put(`${apiUrl}/api/admin/orders/${orderId}/delivery`, { status: 'delivered' }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Order marked as delivered");
      }
      else if (actionType === 'resend') {
        const res = await axios.post(`${apiUrl}/api/admin/orders/${orderId}/resend`, {}, { headers: { Authorization: `Bearer ${token}` } });
        toast.success(res.data.message || "Delivery commands resent to server");
      }
      
      // Refresh list
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to perform action`);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'paid') return <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>PAID</span>;
    if (status === 'failed') return <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>FAILED</span>;
    if (status === 'refunded') return <span style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>REFUNDED</span>;
    return <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>PENDING</span>;
  };

  const getDeliveryBadge = (status) => {
    if (status === 'delivered') return <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>DELIVERED</span>;
    if (status === 'failed') return <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>FAILED</span>;
    return <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>PENDING</span>;
  };

  const filteredOrders = orders.filter(o => 
    o.username.toLowerCase().includes(search.toLowerCase()) || 
    o.orderId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading Orders...</div>;
  }

  return (
    <>
      <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Order Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and manage customer orders and deliveries.</p>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search by username or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Product</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Payment</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Delivery</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map((order) => {
              
              let productText = '-';
              if (order.cartItems && order.cartItems.length > 0) {
                productText = order.cartItems.map(item => item.name).join(', ');
              } else if (order.packageId && order.packageId.name) {
                productText = order.packageId.name;
              }

              return (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', fontFamily: 'monospace' }}>{order.orderId.substring(0, 8)}...</td>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={`https://minotar.net/helm/${order.username}/32.png`} alt={order.username} style={{ borderRadius: '4px', width: '24px', height: '24px' }} />
                    <span style={{ fontWeight: 'bold' }}>{order.username}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {productText}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.amount}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(order.status)}</td>
                  <td style={{ padding: '1rem' }}>{getDeliveryBadge(order.deliveryStatus || 'pending')}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    
                    <button 
                      title="View Details"
                      onClick={() => setSelectedOrder(order)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: '0.2rem' }}>
                      <Eye size={18} />
                    </button>

                    <button 
                      title="Mark Delivered"
                      disabled={order.deliveryStatus === 'delivered'}
                      onClick={() => handleAction(order._id, 'mark_delivered')}
                      style={{ background: 'transparent', border: 'none', color: order.deliveryStatus === 'delivered' ? '#333' : 'var(--accent-green)', cursor: order.deliveryStatus === 'delivered' ? 'not-allowed' : 'pointer', padding: '0.2rem' }}>
                      <CheckCircle size={18} />
                    </button>

                    <button 
                      title="Resend Delivery"
                      disabled={order.status !== 'paid'}
                      onClick={() => handleAction(order._id, 'resend')}
                      style={{ background: 'transparent', border: 'none', color: order.status !== 'paid' ? '#333' : 'var(--accent-orange)', cursor: order.status !== 'paid' ? 'not-allowed' : 'pointer', padding: '0.2rem' }}>
                      <Send size={18} />
                    </button>

                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'var(--panel-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{ 
              padding: '0.5rem 1rem', background: currentPage === 1 ? 'transparent' : 'rgba(255,255,255,0.05)', 
              color: currentPage === 1 ? 'var(--text-muted)' : '#fff', border: '1px solid var(--border-color)', 
              borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' 
            }}
          >
            Previous
          </button>
          
          <div style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>
            Page <span style={{ color: '#fff' }}>{currentPage}</span> of <span style={{ color: '#fff' }}>{totalPages}</span>
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{ 
              padding: '0.5rem 1rem', background: currentPage === totalPages ? 'transparent' : 'rgba(255,255,255,0.05)', 
              color: currentPage === totalPages ? 'var(--text-muted)' : '#fff', border: '1px solid var(--border-color)', 
              borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' 
            }}
          >
            Next
          </button>
        </div>
      )}

      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-up" style={{ width: '90%', maxWidth: '600px', background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <XCircle size={24} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order ID</label>
                <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{selectedOrder.orderId}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Purchase Date</label>
                <div style={{ fontWeight: 'bold' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Customer</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <img src={`https://minotar.net/helm/${selectedOrder.username}/24.png`} alt="" style={{ borderRadius: '4px' }} />
                  {selectedOrder.username}
                </div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Amount</label>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>₹{selectedOrder.amount}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Status</label>
                <div style={{ marginTop: '0.25rem' }}>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Delivery Status</label>
                <div style={{ marginTop: '0.25rem' }}>{getDeliveryBadge(selectedOrder.deliveryStatus || 'pending')}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Items Purchased</h3>
            <ul style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', listStyle: 'none' }}>
              {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
                selectedOrder.cartItems.map((item, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: i !== selectedOrder.cartItems.length -1 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 'bold' }}>₹{item.price}</span>
                  </li>
                ))
              ) : selectedOrder.packageId ? (
                <li style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{selectedOrder.packageId.name}</span>
                  <span style={{ fontWeight: 'bold' }}>₹{selectedOrder.packageId.price}</span>
                </li>
              ) : (
                <li>Unknown Item</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
