import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Referral = () => {
  const { user } = useAuth();
  const referralCode = user?.name?.split(' ')[0].toUpperCase() + (user?.phone?.slice(-4) || '0000');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => { setCopied(true); toast.success('Code copied!'); setTimeout(() => setCopied(false), 2000); }).catch(() => toast.error('Copy failed'));
  };

  const shareWhatsApp = () => {
    const msg = `LocalApp use karo Ludhiana mein! Grocery, Food aur Rides sab ek jagah. Mere referral code se join karo: ${referralCode} aur pao ₹50 off pehle order pe! https://localapp-frontend.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  const DEMO_REFERRALS = [
    { name: 'Gurpreet S.', date: '2 days ago', status: 'completed', earned: 100 },
    { name: 'Manpreet K.', date: '5 days ago', status: 'completed', earned: 100 },
    { name: 'Rajesh V.', date: '1 week ago', status: 'pending', earned: 0 },
  ];

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 className="page-title">👥 Refer & Earn</h1>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 20, padding: 28, color: 'white', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎁</div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Dosto ko invite karo!</h2>
        <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: 4 }}>Har successful referral pe paao</p>
        <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹100 <span style={{ fontSize: '1rem', opacity: 0.8 }}>+ 100 Points</span></div>
        <p style={{ opacity: 0.8, fontSize: '0.82rem', marginTop: 8 }}>Tera dost bhi paayega ₹50 off pehle order pe</p>
      </div>

      {/* Referral Code */}
      <div className="card card-body" style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 8 }}>Tera Referral Code</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: 6, color: 'var(--primary)', background: 'var(--bg)', padding: '16px', borderRadius: 12, border: '2px dashed var(--border)', marginBottom: 16 }}>
          {referralCode}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={copyCode}>{copied ? '✅ Copied!' : '📋 Copy Code'}</button>
          <button className="btn btn-primary" style={{ flex: 1, background: '#25D366' }} onClick={shareWhatsApp}>📱 Share on WhatsApp</button>
        </div>
      </div>

      {/* How it works */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Kaise kaam karta hai?</h3>
        {[
          { step: '1', icon: '📤', title: 'Code share karo', desc: 'Apna code dosto ko WhatsApp pe bhejo' },
          { step: '2', icon: '📱', title: 'Dost register kare', desc: 'Dost LocalApp pe join kare tera code use karke' },
          { step: '3', icon: '🛒', title: 'Pehla order kare', desc: 'Dost apna pehla order complete kare' },
          { step: '4', icon: '💰', title: 'Dono ko reward mile', desc: 'Tujhe ₹100 aur dost ko ₹50 discount' },
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{s.icon} {s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Referrals */}
      <div className="card card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3>My Referrals</h3>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Total Earned: ₹{DEMO_REFERRALS.filter(r => r.status === 'completed').reduce((s, r) => s + r.earned, 0)}</span>
        </div>
        {DEMO_REFERRALS.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>{r.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{r.date}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${r.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{r.status}</span>
              {r.earned > 0 && <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>+₹{r.earned}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Referral;
