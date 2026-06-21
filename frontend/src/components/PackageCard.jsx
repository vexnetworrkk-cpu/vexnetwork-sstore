import React, { useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import coinImg from '../assets/coin.png';
import rank1Img from '../assets/rank (1).png';
import rank2Img from '../assets/rank (2).png';
import PackageInfoModal from './PackageInfoModal';

const PackageCard = ({ pkg, onPurchase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine image based on category
  let imgSrc = coinImg;
  if (pkg.category === 'lifesteal-rank') imgSrc = rank1Img;
  if (pkg.category === 'survival-rank') imgSrc = rank2Img;
  
  return (
    <>
      <div className="tebex-card">
        <div className="tebex-card-img-wrapper" style={{ position: 'relative' }}>
          <img src={imgSrc} alt={pkg.name} className="tebex-card-img" style={{ opacity: pkg.active === false ? 0.5 : 1, filter: pkg.active === false ? 'grayscale(100%)' : 'none' }} />
          {pkg.active === false && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', zIndex: 10 }}>
              OUT OF STOCK
            </div>
          )}
        </div>
        <div className="tebex-card-content" style={{ opacity: pkg.active === false ? 0.7 : 1 }}>
          <h3 className="tebex-card-title">{pkg.name}</h3>
          <div className="tebex-card-price">{pkg.price} INR</div>
          <div className="tebex-card-actions">
            <button className="tebex-btn-info" title="Package Info" onClick={() => setIsModalOpen(true)}>
              <FaInfo />
            </button>
            <button 
              className="tebex-btn-cart" 
              onClick={() => onPurchase(pkg._id)}
              disabled={pkg.active === false}
              style={{
                background: pkg.active === false ? '#4b5563' : 'var(--accent-orange)',
                cursor: pkg.active === false ? 'not-allowed' : 'pointer'
              }}
            >
              {pkg.active === false ? 'OUT OF STOCK' : '+ Add to cart'}
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <PackageInfoModal 
          pkg={pkg} 
          imgSrc={imgSrc} 
          onClose={() => setIsModalOpen(false)} 
          onPurchase={onPurchase}
        />
      )}
    </>
  );
};

export default PackageCard;
