import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';
import API from '../utils/api';

const DEMO_PROMOS = [
  { _id: 'p1', code: 'WELCOME50', description: 'Welcome offer', discountType: 'flat', discountValue: 50, minOrder: 200, usageLimit: 500, usedCount: 123, validTill: new Date(Date.now()+30*86400000).toISOString(), isActive: true, applicableOn: 'all' },
  { _id: 'p2', code: 'GROCERY20', description: '20% off groceries', discountType: 'percent', discountValue: 20, minOrder: 300, maxDiscount: 100, usageLimit: 200, usedCount: 87, validTill: new Date(Date.now()+15*86400000).toISOString(), isActive: true, applicableOn: 'grocery' },
  { _id: 'p3', code: 'RIDE10', description: 'Rs 10 off on rides', discountType: 'flat', discountValue: 10, minOrder: 50, usageLimit: 1000, usedCount: 432, validTill: new Date(Date.now()+60*86400000).toISOString(), isActive: false, applicableOn: 'ride' },
];

const PromoAdmin = () => {
  const [promos, setPromos] = useState(DEMO_PROMOS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', discountType: 'percent', discountValue: '', minOrder: 0, maxDiscount: 500, usageLimit: 100, validTill: '', applicableOn: 'all', isActive: true });

  useEffect(() => {
    API.get('/promos').then(r => { if (r.data.length > 0) setPromos(r.data); }).catch(() => {});
  }, []);

  const createPromo = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/promos', { ...form, discountValue: Number(form.discountValue), minOrder: Number(form.minOrder), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit) });
      setPromos(prev => [res.data, ...prev]);
      toast.success('Promo created!');
    } catch {
      setPromos(prev => [{ ...form, _id: 'local_' + Date.now(), usedCount: 0 }, ...prev]);
      toast.success('Promo created (Demo)!');
    }
    setShowForm(false);
    setForm({ code: '', description: '', discountType: 'percent', discountValue: '', minOrder: 0, maxDiscount: 500, usageLimit: 100, validTill: '', applicableOn: 'all', isActive: true });
  };

  const togglePromo = async (id) => {
    try { await API.put(`/promos/${id}/toggle`); } catch {}
    setPromos(prev => prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const deletePromo = async (id) => {
    if (!window.confirm('Delete promo?')) return;
    try { await API.delete(`/promos/${id}`); } catch {}
    setPromos(prev => prev.filter(p => p._id !== id));
    toast.success('Deleted');
  };

  const daysLeft = (date) => Math.max(0, Math.ceil((new Date(date) - Date.now()) / 86400000));

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🎟️ Promo Codes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Create Promo</button>
      </div>

      {showForm && (
        <div className="card card-body" style={{ marginBottom: 20, border: '2px solid var(--primary)' }}>
          <h3 style={{ marginBottom: 16 }}>Create New Promo</h3>
          <form onSubmit={createPromo}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Promo Code *</label>
                <input className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="e.g. SAVE50" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. 50% off first order" />
              </div>
              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <select className="form-input form-select" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Value *</label>
                <input className="form-input" type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required placeholder={form.discountType === 'percent' ? '20 (%)' : '50 (Rs)'} />
              </div>
              <div className="form-group">
                <label className="form-label">Min Order (₹)</label>
                <input className="form-input" type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Discount (₹)</label>
                <input className="form-input" type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Usage Limit</label>
                <input className="form-input" type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Valid Till *</label>
                <input className="form-input" type="date" value={form.validTill} onChange={e => setForm({ ...form, validTill: e.target.value })} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Applicable On</label>
                <select className="form-input form-select" value={form.applicableOn} onChange={e => setForm({ ...form, applicableOn: e.target.value })}>
                  <option value="all">All Orders</option>
                  <option value="grocery">Grocery Only</option>
                  <option value="food">Food Only</option>
                  <option value="ride">Rides Only</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>Create Promo</button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {promos.map(p => (
          <div key={p._id} className="card card-body" style={{ border: `1px solid ${p.isActive ? 'var(--green)' : 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, background: 'var(--bg)', padding: '4px 12px', borderRadius: 8, border: '2px dashed var(--border)', letterSpacing: 2 }}>{p.code}</span>
                  <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  <span className="badge badge-blue">{p.applicableOn}</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 6 }}>{p.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {p.discountType === 'percent' ? `${p.discountValue}%` : `₹${p.discountValue}`} OFF
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Min ₹{p.minOrder}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 12 }}>
              <span>Used: <strong>{p.usedCount}/{p.usageLimit}</strong></span>
              <span>Expires: <strong style={{ color: daysLeft(p.validTill) < 7 ? 'var(--red)' : 'var(--text)' }}>{daysLeft(p.validTill)} days left</strong></span>
            </div>
            {/* Usage bar */}
            <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--primary)', width: `${Math.min(100, (p.usedCount / p.usageLimit) * 100)}%`, borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`btn btn-sm ${p.isActive ? 'btn-red' : 'btn-green'}`} onClick={() => togglePromo(p._id)}>{p.isActive ? 'Deactivate' : 'Activate'}</button>
              <button className="btn btn-sm" style={{ background: 'var(--red)', color: 'white' }} onClick={() => deletePromo(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoAdmin;
