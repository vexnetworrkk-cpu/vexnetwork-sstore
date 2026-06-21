import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, PackageOpen } from 'lucide-react';
import { toast } from '../../utils/toast';

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(res.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const featuredCount = packages.filter(p => p.isFeatured).length;

  const toggleFeatured = async (pkg) => {
    if (!pkg.isFeatured && featuredCount >= 6) {
      return toast.error('You can only feature up to 6 packages!');
    }

    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const res = await axios.put(`${apiUrl}/api/admin/products/${pkg._id}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPackages(packages.map(p => p._id === pkg._id ? res.data : p));
      toast.success(res.data.isFeatured ? 'Added to featured!' : 'Removed from featured!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to toggle featured status');
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading Packages...</div>;

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Featured Packages</h1>
          <p style={{ color: 'var(--text-muted)' }}>Select up to 6 packages to highlight on the homepage.</p>
        </div>
        <div style={{ background: 'var(--panel-bg)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Star size={20} color={featuredCount === 6 ? 'var(--accent-red)' : 'var(--accent-orange)'} />
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase' }}>Featured Slots</span>
            <strong style={{ fontSize: '1.1rem', color: featuredCount === 6 ? 'var(--accent-red)' : '#fff' }}>{featuredCount} / 6</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {packages.map(pkg => (
          <div 
            key={pkg._id} 
            className="glass-panel"
            style={{ 
              padding: '1.5rem', 
              borderTop: `4px solid ${pkg.color || 'var(--accent-orange)'}`,
              opacity: pkg.active === false ? 0.6 : 1,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {pkg.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {pkg.category}
                </span>
              </div>
              <strong style={{ fontSize: '1.2rem', color: pkg.color || 'var(--accent-orange)' }}>₹{pkg.price}</strong>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '40px' }}>
              {pkg.description.substring(0, 80)}{pkg.description.length > 80 ? '...' : ''}
            </p>

            <button 
              onClick={() => toggleFeatured(pkg)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: pkg.isFeatured ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                background: pkg.isFeatured ? 'rgba(168,85,247,0.1)' : 'var(--panel-bg)',
                color: pkg.isFeatured ? '#fff' : 'var(--text-muted)',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              {pkg.isFeatured ? (
                <><CheckCircle size={18} color="var(--accent-orange)" /> Featured</>
              ) : (
                <><Star size={18} /> Add to Featured</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPackages;
