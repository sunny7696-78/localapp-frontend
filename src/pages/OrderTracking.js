import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'accepted', label: 'Accepted', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'picked_up', label: 'On the Way', icon: '🏍️' },
  { key: 'delivered', label: 'Delivered', icon: '📦' },
];

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [polling, setPolling] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOne(id);
      setOrder(res.data);
      if (['delivered', 'cancelled'].includes(res.data.status)) setPolling(false);
    } catch {
      // demo mode
      setOrder({
        _id: id,
        type: 'grocery',
        status: 'preparing',
        total: 350,
        estimatedTime: '15-20 min',
        otp: '7432',
        deliveryAddress: { street: 'H.No 45', area: 'Civil Lines', city: 'Ludhiana' },
        items: [{ name: 'Amul Milk', quantity: 2, price: 66 }, { name: 'Tomatoes', quantity: 1, price: 40 }],
        driver: { name: 'Harpreet Singh', phone: '9876543210', vehicle: { type: 'bike', number: 'PB10AB1234' } },
        createdAt: new Date().toISOString(),
      });
      setPolling(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    let interval;
    if (polling) interval = setInterval(fetchOrder, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [id, polling]);

  if (!order) return <div className="loader"><div className="spinner" /></div>;

  const currentStepIdx = STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="page" style={{ maxWidth: 600, margin: '0 auto' }}>
      <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
        ← All Orders
      </button>

      <div className="card card-body" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>
              {order.type === 'grocery' ? '🛒 Grocery' : '🍔 Food'} Order
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>#{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>₹{order.total}</div>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>ETA: {order.estimatedTime}</div>
            )}
          </div>
        </div>

        {order.status === 'cancelled' ? (
          <div style={{ background: '#fee2e2', borderRadius: 10, padding: 16, textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
            ❌ Order Cancelled
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 2, background: 'var(--border)', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 20, left: '10%', height: 2, background: 'var(--primary)', zIndex: 0, width: `${Math.max(0, currentStepIdx / (STEPS.length - 1)) * 80}%`, transition: 'width 0.5s' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                {STEPS.map((step, i) => (
                  <div key={step.key} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
                      background: i <= currentStepIdx ? 'var(--primary)' : 'var(--border)',
                      color: i <= currentStepIdx ? 'white' : 'var(--muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', transition: 'background 0.3s',
                      border: i === currentStepIdx ? '3px solid var(--primary-dark)' : '3px solid transparent',
                    }}>
                      {step.icon}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: i <= currentStepIdx ? 'var(--primary)' : 'var(--muted)', fontWeight: i === currentStepIdx ? 700 : 400 }}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live status message */}
            {order.status !== 'delivered' && (
              <div style={{ background: '#fff5ee', border: '1px solid #ffedd5', borderRadius: 10, padding: 14, textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                  {order.status === 'pending' && '⏳ Waiting for confirmation...'}
                  {order.status === 'accepted' && '✅ Order accepted! Preparing soon...'}
                  {order.status === 'preparing' && '👨‍🍳 Your order is being prepared...'}
                  {order.status === 'picked_up' && '🏍️ Your order is on the way!'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>ETA: {order.estimatedTime}</div>
              </div>
            )}

            {order.status === 'delivered' && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '1.1rem' }}>✅ Order Delivered!</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Thank you for ordering!</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Driver Info */}
      {order.driver && (
        <div className="card card-body" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12 }}>🏍️ Delivery Partner</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {order.driver.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{order.driver.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>
                  {order.driver.vehicle?.type?.toUpperCase()} · {order.driver.vehicle?.number}
                </div>
              </div>
            </div>
            <a href={`tel:${order.driver.phone}`} className="btn btn-primary btn-sm">📞 Call</a>
          </div>
        </div>
      )}

      {/* OTP */}
      {order.otp && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="card card-body" style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 8 }}>Delivery OTP (share with delivery partner)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: 8, color: 'var(--primary)' }}>{order.otp}</div>
        </div>
      )}

      {/* Items */}
      <div className="card card-body">
        <h3 style={{ marginBottom: 12 }}>Order Items</h3>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
            <span>{item.name} × {item.quantity}</span>
            <span style={{ color: 'var(--muted)' }}>₹{(item.price || 0) * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 12, fontSize: '1rem', color: 'var(--primary)' }}>
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
