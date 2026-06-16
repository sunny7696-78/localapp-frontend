import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_WALLET = {
  balance: 250,
  loyaltyPoints: 1450,
  transactions: [
    { type: 'credit', amount: 50, description: 'Loyalty points earned - Order #A1B2C3', date: new Date(Date.now()-86400000).toISOString() },
    { type: 'credit', amount: 200, description: 'Welcome bonus', date: new Date(Date.now()-172800000).toISOString() },
    { type: 'debit', amount: 100, description: 'Used in order #D4E5F6', date: new Date(Date.now()-259200000).toISOString() },
    { type: 'credit', amount: 100, description: 'Referral bonus', date: new Date(Date.now()-345600000).toISOString() },
  ]
};

const Wallet = () => {
  const [wallet, setWallet] = useState(DEMO_WALLET);
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/wallet', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r => r.json()).then(d => { if (d.balance !== undefined) setWallet(d); }).catch(() => {});
  }, []);

  const pointsValue = Math.floor(wallet.loyaltyPoints / 10);

  return (
    <div className="page" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 className="page-title">💰 My Wallet</h1>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'linear-gradient(135deg,var(--primary),#ff8c42)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 8 }}>Wallet Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹{wallet.balance}</div>
          <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: 8 }}>Use at checkout</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 16, padding: 24, color: 'white' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 8 }}>Loyalty Points</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{wallet.loyaltyPoints}</div>
          <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: 8 }}>Worth ₹{pointsValue}</div>
        </div>
      </div>

      {/* How to earn */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>🎯 Earn More Points</h3>
        {[
          { icon: '🛒', action: 'Every grocery order', points: '10 pts per ₹100' },
          { icon: '🍔', action: 'Every food order', points: '15 pts per ₹100' },
          { icon: '🏍️', action: 'Every ride', points: '20 pts per ride' },
          { icon: '👥', action: 'Refer a friend', points: '100 pts' },
          { icon: '⭐', action: 'Give review', points: '10 pts' },
        ].map(e => (
          <div key={e.action} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
            <span>{e.icon} {e.action}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{e.points}</span>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="card card-body">
        <h3 style={{ marginBottom: 16 }}>📋 Transaction History</h3>
        {wallet.transactions?.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div><h3>No transactions yet</h3></div>
        ) : (
          wallet.transactions?.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.type === 'credit' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {t.type === 'credit' ? '↑' : '↓'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.description}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ fontWeight: 800, color: t.type === 'credit' ? 'var(--green)' : 'var(--red)' }}>
                {t.type === 'credit' ? '+' : '-'}₹{t.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wallet;
