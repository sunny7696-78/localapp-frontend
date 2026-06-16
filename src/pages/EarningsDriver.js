import React, { useState } from 'react';

const DEMO_EARNINGS = {
  today: { amount: 650, trips: 8, hours: 6 },
  week: { amount: 3850, trips: 47, hours: 38 },
  month: { amount: 14200, trips: 183, hours: 148 },
  total: { amount: 86500, trips: 1240, hours: 980 },
};

const DEMO_DAILY = [
  { day: 'Mon', amount: 520 }, { day: 'Tue', amount: 780 }, { day: 'Wed', amount: 430 },
  { day: 'Thu', amount: 920 }, { day: 'Fri', amount: 1100 }, { day: 'Sat', amount: 650 }, { day: 'Sun', amount: 450 },
];

const DEMO_TRIPS = [
  { _id: 't1', type: 'ride', from: 'Civil Lines', to: 'Model Town', amount: 85, time: '10:30 AM', status: 'completed' },
  { _id: 't2', type: 'order', items: 'Grocery Order', amount: 120, time: '12:15 PM', status: 'completed' },
  { _id: 't3', type: 'ride', from: 'Dugri', to: 'Focal Point', amount: 110, time: '2:45 PM', status: 'completed' },
  { _id: 't4', type: 'order', items: 'Food Order', amount: 80, time: '4:20 PM', status: 'completed' },
  { _id: 't5', type: 'ride', from: 'BRS Nagar', to: 'Clock Tower', amount: 95, time: '6:00 PM', status: 'completed' },
];

const EarningsDriver = () => {
  const [period, setPeriod] = useState('week');
  const maxAmount = Math.max(...DEMO_DAILY.map(d => d.amount));

  const current = DEMO_EARNINGS[period];

  return (
    <div className="page">
      <h1 className="page-title">💰 My Earnings</h1>

      {/* Period Selector */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {['today', 'week', 'month', 'total'].map(p => (
          <button key={p} className={`tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card card-body" style={{ textAlign: 'center', background: 'linear-gradient(135deg,var(--primary),#ff8c42)', color: 'white' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{current.amount}</div>
          <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Earnings</div>
        </div>
        <div className="card card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{current.trips}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Trips</div>
        </div>
        <div className="card card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{current.hours}h</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Online</div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="card card-body" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>📊 This Week</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160 }}>
          {DEMO_DAILY.map(d => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>₹{d.amount}</div>
              <div style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                height: `${(d.amount / maxAmount) * 120}px`,
                background: d.day === 'Fri' ? 'var(--primary)' : 'linear-gradient(180deg,#ffb347,#ff8c42)',
                transition: 'height 0.5s',
              }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>{d.day}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--muted)', fontSize: '0.82rem' }}>
          Best day: <strong style={{ color: 'var(--primary)' }}>Friday ₹1,100</strong>
        </div>
      </div>

      {/* Today's Trips */}
      <div className="card card-body">
        <h3 style={{ marginBottom: 16 }}>🏍️ Today's Trips</h3>
        {DEMO_TRIPS.map(t => (
          <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.type === 'ride' ? '#fff5ee' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                {t.type === 'ride' ? '🏍️' : '📦'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {t.type === 'ride' ? `${t.from} → ${t.to}` : t.items}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{t.time}</div>
              </div>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1rem' }}>+₹{t.amount}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontWeight: 800, fontSize: '1rem', paddingTop: 12, borderTop: '2px solid var(--border)' }}>
          <span>Total Today</span>
          <span style={{ color: 'var(--primary)' }}>₹{DEMO_TRIPS.reduce((s, t) => s + t.amount, 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsDriver;
