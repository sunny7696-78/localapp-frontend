import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: '5rem', marginBottom: 16 }}>🏚️</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>Page nahi mili!</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 28, maxWidth: 300 }}>Jo page tu dhundh raha hai wo exist nahi karta ya move ho gaya.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" onClick={() => navigate('/')}>🏠 Home Jao</button>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Wapas</button>
      </div>
    </div>
  );
};

export default NotFound;
