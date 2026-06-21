import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { IndianRupee, ShoppingCart, Clock, Users, Percent, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from '../../utils/toast';

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'];

// --- Subcomponents ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderRadius: '12px', background: 'var(--panel-bg)' }}>
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'normal' }}>{title}</h3>
      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>{value}</div>
    </div>
    <div style={{ background: `${color}22`, padding: '0.75rem', borderRadius: '12px', color: color }}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { adminUser } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      revenueToday: 0,
      revenueThisMonth: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalCustomers: 0,
      conversionRate: 0
    },
    charts: {
      revenueData: [],
      salesData: [],
      pieData: []
    },
    activityFeed: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/admin/data/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading Dashboard Data...</div>;
  }

  const { stats, charts, activityFeed } = data;

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, {adminUser?.email}. Here's what's happening today.
        </p>
      </div>

      {/* --- Cards Section --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Revenue Today" value={`₹${stats.revenueToday.toLocaleString()}`} icon={<IndianRupee size={24} />} color="#10b981" />
        <StatCard title="Revenue This Month" value={`₹${stats.revenueThisMonth.toLocaleString()}`} icon={<IndianRupee size={24} />} color="#3b82f6" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={24} />} color="#f59e0b" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock size={24} />} color="#f43f5e" />
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={24} />} color="#8b5cf6" />
        <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={<Percent size={24} />} color="#06b6d4" />
      </div>

      {/* --- Charts Section --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Revenue Graph */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--panel-bg)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#f59e0b" /> Revenue Graph (Last 7 Days)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            {charts.revenueData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={charts.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>No revenue data</div>
            )}
          </div>
        </div>

        {/* Sales Graph */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--panel-bg)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={18} color="#3b82f6" /> Sales Volume (Weekly)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
             {charts.salesData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={charts.salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>No sales data</div>
             )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--panel-bg)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={18} color="#10b981" /> Top Selling Products
          </h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
            {charts.pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={charts.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {charts.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', width: '100%' }}>No product data</div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--panel-bg)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#8b5cf6" /> Recent Activity Feed
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {activityFeed.length > 0 ? activityFeed.map((activity) => (
              <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={`https://minotar.net/helm/${activity.user}/40.png`} alt={activity.user} style={{ borderRadius: '50%', width: '32px', height: '32px', imageRendering: 'pixelated' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{activity.user}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {activity.action}
                    <span style={{
                      padding: '0.1rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background: activity.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : activity.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: activity.status === 'completed' ? '#10b981' : activity.status === 'pending' ? '#f59e0b' : '#ef4444'
                    }}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
               <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No recent activity</div>
            )}
          </div>
          
          <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: '8px', marginTop: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.target.style.background='rgba(255,255,255,0.05)'; e.target.style.color='#fff'}} onMouseOut={e => {e.target.style.background='transparent'; e.target.style.color='var(--text-muted)'}}>
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
