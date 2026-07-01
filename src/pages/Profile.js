import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { ALL_DORAHA_AREAS, APP_CITY } from '../constants/doraha';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const AREAS = ALL_DORAHA_AREAS;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t: tr } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: { street: user?.address?.street || '', area: user?.address?.area || APP_CITY + ' Mandi', city: APP_CITY } });

  const handleSave = async () => {
    try { await authAPI.updateProfile(form); toast.success('Profile updated!'); setEditing(false); }
    catch { toast.success('Updated (Demo)'); setEditing(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Logged out'); };

  const menuItems = [
    { icon: '📦', label: tr('myOrders'), path: '/orders' },
    { icon: '🏍️', label: tr('bookARide'), path: '/ride' },
    { icon: '📍', label: tr('savedAddresses'), path: '/addresses' },
    { icon: '💰', label: tr('myWallet'), path: '/wallet' },
    { icon: '👥', label: tr('referAndEarn'), path: '/referral' },
    { icon: '🔔', label: tr('notifications'), path: '/notifications' },
    { icon: '🆘', label: tr('helpSupport'), path: '/help' },
    ...(user?.role === 'driver' ? [{ icon: '💵', label: 'My Earnings', path: '/earnings' }] : []),
    ...(user?.role === 'vendor' ? [{ icon: '🏪', label: 'My Shop', path: '/shop' }] : []),
    ...(user?.role === 'admin' ? [{ icon: '🎟️', label: 'Promo Codes', path: '/promos' }, { icon: '⚙️', label: 'Admin Panel', path: '/admin' }] : []),
  ];

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 className="page-title">👤 {tr('myProfile')}</h1>

      <div className="card card-body" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{user?.phone}</div>
            <span className="badge badge-blue" style={{ marginTop: 4 }}>{user?.role}</span>
          </div>
        </div>

        {!editing ? (
          <>
            {[{ label: tr('name'), value: user?.name }, { label: tr('phone'), value: user?.phone }, { label: tr('email'), value: user?.email || tr('notSet') }, { label: tr('area'), value: user?.address?.area || tr('notSet') }, { label: 'City', value: APP_CITY }].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{f.label}</span>
                <span style={{ fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
            <button className="btn btn-outline btn-block" style={{ marginTop: 16 }} onClick={() => setEditing(true)}>✏️ {tr('editProfile')}</button>
          </>
        ) : (
          <>
            <div className="form-group"><label className="form-label">{tr('name')}</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">{tr('email')}</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Street</label><input className="form-input" value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} /></div>
            <div className="form-group"><label className="form-label">{tr('area')}</label>
              <select className="form-input form-select" value={form.address.area} onChange={e => setForm({ ...form, address: { ...form.address, area: e.target.value } })}>
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{tr('save')}</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditing(false)}>{tr('cancel')}</button>
            </div>
          </>
        )}
      </div>

      {/* Quick Links */}
      <div className="card card-body" style={{ marginBottom: 16 }}>
        {menuItems.map(item => (
          <div key={item.path} onClick={() => navigate(item.path)}
            style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
            <span>{item.icon} {item.label}</span>
            <span style={{ color: 'var(--muted)' }}>›</span>
          </div>
        ))}
      </div>

      <button className="btn btn-red btn-block" onClick={handleLogout}>🚪 {tr('logout')}</button>
    </div>
  );
};

export default Profile;
