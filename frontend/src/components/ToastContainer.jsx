import React, { useState, useEffect } from 'react';
import { Info, CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle size={20} color="#10b981" />;
    if (type === 'error') return <AlertCircle size={20} color="#ef4444" />;
    return <Info size={20} color="#8b5cf6" />;
  };

  const getBorderColor = (type) => {
    if (type === 'success') return '#10b981';
    if (type === 'error') return '#ef4444';
    return '#8b5cf6';
  };

  const getBgColor = (type) => {
    if (type === 'success') return 'rgba(16, 185, 129, 0.2)';
    if (type === 'error') return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(139, 92, 246, 0.2)';
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toasts.map(t => (
        <div key={t.id} className="sexy-toast animate-fade-up" style={{ position: 'relative', bottom: 'auto', right: 'auto', borderLeft: `4px solid ${getBorderColor(t.type)}`, borderColor: getBorderColor(t.type) }}>
          <div className="toast-icon" style={{ background: getBgColor(t.type), color: getBorderColor(t.type) }}>
            {getIcon(t.type)}
          </div>
          <div className="toast-content">
            <h4>{t.title}</h4>
            <p>{t.message}</p>
          </div>
          <button 
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
