import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LiveTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [driverPos, setDriverPos] = useState({ x: 20, y: 70 });
  const [status, setStatus] = useState('on_the_way');
  const [eta, setEta] = useState(12);
  const [chatOpen, setChatOpen] = useState(false);
  const animRef = useRef(null);
  const etaRef = useRef(eta);

  // Animate driver moving toward destination
  useEffect(() => {
    const targetX = 78, targetY = 22;
    let step = 0;
    animRef.current = setInterval(() => {
      step++;
      setDriverPos(prev => ({
        x: Math.min(prev.x + 0.8, targetX),
        y: Math.max(prev.y - 0.6, targetY),
      }));
      etaRef.current = Math.max(0, 12 - Math.floor(step / 5));
      setEta(etaRef.current);
      if (step >= 60) {
        clearInterval(animRef.current);
        setStatus('arrived');
        setEta(0);
      }
    }, 500);
    return () => clearInterval(animRef.current);
  }, []);

  const STATUS_INFO = {
    on_the_way: { label: 'Driver aa raha hai...', color: 'var(--primary)', icon: '🏍️' },
    arrived: { label: 'Driver pahunch gaya!', color: 'var(--green)', icon: '✅' },
    delivered: { label: 'Order deliver ho gaya!', color: 'var(--green)', icon: '📦' },
  };

  const info = STATUS_INFO[status];

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--secondary)', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Live Tracking</div>
          <div style={{ fontSize: '0.78rem', color: '#aaa' }}>Order #{orderId?.slice(-6).toUpperCase() || 'A1B2C3'}</div>
        </div>
        <div style={{ background: info.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{info.icon} {eta > 0 ? eta + ' min' : 'Yahan!'}</div>
      </div>

      {/* Map */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 280, position: 'relative', overflow: 'hidden' }}>
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * 14 + '%', height: 1, background: '#fff' }} />)}
          {[...Array(7)].map((_, i) => <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 16 + '%', width: 1, background: '#fff' }} />)}
        </div>

        {/* Road */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d={`M 15% 78% Q 45% 50% 82% 18%`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" strokeLinecap="round" />
          <path d={`M 15% 78% Q 45% 50% 82% 18%`} fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="10,6" opacity="0.8" />
        </svg>

        {/* Your Location */}
        <div style={{ position: 'absolute', left: '80%', top: '16%', transform: 'translate(-50%,-50%)' }}>
          <div style={{ background: 'var(--green)', width: 36, height: 36, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.4)' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: '1rem' }}>🏠</span>
          </div>
          <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.65rem', whiteSpace: 'nowrap', fontWeight: 700, background: 'rgba(34,197,94,0.8)', padding: '2px 6px', borderRadius: 4, marginTop: 2 }}>Tera Ghar</div>
        </div>

        {/* Shop/Restaurant */}
        <div style={{ position: 'absolute', left: '13%', top: '73%', transform: 'translate(-50%,-50%)' }}>
          <div style={{ background: 'var(--primary)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 3px 10px rgba(0,0,0,0.4)' }}>🏪</div>
          <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.65rem', whiteSpace: 'nowrap', fontWeight: 700, background: 'rgba(255,107,0,0.8)', padding: '2px 6px', borderRadius: 4, marginTop: 2 }}>Shop</div>
        </div>

        {/* Moving Driver */}
        <div style={{ position: 'absolute', left: driverPos.x + '%', top: driverPos.y + '%', transform: 'translate(-50%,-50%)', transition: 'left 0.5s, top 0.5s', zIndex: 10 }}>
          <div style={{ background: 'white', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 15px rgba(255,107,0,0.5)', border: '3px solid var(--primary)' }}>🏍️</div>
          <div style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {eta > 0 ? eta + ' min' : 'Yahan hai!'}
          </div>
        </div>

        {/* Status Banner */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '10px 16px', backdropFilter: 'blur(4px)' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{info.icon} {info.label}</div>
          {eta > 0 && <div style={{ color: '#aaa', fontSize: '0.78rem' }}>Estimated: {eta} minute</div>}
        </div>
      </div>

      {/* Driver Info */}
      <div className="card card-body" style={{ margin: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>H</div>
            <div>
              <div style={{ fontWeight: 700 }}>Harpreet Singh</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>🏍️ PB10AB1234 · Activa</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.8rem' }}>⭐</span>)}
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: 4 }}>4.8</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="tel:9876543210" style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1.1rem' }}>📞</a>
            <button onClick={() => setChatOpen(!chatOpen)} style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>💬</button>
          </div>
        </div>
      </div>

      {/* OTP */}
      <div className="card card-body" style={{ margin: '0 16px 12px', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 6 }}>🔐 Delivery OTP (Driver ko batao)</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: 10, color: 'var(--primary)' }}>7432</div>
      </div>

      {/* Quick Chat */}
      {chatOpen && (
        <div className="card card-body" style={{ margin: '0 16px 12px' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>💬 Driver ko message karo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Main ghar pe hoon', 'Gate khula hai', 'Thoda time lo', 'Kidhar ho?', 'Shukriya!'].map(msg => (
              <button key={msg} onClick={() => { navigate('/chat/order-' + (orderId || 'demo')); }}
                style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.82rem' }}>{msg}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => navigate('/chat/order-' + (orderId || 'demo'))}>
            💬 Full Chat Kholo
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
