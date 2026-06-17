import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguagePicker from '../components/LanguagePicker';
import toast from 'react-hot-toast';

const DORAHA_AREAS = ['Doraha Mandi','Doraha Bus Stand','Doraha Grain Market','Sidhwan Bet','Raikot Road Doraha','Sahnewal','Mullanpur Dakha','Other'];

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'customer', vehicleType: '', area: 'Doraha Mandi' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye'); return; }
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone, email: form.email, password: form.password, role: form.role, address: { area: form.area, city: 'Doraha, Ludhiana' } };
      if (form.role === 'driver' && form.vehicleType) payload.vehicle = { type: form.vehicleType };
      await register(payload);
      toast.success('Account ban gaya! Welcome to LocalApp Doraha 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration fail ho gayi');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🏪 {t('appName')}</div>
        <div style={{ textAlign: 'center', marginBottom: 20, color: 'var(--muted)', fontSize: '0.88rem' }}>📍 {t('tagline')}</div>

        <LanguagePicker />

        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>{t('createAccount')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('fullName')}</label>
            <input className="form-input" placeholder="Gurpreet Singh" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('phoneNumber')}</label>
              <input className="form-input" type="tel" placeholder="98765XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input className="form-input" type="password" placeholder="Kam se kam 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('area')} (Doraha)</label>
            <select className="form-input form-select" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
              {DORAHA_AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Main Hoon</label>
            <select className="form-input form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer (Saman mangwana hai)</option>
              <option value="driver">Driver (Delivery/Ride deni hai)</option>
              <option value="vendor">Vendor (Dukan/Shop owner hoon)</option>
            </select>
          </div>
          {form.role === 'driver' && (
            <div className="form-group">
              <label className="form-label">Gaadi Type</label>
              <select className="form-input form-select" value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}>
                <option value="">Select karo</option>
                <option value="bike">Bike 🏍️</option>
                <option value="auto">Auto 🛺</option>
                <option value="car">Car 🚗</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? t('registering') : t('registerBtn')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
          {t('alreadyUser')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('loginHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
