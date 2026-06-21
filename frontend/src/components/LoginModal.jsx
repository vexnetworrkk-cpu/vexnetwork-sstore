import React, { useState } from 'react';
import axios from 'axios';
import '../modal.css'; // Make sure to import the modal CSS

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [isBedrock, setIsBedrock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Assuming your backend handles login as before
      const formattedUsername = isBedrock ? `_${username}` : username;
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username: formattedUsername });
      
      localStorage.setItem('mc_username', formattedUsername);
      onLoginSuccess(formattedUsername);
      onClose();
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Please enter your username to continue</h2>
          <p className="modal-subtitle">
            Usernames can't contain spaces, they can have any letter and<br/>
            number, and they are Case Sensitive.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-input-container">
            <img src={`https://minotar.net/helm/${username || 'Steve'}/32.png`} alt="Avatar" />
            <input 
              type="text" 
              className="modal-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              autoFocus
            />
          </div>
          
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? 'PROCESSING...' : 'CONTINUE'}
          </button>
        </form>

        <div className="modal-footer">
          Bedrock user? 
          <button 
            type="button" 
            className="toggle-btn"
            style={{ backgroundColor: isBedrock ? 'var(--accent-green)' : 'var(--accent-red)' }}
            onClick={() => setIsBedrock(!isBedrock)}
          >
            {isBedrock ? 'Yes' : 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
