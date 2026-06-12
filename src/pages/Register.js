import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'customer', vehicleType: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone, email: form.email, password: form.password, role: form.role };
      if (form.role === 'driver' && form.vehicleType) payload.vehicle = { type: form.vehicleType };
      const user = await register(payload);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🏪 LocalApp</div>
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Gurpreet Singh" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" placeholder="98765XXXXX" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">I am a</label>
            <select className="form-input form-select" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="driver">Delivery Driver / Rider</option>
              <option value="vendor">Vendor / Shop Owner</option>
            </select>
          </div>
          {form.role === 'driver' && (
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select className="form-input form-select" value={form.vehicleType}
                onChange={e => setForm({ ...form, vehicleType: e.target.value })}>
                <option value="">Select vehicle</option>
                <option value="bike">Bike 🏍️</option>
                <option value="auto">Auto 🛺</option>
                <option value="car">Car 🚗</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
