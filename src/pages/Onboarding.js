import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  { icon: '🛒', title: 'Doraha Ka Kirana', desc: 'Ghar baithe mangwao sab kuch — doodh, sabzi, dal, chawal — sirf 20 minute mein!', color: '#fff5ee', btn: 'Aage →' },
  { icon: '🍔', title: 'Garam Khana Ghar Pe', desc: 'Doraha ke best restaurants se order karo. Samosa, Dal Makhani, Momos — sab available!', color: '#f0fdf4', btn: 'Aage →' },
  { icon: '🏍️', title: 'Sasta Aur Teez Ride', desc: 'Bike, Auto ya Car — Doraha se Ludhiana, Sirhind, Khanna — ek click mein book karo!', color: '#eff6ff', btn: 'Shuru Karein!' },
];

const Onboarding = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (slide < SLIDES.length - 1) { setSlide(slide + 1); return; }
    localStorage.setItem('onboarded', '1');
    if (onComplete) onComplete();
    navigate('/register');
  };

  const skip = () => {
    localStorage.setItem('onboarded', '1');
    if (onComplete) onComplete();
    navigate('/login');
  };

  const s = SLIDES[slide];

  return (
    <div style={{ minHeight: '100vh', background: s.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, transition: 'background 0.4s' }}>
      {/* Skip */}
      <button onClick={skip} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>Skip</button>

      {/* Icon */}
      <div style={{ fontSize: '7rem', marginBottom: 32, animation: 'bounce 1s ease-in-out' }}>{s.icon}</div>

      {/* Content */}
      <div style={{ textAlign: 'center', maxWidth: 340, marginBottom: 48 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 14, color: 'var(--secondary)' }}>{s.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>{s.desc}</p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Button */}
      <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1rem', borderRadius: 50 }} onClick={next}>
        {s.btn}
      </button>

      {/* LocalApp brand */}
      <div style={{ position: 'absolute', bottom: 24, color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600 }}>
        🏪 LocalApp · Doraha, Ludhiana
      </div>
    </div>
  );
};

export default Onboarding;
