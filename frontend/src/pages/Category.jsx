import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import coinImg from '../assets/coin.png';
import rank1Img from '../assets/rank (1).png';
import rank2Img from '../assets/rank (2).png';
import PackageCard from '../components/PackageCard';
import { toast } from '../utils/toast';

const Category = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/packages/category/${categoryId}`);
        setPackages(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category packages:', err);
        setLoading(false);
      }
    };

    fetchPackages();
  }, [categoryId]);

  const handlePurchase = async (pkgId) => {
    const username = localStorage.getItem('mc_username');
    if (!username) {
      toast.error('Please login to add to cart!');
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

  const getCategoryTitle = () => {
    switch (categoryId) {
      case 'lifesteal-coin': return 'Coins [LifeSteal]';
      case 'lifesteal-rank': return 'Lifesteal Ranks';
      case 'survival-coin': return 'Coins [Survival]';
      case 'survival-rank': return 'Survival Ranks';
      default: return categoryId;
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Main Content Layout */}
      <section className="container home-layout">
        
        {/* Sidebar */}
        <aside className="home-sidebar">
          <div className="sidebar-panel">
            <div className="sidebar-header">SELECT A CATEGORY</div>
            <Link to="/category/lifesteal-coin" style={{ textDecoration: 'none' }}>
              <div className={`sidebar-item ${categoryId === 'lifesteal-coin' ? 'active' : ''}`}>
                <img src={coinImg} alt="Coins" /> Coins [LifeSteal]
              </div>
            </Link>
            <Link to="/category/lifesteal-rank" style={{ textDecoration: 'none' }}>
              <div className={`sidebar-item ${categoryId === 'lifesteal-rank' ? 'active' : ''}`}>
                <img src={rank1Img} alt="Lifesteal Rank" /> Lifesteal Ranks
              </div>
            </Link>
            <Link to="/category/survival-coin" style={{ textDecoration: 'none' }}>
              <div className={`sidebar-item ${categoryId === 'survival-coin' ? 'active' : ''}`}>
                <img src={coinImg} alt="Coins" /> Coins [Survival]
              </div>
            </Link>
            <Link to="/category/survival-rank" style={{ textDecoration: 'none' }}>
              <div className={`sidebar-item ${categoryId === 'survival-rank' ? 'active' : ''}`}>
                <img src={rank2Img} alt="Survival Rank" /> Survival Ranks
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flexGrow: 1, width: '100%' }}>
          <div className="content-panel" style={{ padding: '1.5rem' }}>
            <div className="panel-header">{getCategoryTitle()} PACKAGES</div>
            
            {loading ? (
              <p>Loading packages...</p>
            ) : packages.length === 0 ? (
              <p>No packages found in this category.</p>
            ) : (
              <div className="tebex-grid">
                {packages.map(pkg => (
                  <PackageCard key={pkg._id} pkg={pkg} onPurchase={handlePurchase} />
                ))}
              </div>
            )}
          </div>
        </main>
      </section>
    </div>
  );
};

export default Category;
