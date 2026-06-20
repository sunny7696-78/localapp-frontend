import React, { useState, useEffect } from 'react';
import { ALL_DORAHA_AREAS, APP_CITY, APP_PINCODE } from '../constants/doraha';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const AREAS = ALL_DORAHA_AREAS;
const LABEL_ICONS = { home: '🏠', office: '💼', other: '📍' };

const SavedAddresses = () => {
  const { t: tr } = useLanguage();
  const [addresses, setAddresses] = useState([
    { _id: 'a1', label: 'home', street: 'H.No. 45, Street 3', area: 'Doraha Mandi', city: APP_CITY, isDefault: true },
    { _id: 'a2', label: 'office', street: 'SCO 12, GT Road', area: 'GT Road, Doraha', city: APP_CITY, isDefault: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'home', street: '', area: 'Doraha Mandi', city: APP_CITY, pincode: '', isDefault: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('/api/addresses', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setAddresses(d); }).catch(() => {});
  }, []);

  const saveAddress = async () => {
    if (!form.street) { toast.error('Street address daalo'); return; }
    try {
      const res = await fetch(editId ? `/api/addresses/${editId}` : '/api/addresses', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (editId) { setAddresses(prev => prev.map(a => a._id === editId ? data : a)); toast.success('Updated!'); }
      else { setAddresses(prev => [...prev, data]); toast.success('Address saved!'); }
    } catch {
      const newAddr = { ...form, _id: 'local_' + Date.now() };
      if (editId) setAddresses(prev => prev.map(a => a._id === editId ? { ...a, ...form } : a));
      else setAddresses(prev => [...prev, newAddr]);
      toast.success('Address saved!');
    }
    setShowForm(false); setEditId(null); setForm({ label: 'home', street: '', area: 'Doraha Mandi', city: APP_CITY, pincode: '', isDefault: false });
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try { await fetch(`/api/addresses/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }); } catch {}
    setAddresses(prev => prev.filter(a => a._id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>📍 {tr('savedAddresses')}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setEditId(null); setForm({ label: 'home', street: '', area: 'Doraha Mandi', city: APP_CITY, pincode: '', isDefault: false }); }}>+ {tr('addNew')}</button>
      </div>

      {showForm && (
        <div className="card card-body" style={{ marginBottom: 20, border: '2px solid var(--primary)' }}>
          <h3 style={{ marginBottom: 16 }}>{editId ? tr('editAddress') : tr('addNewAddress')}</h3>
          <div className="form-group">
            <label className="form-label">{tr('label')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['home', 'office', 'other'].map(l => (
                <button key={l} onClick={() => setForm({ ...form, label: l })}
                  style={{ flex: 1, padding: '8px', border: `2px solid ${form.label === l ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, background: form.label === l ? '#fff5ee' : 'white', cursor: 'pointer', fontWeight: 600 }}>
                  {LABEL_ICONS[l]} {tr(l)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{tr('streetHouseNo')} *</label>
            <input className="form-input" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="H.No. 45, Street 3" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{tr('area')}</label>
              <select className="form-input form-select" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{tr('pincode')}</label>
              <input className="form-input" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="141001" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="checkbox" id="default" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
            <label htmlFor="default" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tr('setAsDefault')}</label>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveAddress}>{tr('saveAddress')}</button>
            <button className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>{tr('cancel')}</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {addresses.map(a => (
          <div key={a._id} className="card card-body" style={{ border: a.isDefault ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ fontSize: '1.8rem' }}>{LABEL_ICONS[a.label]}</div>
                <div>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {tr(a.label)}
                    {a.isDefault && <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>{tr('default')}</span>}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>{a.street}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{a.area}, {a.city} {a.pincode}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => { setForm({ label: a.label, street: a.street, area: a.area, city: a.city, pincode: a.pincode || '', isDefault: a.isDefault }); setEditId(a._id); setShowForm(true); }}>{tr('edit')}</button>
                <button className="btn btn-sm" style={{ background: 'var(--red)', color: 'white' }} onClick={() => deleteAddress(a._id)}>{tr('delete')}</button>
              </div>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div className="empty"><div className="empty-icon">📍</div><h3>{tr('noSavedAddresses')}</h3><button className="btn btn-primary" onClick={() => setShowForm(true)}>{tr('addNewAddress')}</button></div>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;
