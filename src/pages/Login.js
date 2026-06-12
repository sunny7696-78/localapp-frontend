import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.phone, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🏪 LocalApp</div>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="98765XXXXX" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
          New user? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
