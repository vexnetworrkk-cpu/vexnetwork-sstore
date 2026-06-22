import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PackageCard from '../components/PackageCard';
import { toast } from '../utils/toast';

const Store = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/packages`);
        setPackages(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages', err);
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (pkgId) => {
    const username = localStorage.getItem('mc_username');
    if (!username) {
      toast.error('Please login first to add items to your cart');
      window.dispatchEvent(new Event('openLogin'));
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/cart/${username}/add`, { packageId: pkgId });
      window.dispatchEvent(new Event('openCart'));
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="container flex-center" style={{ height: '50vh' }}><h2 className="animate-fade-up">Loading Store...</h2></div>;
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Server Ranks</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Support the server and get amazing in-game perks. Purchases are automatically credited within 5 minutes.
        </p>
      </div>

      <div className="tebex-grid">
        {packages.map((pkg) => (
          <PackageCard key={pkg._id} pkg={pkg} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
};

export default Store;
