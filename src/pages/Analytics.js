import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const DEMO_STATS = { totalOrders: 247, totalRides: 183, totalUsers: 412, totalRevenue: 48650, weekOrders: 34, monthOrders: 127, weekRevenue: 6820 };
const DEMO_DAILY = [
  { _id: '2026-06-11', count: 8, revenue: 1240 },
  { _id: '2026-06-12', count: 12, revenue: 1890 },
  { _id: '2026-06-13', count: 6, revenue: 920 },
  { _id: '2026-06-14', count: 15, revenue: 2340 },
  { _id: '2026-06-15', count: 18, revenue: 2780 },
  { _id: '2026-06-16', count: 11, revenue: 1650 },
  { _id: '2026-06-17', count: 9, revenue: 1420 },
];

const Analytics = () => {
  const [stats, setStats] = useState(DEMO_STATS);
  const [daily, setDaily] = useState(DEMO_DAILY);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    API.get('/analytics/overview').then(r => { setStats(r.data); if (r.data.dailyOrders?.length > 0) setDaily(r.data.dailyOrders); }).catch(() => {});
  }, []);

  const maxRev = Math.max(...daily.map(d => d.revenue));
  const maxOrd = Math.max(...daily.map(d => d.count));

  const dayLabel = (dateStr) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div className="page">
      <h1 className="page-title">📊 Analytics Dashboard</h1>

      {/* Period Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {['week', 'month', 'all'].map(p => (
          <button key={p} className={`tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            {p === 'week' ? 'Is Hafte' : p === 'month' ? 'Is Mahine' : 'Sab'}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: '📦', label: 'Total Orders', value: stats.totalOrders, color: 'var(--primary)' },
          { icon: '🏍️', label: 'Total Rides', value: stats.totalRides, color: '#7c3aed' },
          { icon: '👥', label: 'Users', value: stats.totalUsers, color: 'var(--green)' },
          { icon: '💰', label: 'Revenue', value: '₹' + (stats.totalRevenue || 0).toLocaleString(), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card card-body" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20 }}>💰 Daily Revenue (Last 7 Days)</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160, marginBottom: 8 }}>
          {daily.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>₹{d.revenue}</div>
              <div style={{ width: '100%', borderRadius: '6px 6px 0 0', height: `${(d.revenue / maxRev) * 120}px`, background: i === daily.length - 1 ? 'var(--primary)' : 'linear-gradient(180deg,#ffb347,#ff8c42)', transition: 'height 0.5s', minHeight: 4 }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{dayLabel(d._id)}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          Is hafte total: <strong style={{ color: 'var(--primary)' }}>₹{stats.weekRevenue?.toLocaleString()}</strong>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20 }}>📦 Daily Orders (Last 7 Days)</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120, marginBottom: 8 }}>
          {daily.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>{d.count}</div>
              <div style={{ width: '100%', borderRadius: '6px 6px 0 0', height: `${(d.count / maxOrd) * 90}px`, background: 'linear-gradient(180deg,#818cf8,#6366f1)', minHeight: 4 }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{dayLabel(d._id)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { label: 'Is Hafte Orders', value: stats.weekOrders, icon: '📦', color: '#dbeafe' },
          { label: 'Is Mahine Orders', value: stats.monthOrders, icon: '📅', color: '#fef3c7' },
          { label: 'Is Hafte Revenue', value: '₹' + (stats.weekRevenue || 0).toLocaleString(), icon: '💰', color: '#dcfce7' },
        ].map(s => (
          <div key={s.label} className="card card-body" style={{ background: s.color, border: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
