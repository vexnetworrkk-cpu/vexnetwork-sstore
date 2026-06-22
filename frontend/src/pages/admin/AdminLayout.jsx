import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, PackageOpen, CreditCard, Ticket, Gift, Bell, Star, Zap } from 'lucide-react';
import { CiLogout } from "react-icons/ci";
import axios from 'axios';
import { toast } from '../../utils/toast';

const AdminLayout = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/user/admin/login');
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminUser(res.data);
      } catch (err) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/user/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/user/admin/login');
  };

  if (loading) {
    return <div className="container flex-center" style={{ minHeight: '100vh' }}>Loading Admin Portal...</div>;
  }

  const role = adminUser?.role || 'staff';

  const menuItems = [
    { name: 'Dashboard', path: '/user/admin/dashboard', icon: <LayoutDashboard size={20} />, roles: ['owner', 'dev', 'staff'] },
    { name: 'Orders', path: '/user/admin/orders', icon: <ShoppingCart size={20} />, roles: ['owner', 'dev', 'staff'] },
    { name: 'Store Editor', path: '/user/admin/products', icon: <PackageOpen size={20} />, roles: ['owner', 'dev'] },
    { name: 'Featured Packages', path: '/user/admin/featured', icon: <Star size={20} />, roles: ['owner', 'dev'] },
    { name: 'Customers', path: '/user/admin/customers', icon: <Users size={20} />, roles: ['owner', 'dev'] },
    { name: 'Payments', path: '/user/admin/payments', icon: <CreditCard size={20} />, roles: ['owner'] },
    { name: 'Coupons', path: '/user/admin/coupons', icon: <Ticket size={20} />, roles: ['owner', 'dev'] },
    { name: 'Gift Cards', path: '/user/admin/giftcards', icon: <Gift size={20} />, roles: ['owner', 'dev'] },
    { name: 'Announcements', path: '/user/admin/announcements', icon: <Bell size={20} />, roles: ['owner', 'dev', 'staff'] },
    { name: 'Flash Sale', path: '/user/admin/flash-sale', icon: <Zap size={20} />, roles: ['owner', 'dev'] }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '250px', 
        background: 'var(--panel-bg)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0'
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent-orange)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>VexNetwork</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
              {role} Portal
            </span>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', marginTop: '-6px' }} title="Logout" onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <CiLogout size={26} />
            </button>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {menuItems.map((item) => {
            if (!item.roles.includes(role)) return null;
            
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'var(--panel-hover)' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-orange)' : 'inherit' }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
        <Outlet context={{ adminUser }} />
      </main>
    </div>
  );
};

export default AdminLayout;
