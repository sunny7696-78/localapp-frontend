import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.phone, form.password);
      toast.success('Welcome back, ' + user.name.split(' ')[0] + '! 👋');
      navigate(user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : user.role === 'vendor' ? '/vendor' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Phone ya password galat hai');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🏪 LocalApp</div>
        <div style={{ textAlign: 'center', marginBottom: 20, color: 'var(--muted)', fontSize: '0.88rem' }}>📍 Doraha, Ludhiana</div>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Wapas Aao! 👋</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="98765XXXXX" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Password bhool gaye?</Link>
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ padding: 14 }}>
            {loading ? '⏳ Login ho raha...' : '🚀 Login Karo'}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginTop: 16, fontSize: '0.8rem', color: '#0369a1' }}>
          <strong>Demo accounts:</strong><br />
          Customer: 9876500001 / user123<br />
          Admin: 9999999999 / admin123<br />
          Driver: 9876543210 / user123
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
          Naya user? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register Karo</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
