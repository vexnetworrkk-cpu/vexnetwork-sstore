import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, MessageSquare, Megaphone, Send } from 'lucide-react';
import { toast } from '../../utils/toast';

const Announcements = () => {
  const [settings, setSettings] = useState({
    bannerText: '',
    bannerActive: false,
    popupText: '',
    popupActive: false,
    discordWebhookUrl: '',
    discordAlertsActive: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setSettings(res.data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/admin/announcements`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Announcements updated successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscordTest = async () => {
    if (!settings.discordWebhookUrl) return toast.error('Please enter a webhook URL first');
    try {
      const token = localStorage.getItem('admin_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/admin/announcements/discord-test`, { webhookUrl: settings.discordWebhookUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Test message sent to Discord!');
    } catch (err) {
      toast.error('Failed to send test message');
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading Announcements...</div>;

  return (
    <div className="animate-fade-up" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Announcements</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage global store alerts, popups, and Discord integration.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* HOMEPAGE BANNER */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Megaphone size={24} color="var(--accent-orange)" />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Global Homepage Banner</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.bannerActive} onChange={e => setSettings({...settings, bannerActive: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }} />
              <span style={{ fontWeight: 'bold' }}>Enable Top Banner</span>
            </label>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Banner Text</label>
              <input 
                type="text" 
                value={settings.bannerText} 
                onChange={e => setSettings({...settings, bannerText: e.target.value})} 
                placeholder="e.g. 🔥 Summer Sale - 25% OFF All Ranks!" 
                disabled={!settings.bannerActive}
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', opacity: settings.bannerActive ? 1 : 0.5 }} 
              />
            </div>
          </div>
        </div>

        {/* STORE POPUP */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Bell size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Store Entry Popup</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.popupActive} onChange={e => setSettings({...settings, popupActive: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }} />
              <span style={{ fontWeight: 'bold' }}>Enable Entry Popup</span>
            </label>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Popup Message</label>
              <textarea 
                value={settings.popupText} 
                onChange={e => setSettings({...settings, popupText: e.target.value})} 
                placeholder="Welcome to VexNetwork! Check out our new Lifesteal keys..." 
                disabled={!settings.popupActive}
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', minHeight: '100px', resize: 'vertical', opacity: settings.popupActive ? 1 : 0.5 }} 
              />
            </div>
          </div>
        </div>

        {/* DISCORD ALERTS */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #5865F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <MessageSquare size={24} color="#5865F2" />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Discord Alerts</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Automatically send a message to your Discord server whenever a player makes a purchase.</p>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.discordAlertsActive} onChange={e => setSettings({...settings, discordAlertsActive: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#5865F2' }} />
              <span style={{ fontWeight: 'bold' }}>Enable Discord Purchase Alerts</span>
            </label>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Webhook URL</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="password" 
                  value={settings.discordWebhookUrl} 
                  onChange={e => setSettings({...settings, discordWebhookUrl: e.target.value})} 
                  placeholder="https://discord.com/api/webhooks/..." 
                  disabled={!settings.discordAlertsActive}
                  style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', opacity: settings.discordAlertsActive ? 1 : 0.5 }} 
                />
                <button 
                  type="button" 
                  onClick={handleDiscordTest}
                  disabled={!settings.discordAlertsActive}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem', background: 'rgba(88, 101, 242, 0.2)', color: '#5865F2', border: '1px solid #5865F2', borderRadius: '8px', cursor: settings.discordAlertsActive ? 'pointer' : 'not-allowed', fontWeight: 'bold', opacity: settings.discordAlertsActive ? 1 : 0.5 }}
                >
                  <Send size={16} /> Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{ padding: '1rem 3rem', background: 'var(--accent-orange)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Announcements;
