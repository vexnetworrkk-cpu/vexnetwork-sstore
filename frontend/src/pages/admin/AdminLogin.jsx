import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../../utils/toast';
import { Mail, Lock, EyeOff, Eye, LogIn, ArrowLeft } from 'lucide-react';
import bannerImg from '../../assets/banner.jpg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/admin/login`, { email, password });
      
      const { token, user } = res.data;
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.role}!`);
      navigate('/user/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bannerImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      {/* Light Blur Overlay to match the cloud aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)'
      }}></div>

      {/* Top Left Back Button */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: '#1e293b',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <ArrowLeft size={24} /> Back
      </button>

      {/* Login Card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        width: '100%',
        maxWidth: '420px',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Top Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <LogIn size={24} color="#0f172a" />
        </div>

        <h1 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>
          Sign in with email
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2.5rem', lineHeight: '1.5' }}>
          Secure admin access to the VexNetwork store management and orders.
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Email Input */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                background: '#f1f5f9',
                border: '1px solid transparent',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #cbd5e1'}
              onBlur={(e) => e.target.style.border = '1px solid transparent'}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 3rem',
                background: '#f1f5f9',
                border: '1px solid transparent',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #cbd5e1'}
              onBlur={(e) => e.target.style.border = '1px solid transparent'}
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-0.2rem' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Please contact the Head Developer to reset your password.'); }} style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e293b'}
            onMouseOut={(e) => e.target.style.background = '#0f172a'}
          >
            {loading ? 'Authenticating...' : 'Get Started'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
