import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguagePicker from '../components/LanguagePicker';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.phone, form.password);
      toast.success(t('welcomeMsg') + ', ' + user.name.split(' ')[0] + '! 👋');
      navigate(user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : user.role === 'vendor' ? '/vendor' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || t('loginError'));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🏪 {t('appName')}</div>
        <div style={{ textAlign: 'center', marginBottom: 20, color: 'var(--muted)', fontSize: '0.88rem' }}>📍 {t('tagline')}</div>

        <LanguagePicker />

        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>{t('welcomeBack')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('phoneNumber')}</label>
            <input className="form-input" type="tel" placeholder="98765XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? t('loggingIn') : t('loginBtn')}
          </button>
        </form>
        <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginTop: 16, fontSize: '0.82rem', color: '#0369a1' }}>
          <strong>{t('demoAccounts')}:</strong><br />
          Customer: 9876500001 / user123<br />
          Admin: 9999999999 / admin123
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
          {t('newUser')} <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('registerHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
