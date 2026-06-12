import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="hero">
        <h1>Your Local <span>Everything</span> App</h1>
        <p>Kirana delivery · Restaurant food · Bike & Auto rides — all in one place for Ludhiana</p>
        {!user && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => navigate('/login')}>Login</button>
          </div>
        )}
      </div>

      <div className="service-cards">
        <div className="service-card" onClick={() => navigate('/grocery')}>
          <div className="service-icon">🛒</div>
          <h3>Kirana Delivery</h3>
          <p>Groceries & daily needs in 15–20 mins</p>
        </div>
        <div className="service-card" onClick={() => navigate('/food')}>
          <div className="service-icon">🍔</div>
          <h3>Food Delivery</h3>
          <p>Hot food from local restaurants</p>
        </div>
        <div className="service-card" onClick={() => navigate('/ride')}>
          <div className="service-icon">🏍️</div>
          <h3>Bike / Auto Ride</h3>
          <p>Affordable rides around the city</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 32 }}>
        {[
          { icon: '⚡', title: 'Fast Delivery', desc: 'Orders delivered in under 20 minutes' },
          { icon: '💰', title: 'Best Prices', desc: 'Local prices, no hidden charges' },
          { icon: '🤝', title: 'Support Local', desc: 'Empowering Ludhiana businesses' },
        ].map(f => (
          <div key={f.title} className="card card-body" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{f.icon}</div>
            <strong>{f.title}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
