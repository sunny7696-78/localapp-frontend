import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AREAS = ['Civil Lines', 'Model Town', 'Sarabha Nagar', 'Dugri', 'BRS Nagar', 'Gurdev Nagar', 'Focal Point', 'Jamalpur', 'Shaheed Bhagat Singh Nagar', 'Other'];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: { street: user?.address?.street || '', area: user?.address?.area || 'Civil Lines', city: 'Ludhiana' } });

  const handleSave = async () => {
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.success('Updated (Demo)'); setEditing(false); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 className="page-title">👤 My Profile</h1>
      <div className="card card-body" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{user?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{user?.phone}</div>
            <span className="badge badge-blue" style={{ marginTop: 4 }}>{user?.role}</span>
          </div>
        </div>

        {!editing ? (
          <>
            {[{ label: 'Name', value: user?.name }, { label: 'Phone', value: user?.phone }, { label: 'Email', value: user?.email || 'Not set' }, { label: 'Area', value: user?.address?.area || 'Not set' }, { label: 'City', value: 'Ludhiana' }].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{f.label}</span>
                <span style={{ fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
            <button className="btn btn-outline btn-block" style={{ marginTop: 16 }} onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Street / House No.</label>
              <input className="form-input" value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
            </div>
            <div className="form-group">
              <label className="form-label">Area</label>
              <select className="form-input form-select" value={form.address.area} onChange={e => setForm({ ...form, address: { ...form.address, area: e.target.value } })}>
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>

      <div className="card card-body">
        <h3 style={{ marginBottom: 12 }}>Quick Links</h3>
        {[
          { label: '📦 My Orders', action: () => navigate('/orders') },
          { label: '🏍️ My Rides', action: () => navigate('/ride') },
        ].map(l => (
          <div key={l.label} onClick={l.action}
            style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            {l.label} →
          </div>
        ))}
        <button className="btn btn-red btn-block" style={{ marginTop: 16 }} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
