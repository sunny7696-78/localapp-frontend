import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';

const STATUS_STEPS = ['pending', 'accepted', 'preparing', 'picked_up', 'delivered'];
const STATUS_LABELS = { pending: '⏳ Pending', accepted: '✅ Accepted', preparing: '👨‍🍳 Preparing', picked_up: '🏍️ On the Way', delivered: '📦 Delivered', cancelled: '❌ Cancelled' };
const STATUS_BADGE = { pending: 'badge-yellow', accepted: 'badge-blue', preparing: 'badge-orange', picked_up: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red' };

const DEMO_ORDERS = [
  { _id: 'o1', type: 'grocery', status: 'delivered', total: 350, createdAt: new Date(Date.now() - 86400000).toISOString(), items: [{ name: 'Amul Milk', quantity: 2 }, { name: 'Tomatoes', quantity: 1 }], estimatedTime: '15-20 min' },
  { _id: 'o2', type: 'food', status: 'on_the_way', total: 480, createdAt: new Date(Date.now() - 3600000).toISOString(), items: [{ name: 'Dal Makhani', quantity: 1 }, { name: 'Tandoori Roti', quantity: 2 }], estimatedTime: '30-40 min' },
];

const Orders = () => {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    orderAPI.myOrders().then(res => { if (res.data.length > 0) setOrders(res.data); }).catch(() => {});
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
    } catch {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
    }
  };

  if (selected) {
    const o = orders.find(o => o._id === selected);
    const stepIdx = STATUS_STEPS.indexOf(o.status);
    return (
      <div className="page">
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, marginBottom: 16 }}>← Back to Orders</button>
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2>Order #{o._id.slice(-6).toUpperCase()}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <span className={`badge ${STATUS_BADGE[o.status]}`}>{STATUS_LABELS[o.status]}</span>
          </div>

          {o.status !== 'cancelled' && o.status !== 'delivered' && (
            <>
              <h3 style={{ marginBottom: 12 }}>Order Status</h3>
              <div className="stepper">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="step">
                    <div className={`step-dot ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}`}>
                      {i < stepIdx ? '✓' : i + 1}
                    </div>
                    <div className="step-label">{s === 'picked_up' ? 'On Way' : s.charAt(0).toUpperCase() + s.slice(1)}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 20 }}>
                🕐 Estimated: {o.estimatedTime}
              </div>
            </>
          )}

          <h3 style={{ marginBottom: 12 }}>Items Ordered</h3>
          {o.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <span>{item.name} × {item.quantity}</span>
              <span style={{ color: 'var(--muted)' }}>₹{(item.price || 0) * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 12, fontSize: '1rem' }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>₹{o.total}</span>
          </div>

          {['pending', 'accepted'].includes(o.status) && (
            <button className="btn btn-red btn-block" style={{ marginTop: 16 }} onClick={() => handleCancel(o._id)}>
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">📦 My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Start Ordering</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(o => (
            <div key={o._id} className="card card-body" style={{ cursor: 'pointer' }} onClick={() => setSelected(o._id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {o.type === 'grocery' ? '🛒 Grocery Order' : '🍔 Food Order'} · #{o._id.slice(-6).toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.83rem', margin: '4px 0' }}>
                    {o.items.slice(0, 2).map(i => i.name).join(', ')}{o.items.length > 2 ? ` +${o.items.length - 2} more` : ''}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{o.total}</div>
                  <span className={`badge ${STATUS_BADGE[o.status] || 'badge-blue'}`} style={{ marginTop: 6 }}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
