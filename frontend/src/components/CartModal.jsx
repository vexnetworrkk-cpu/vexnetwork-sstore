import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../cart-modal.css'; 

const CartModal = ({ isOpen, onClose, username, onLogout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && username) {
      fetchCart();
    }
  }, [isOpen, username]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/cart/${username}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (packageId, index) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/cart/${username}/remove`, { packageId, index });
      // The response returns an array of IDs, not populated objects, so we refetch
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout', { state: { isCartCheckout: true, cartItems } });
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-modal-overlay" onClick={handleBackdropClick}>
      <div className="cart-modal-content">
        
        {/* Header */}
        <div className="cart-modal-header">
          <div className="cart-header-left">
            <img 
              src={`https://minotar.net/armor/bust/${username || 'Steve'}/100.png`} 
              alt={username || 'Guest'} 
              className="cart-player-img" 
            />
            <div className="cart-player-info">
              <h2 className="cart-player-name">{username ? `${username.toUpperCase()}'S CART` : "GUEST'S CART"}</h2>
              <div className="cart-controls">
                {username && <button className="cart-logout-btn" onClick={onLogout}>Logout</button>}
              </div>
            </div>
          </div>
          
          <button className="cart-close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="cart-modal-body">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#fff' }}>Loading...</p>
          ) : cartItems.length === 0 ? (
            <>
              <h3 className="cart-empty-title">EMPTY CART</h3>
              <p className="cart-empty-text">
                Keep adding items to cart and check back here to complete<br/>
                your purchase!
              </p>
            </>
          ) : (
            <div className="cart-items-container">
              {cartItems.map((item, index) => (
                <div key={`${item._id}-${index}`} className="cart-item-row">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item._id, index)}>✖</button>
                </div>
              ))}
              <div className="cart-total-row">
                <span className="cart-total-label">Total:</span>
                <span className="cart-total-value">₹{totalPrice}</span>
              </div>
              <button className="cart-checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CartModal;
