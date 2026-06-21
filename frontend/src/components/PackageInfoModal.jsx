import React, { useState } from 'react';
import { FaTimes, FaGift } from 'react-icons/fa';

const PackageInfoModal = ({ pkg, imgSrc, onClose, onPurchase }) => {
  const [showToast, setShowToast] = useState(false);

  if (!pkg) return null;

  const info = pkg.infoDetails || { perks: [], commands: [], others: [], note: '' };

  const handleGiftClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      {showToast && (
        <div className="sexy-toast">
          <div className="toast-icon"><FaGift /></div>
          <div className="toast-content">
            <h4>Coming Soon!</h4>
            <p>The gifting feature is currently under development.</p>
          </div>
        </div>
      )}
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="info-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="info-modal-grid">
          {/* Left Column: Image & Buttons */}
          <div className="info-modal-left">
            <div className="info-modal-img-container">
              <img src={imgSrc} alt={pkg.name} className="info-modal-img" />
            </div>
            <h2 className="info-modal-title">{pkg.name}</h2>
            <div className="info-modal-price">{pkg.price} INR</div>
            
            <button 
              className="info-modal-btn-cart" 
              onClick={() => { onPurchase(pkg._id); onClose(); }}
              disabled={pkg.active === false}
              style={{
                background: pkg.active === false ? '#4b5563' : 'var(--accent-orange)',
                cursor: pkg.active === false ? 'not-allowed' : 'pointer'
              }}
            >
              {pkg.active === false ? 'OUT OF STOCK' : 'Add to cart'}
            </button>
            <button className="info-modal-btn-gift" onClick={handleGiftClick}>
              Gift this package
            </button>
          </div>

          {/* Right Column: Details */}
          <div className="info-modal-right">
            {info.perks && info.perks.length > 0 && (
              <div className="info-section">
                <h4>Perks:</h4>
                <ul>
                  {info.perks.map((perk, i) => <li key={i}>♦ {perk}</li>)}
                </ul>
              </div>
            )}
            
            {info.commands && info.commands.length > 0 && (
              <div className="info-section">
                <h4>Commands:</h4>
                <ul>
                  {info.commands.map((cmd, i) => <li key={i}>♦ {cmd}</li>)}
                </ul>
              </div>
            )}
            
            {info.others && info.others.length > 0 && (
              <div className="info-section">
                <h4>Others:</h4>
                <ul>
                  {info.others.map((item, i) => <li key={i}>♦ {item}</li>)}
                </ul>
              </div>
            )}
            
            {info.note && (
              <div className="info-section">
                <h4>Note:</h4>
                <ul>
                  <li>♦ {info.note}</li>
                </ul>
              </div>
            )}

            {info.kitPreviewImg && (
              <div className="info-section">
                <h4>KIT PREVIEW</h4>
                <img src={info.kitPreviewImg} alt="Kit Preview" style={{ maxWidth: '100%', border: '2px solid #555' }} />
              </div>
            )}

            {/* Fallback if nothing is populated */}
            {(!info.perks?.length && !info.commands?.length && !info.others?.length && !info.note) && (
              <div className="info-section">
                <p>No additional details provided.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfoModal;
