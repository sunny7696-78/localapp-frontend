import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div style={{ fontSize: '0.85rem', color: '#ff8c42', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
          📍 DORAHA, LUDHIANA
        </div>
        <h1>Doraha Ka <span>Super App</span></h1>
        <p>Kirana delivery · Restaurant food · Bike & Auto rides<br/>Sab kuch ghar baithe, sirf Doraha ke liye!</p>
        {!user ? (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>🚀 Shuru Karo</button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/login')}>Login</button>
          </div>
        ) : (
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
            👋 Welcome back, <strong style={{ color: 'white' }}>{user.name.split(' ')[0]}</strong>! Aaj kya chahiye?
          </div>
        )}
      </div>

      {/* Service Cards */}
      <div className="service-cards">
        <div className="service-card" onClick={() => navigate('/grocery')}>
          <div className="service-icon">🛒</div>
          <h3>{t('groceryService')}</h3>
          <p>{t('groceryDesc')}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 6 }}>FREE delivery above ₹299</div>
        </div>
        <div className="service-card" onClick={() => navigate('/food')}>
          <div className="service-icon">🍔</div>
          <h3>{t('foodService')}</h3>
          <p>{t('foodDesc')}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 6 }}>30-45 min delivery</div>
        </div>
        <div className="service-card" onClick={() => navigate('/ride')}>
          <div className="service-icon">🏍️</div>
          <h3>{t('rideService')}</h3>
          <p>{t('rideDesc')}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 6 }}>Starting ₹25</div>
        </div>
      </div>

      {/* Area Coverage */}
      <div className="card card-body" style={{ marginBottom: 20, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: 'white' }}>
        <h3 style={{ marginBottom: 12, color: 'white' }}>📍 Hamare Service Areas</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Doraha', 'Doraha Mandi', 'Doraha Bus Stand', 'Sidhwan Bet', 'Raikot Road', 'Mullanpur', 'Sahnewal', 'Ludhiana City'].map(area => (
            <span key={area} style={{ background: 'rgba(255,107,0,0.2)', border: '1px solid rgba(255,107,0,0.4)', color: '#ff8c42', padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600 }}>
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Why LocalApp */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { icon: '⚡', title: 'Super Fast', desc: 'Doraha mein 20 min delivery' },
          { icon: '💰', title: 'Best Prices', desc: 'Local shop ke daam, koi extra nahi' },
          { icon: '🤝', title: 'Local Support', desc: 'Doraha ke apne log, apna kaam' },
        ].map(f => (
          <div key={f.title} className="card card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{f.icon}</div>
            <strong style={{ display: 'block', marginBottom: 4 }}>{f.title}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Popular Near You */}
      {user && (
        <div className="card card-body" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>🔥 Doraha Mein Popular</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {[
              { emoji: '🥛', name: 'Amul Milk 1L', price: '₹66', tag: 'Grocery', path: '/grocery' },
              { emoji: '🍛', name: 'Punjabi Thali', price: '₹180', tag: 'Food', path: '/food' },
              { emoji: '🏍️', name: 'Doraha → Ludhiana', price: '₹65', tag: 'Ride', path: '/ride' },
              { emoji: '🥦', name: 'Fresh Sabziyan', price: '₹30/kg', tag: 'Grocery', path: '/grocery' },
            ].map(item => (
              <div key={item.name} onClick={() => navigate(item.path)}
                style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: 'var(--bg)', borderRadius: 10, cursor: 'pointer', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Banner */}
      <div style={{ background: 'linear-gradient(135deg,#ff6b00,#ff8c42)', borderRadius: 16, padding: 20, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>🎉 Pehle order pe ₹50 OFF!</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Code: <strong>DORAHA50</strong></div>
        </div>
        <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem' }} onClick={() => navigate('/grocery')}>Order Now</button>
      </div>
    </div>
  );
};

export default Home;
