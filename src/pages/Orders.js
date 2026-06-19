import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { OrderSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const STATUS_BADGE = { pending:'badge-yellow', accepted:'badge-blue', preparing:'badge-orange', picked_up:'badge-orange', delivered:'badge-green', cancelled:'badge-red' };
const STATUS_LABEL = { pending:'⏳ Pending', accepted:'✅ Accepted', preparing:'👨‍🍳 Prepare Ho Raha', picked_up:'🏍️ Aa Raha Hai', delivered:'📦 Deliver Ho Gaya', cancelled:'❌ Cancel' };

const DEMO_ORDERS = [
  { _id:'o1', type:'grocery', status:'delivered', total:350, createdAt: new Date(Date.now()-86400000).toISOString(), items:[{name:'Amul Milk',quantity:2,price:66},{name:'Tamatar',quantity:1,price:35}], estimatedTime:'15-20 min' },
  { _id:'o2', type:'food', status:'preparing', total:480, createdAt: new Date(Date.now()-3600000).toISOString(), items:[{name:'Dal Makhani',quantity:1,price:160},{name:'Roti',quantity:2,price:18}], estimatedTime:'30-40 min' },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    orderAPI.myOrders().then(r => { if (r.data.length > 0) setOrders(r.data); else setOrders(DEMO_ORDERS); })
      .catch(() => setOrders(DEMO_ORDERS)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Order cancel karna hai?')) return;
    try { await orderAPI.cancel(id); } catch {}
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
    toast.success('Order cancel ho gaya');
  };

  const handleReorder = (order) => {
    clearCart();
    order.items.forEach(item => addToCart({ _id: item.itemId || item._id || Math.random(), name: item.name, price: item.price, unit: 'piece' }, order.type));
    toast.success('Items cart mein add ho gaye!');
    navigate('/cart');
  };

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));
  const displayOrders = tab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="page">
      <h1 className="page-title">📦 Mere Orders</h1>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
          🔄 Active {activeOrders.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '0.7rem', marginLeft: 4 }}>{activeOrders.length}</span>}
        </button>
        <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>
          📋 History ({pastOrders.length})
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">{tab === 'active' ? '✅' : '📦'}</div>
          <h3>{tab === 'active' ? 'Koi active order nahi' : 'Koi past order nahi'}</h3>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Order Karo</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayOrders.map(o => (
            <div key={o._id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {o.type === 'grocery' ? '🛒 Kirana' : '🍔 Food'} Order · #{o._id.slice(-6).toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 3 }}>
                    {new Date(o.createdAt).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{o.total}</div>
                  <span className={`badge ${STATUS_BADGE[o.status] || 'badge-blue'}`} style={{ marginTop: 4, fontSize: '0.72rem' }}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>
              </div>

              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 12 }}>
                {o.items?.slice(0, 2).map(i => i.name).join(', ')}{o.items?.length > 2 ? ` +${o.items.length - 2} aur` : ''}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {!['delivered', 'cancelled'].includes(o.status) && (
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => navigate('/track/' + o._id)}>
                    🗺️ Track
                  </button>
                )}
                {o.status === 'delivered' && (
                  <button className="btn btn-green btn-sm" style={{ flex: 1 }} onClick={() => handleReorder(o)}>
                    🔄 Reorder
                  </button>
                )}
                {['pending', 'accepted'].includes(o.status) && (
                  <button className="btn btn-sm" style={{ background: 'var(--red)', color: 'white' }} onClick={() => handleCancel(o._id)}>
                    ❌ Cancel
                  </button>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/orders/' + o._id)}>Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
