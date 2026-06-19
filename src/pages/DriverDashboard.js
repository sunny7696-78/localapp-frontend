import React, { useState, useEffect, useCallback } from 'react';
import { orderAPI, rideAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_ORDERS = [
  { _id: 'do1', type: 'grocery', status: 'pending', total: 350, estimatedTime: '15-20 min', deliveryAddress: { street: 'H.No 45', area: 'Civil Lines', city: 'Ludhiana' }, items: [{ name: 'Amul Milk', quantity: 2 }, { name: 'Tomatoes', quantity: 1 }], user: { name: 'Gurpreet Singh', phone: '9876500001' } },
  { _id: 'do2', type: 'food', status: 'pending', total: 480, estimatedTime: '30-40 min', deliveryAddress: { street: 'H.No 22', area: 'Model Town', city: 'Ludhiana' }, items: [{ name: 'Dal Makhani', quantity: 1 }, { name: 'Naan', quantity: 2 }], user: { name: 'Ramesh Kumar', phone: '9876500002' } },
];

const DEMO_RIDES = [
  { _id: 'dr1', vehicleType: 'bike', status: 'searching', fare: 85, pickup: { address: 'Civil Lines' }, drop: { address: 'Sarabha Nagar' }, user: { name: 'Simran Kaur', phone: '9876500003' } },
  { _id: 'dr2', vehicleType: 'auto', status: 'searching', fare: 110, pickup: { address: 'Model Town' }, drop: { address: 'Focal Point' }, user: { name: 'Ajay Sharma', phone: '9876500004' } },
];

const DriverDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [rides, setRides] = useState(DEMO_RIDES);
  const [myOrders, setMyOrders] = useState([]);
  const [available, setAvailable] = useState(user?.isAvailable || false);
  const [earnings, setEarnings] = useState({ today: 650, week: 3200, total: 18500, trips: 12 });

  const fetchAvailable = useCallback(() => {
    orderAPI.available().then(r => { if (r.data.length > 0) setOrders(r.data); }).catch(() => {});
    rideAPI.available({ vehicleType: user?.vehicle?.type }).then(r => { if (r.data.length > 0) setRides(r.data); }).catch(() => {});
  }, [user]);

  useEffect(() => { fetchAvailable(); }, [fetchAvailable]);

  const toggleAvailability = async () => {
    try {
      await authAPI.updateProfile({ isAvailable: !available });
      setAvailable(!available);
      toast.success(available ? 'You are now offline' : 'You are now online!');
    } catch { setAvailable(!available); toast.success(available ? 'Offline' : 'Online!'); }
  };

  const acceptOrder = async (orderId) => {
    try {
      await orderAPI.updateStatus(orderId, 'accepted');
    } catch {}
    const order = orders.find(o => o._id === orderId);
    setOrders(prev => prev.filter(o => o._id !== orderId));
    setMyOrders(prev => [{ ...order, status: 'accepted' }, ...prev]);
    toast.success('Order accepted!');
  };

  const updateOrderStatus = async (orderId, status) => {
    try { await orderAPI.updateStatus(orderId, status); } catch {}
    setMyOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    if (status === 'delivered') toast.success('Order delivered! 🎉');
  };

  const acceptRide = async (rideId) => {
    try { await rideAPI.accept(rideId); } catch {}
    const ride = rides.find(r => r._id === rideId);
    setRides(prev => prev.filter(r => r._id !== rideId));
    setMyOrders(prev => [{ ...ride, type: 'ride', status: 'accepted' }, ...prev]);
    toast.success('Ride accepted!');
  };

  const ORDER_STATUS_FLOW = { accepted: 'picked_up', picked_up: 'delivered' };
  const ORDER_STATUS_LABEL = { accepted: '🏃 Pick Up', picked_up: '📦 Mark Delivered' };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>👋 Hey, {user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            {user?.vehicle?.type && `🏍️ ${user.vehicle.type.toUpperCase()} · ${user.vehicle.number || 'No plate set'}`}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            onClick={toggleAvailability}
            style={{
              width: 56, height: 28, borderRadius: 14,
              background: available ? 'var(--green)' : 'var(--border)',
              position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
            }}
          >
            <div style={{ position: 'absolute', top: 3, left: available ? 30 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: 4, color: available ? 'var(--green)' : 'var(--muted)', fontWeight: 700 }}>
            {available ? 'ONLINE' : 'OFFLINE'}
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: "Today's Earnings", value: `₹${earnings.today}`, icon: '💰' },
          { label: 'This Week', value: `₹${earnings.week}`, icon: '📅' },
          { label: 'Total Earned', value: `₹${earnings.total}`, icon: '🏦' },
          { label: "Today's Trips", value: earnings.trips, icon: '🏍️' },
        ].map(s => (
          <div key={s.label} className="card card-body" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          📦 Available Orders {orders.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '0.7rem', marginLeft: 4 }}>{orders.length}</span>}
        </button>
        <button className={`tab ${tab === 'rides' ? 'active' : ''}`} onClick={() => setTab('rides')}>
          🏍️ Available Rides {rides.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '0.7rem', marginLeft: 4 }}>{rides.length}</span>}
        </button>
        <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
          ✅ My Active {myOrders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length > 0 && <span style={{ background: 'var(--green)', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '0.7rem', marginLeft: 4 }}>{myOrders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length}</span>}
        </button>
      </div>

      {/* Available Orders */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!available && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: 14, color: '#92400e', fontWeight: 600, textAlign: 'center' }}>
              ⚠️ Go Online to accept orders
            </div>
          )}
          {orders.map(order => (
            <div key={order._id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{order.type === 'grocery' ? '🛒 Grocery' : '🍔 Food'} Order</span>
                  <span style={{ marginLeft: 8, color: 'var(--muted)', fontSize: '0.82rem' }}>#{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{order.total}</span>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: 10 }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>👤 Customer: </span>
                  <strong>{order.user?.name}</strong> · {order.user?.phone}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>📍 Deliver to: </span>
                  <strong>{order.deliveryAddress?.street}, {order.deliveryAddress?.area}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)' }}>🕐 </span>{order.estimatedTime}
                  <span style={{ marginLeft: 12, color: 'var(--muted)' }}>📦 Items: </span>
                  {order.items?.slice(0, 2).map(i => i.name).join(', ')}
                  {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ''}
                </div>
              </div>
              <button
                className="btn btn-green btn-block"
                onClick={() => acceptOrder(order._id)}
                disabled={!available}
              >
                ✅ Accept Order
              </button>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <h3>No orders available</h3>
              <p>New orders will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Available Rides */}
      {tab === 'rides' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!available && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: 14, color: '#92400e', fontWeight: 600, textAlign: 'center' }}>
              ⚠️ Go Online to accept rides
            </div>
          )}
          {rides.map(ride => (
            <div key={ride._id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700 }}>{ride.vehicleType === 'bike' ? '🏍️' : ride.vehicleType === 'auto' ? '🛺' : '🚗'} {ride.vehicleType?.toUpperCase()} Ride</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{ride.fare}</span>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>👤 </span><strong>{ride.user?.name}</strong> · {ride.user?.phone}
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div><span style={{ color: 'var(--green)', fontWeight: 700 }}>● </span><strong>{ride.pickup?.address}</strong></div>
                  <div style={{ color: 'var(--muted)' }}>→</div>
                  <div><span style={{ color: 'var(--red)', fontWeight: 700 }}>● </span><strong>{ride.drop?.address}</strong></div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => acceptRide(ride._id)}
                disabled={!available}
              >
                🏍️ Accept Ride
              </button>
            </div>
          ))}
          {rides.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🛺</div>
              <h3>No rides available</h3>
              <p>New ride requests will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Active / In-progress */}
      {tab === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myOrders.filter(o => o.status !== 'delivered' && o.status !== 'completed').map(item => (
            <div key={item._id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700 }}>
                  {item.type === 'ride' ? '🏍️ Ride' : item.type === 'grocery' ? '🛒 Grocery' : '🍔 Food'}
                </span>
                <span className="badge badge-orange">{item.status?.replace('_', ' ').toUpperCase()}</span>
              </div>
              {item.type === 'ride' ? (
                <div style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                  <div><strong>{item.pickup?.address}</strong> → <strong>{item.drop?.address}</strong></div>
                  <div style={{ marginTop: 6, color: 'var(--muted)' }}>💰 ₹{item.fare} · Customer: {item.user?.name}</div>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                  <div>📍 {item.deliveryAddress?.street}, {item.deliveryAddress?.area}</div>
                  <div style={{ marginTop: 4, color: 'var(--muted)' }}>💰 ₹{item.total} · {item.user?.name}</div>
                </div>
              )}
              {item.type !== 'ride' && ORDER_STATUS_FLOW[item.status] && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => updateOrderStatus(item._id, ORDER_STATUS_FLOW[item.status])}
                >
                  {ORDER_STATUS_LABEL[item.status]}
                </button>
              )}
              {item.type === 'ride' && item.status === 'accepted' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                    try { rideAPI.updateStatus(item._id, 'started'); } catch {}
                    setMyOrders(prev => prev.map(o => o._id === item._id ? { ...o, status: 'started' } : o));
                  }}>▶ Start Ride</button>
                </div>
              )}
              {item.type === 'ride' && item.status === 'started' && (
                <button className="btn btn-green btn-block" onClick={() => {
                  try { rideAPI.updateStatus(item._id, 'completed'); } catch {}
                  setMyOrders(prev => prev.map(o => o._id === item._id ? { ...o, status: 'completed' } : o));
                  toast.success('Ride completed! 🎉');
                }}>🏁 Complete Ride</button>
              )}
            </div>
          ))}
          {myOrders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length === 0 && (
            <div className="empty">
              <div className="empty-icon">✅</div>
              <h3>No active tasks</h3>
              <p>Accept orders or rides to start earning</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
