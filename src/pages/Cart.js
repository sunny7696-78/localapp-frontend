import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const DORAHA_AREAS = ['Doraha Mandi', 'Doraha Bus Stand', 'Doraha Grain Market', 'Doraha Civil Hospital', 'Sidhwan Bet', 'Raikot Road Doraha', 'Sahnewal', 'Mullanpur Dakha'];

const Cart = () => {
  const { cartItems, cartType, restaurantId, addToCart, removeFromCart, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: user?.address?.street || '', area: user?.address?.area || 'Doraha Mandi', city: 'Doraha, Ludhiana' });
  const [payment, setPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  if (cartItems.length === 0) return (
    <div className="page">
      <div className="empty">
        <div className="empty-icon">🛒</div>
        <h3>Cart khali hai</h3>
        <p>Kuch toh add karo!</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => navigate('/grocery')}>🛒 Kirana</button>
          <button className="btn btn-secondary" onClick={() => navigate('/food')}>🍔 Khana</button>
        </div>
      </div>
    </div>
  );

  const deliveryFee = total >= 299 ? 0 : 20;
  const grandTotal = total - discount + deliveryFee;

  const applyPromo = async () => {
    if (!promoCode) { toast.error('Promo code daalo'); return; }
    const DEMO_PROMOS = { 'DORAHA50': { discount: 50, desc: '₹50 off' }, 'WELCOME50': { discount: 50, desc: 'Welcome offer' }, 'SAVE20': { discount: Math.round(total * 0.2), desc: '20% off' } };
    try {
      const res = await fetch('/api/promos/apply', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') }, body: JSON.stringify({ code: promoCode, orderTotal: total, orderType: cartType }) });
      const data = await res.json();
      if (data.valid) { setDiscount(data.discount); setPromoApplied(data.code); toast.success('Promo applied! -₹' + data.discount); return; }
    } catch {}
    const demo = DEMO_PROMOS[promoCode.toUpperCase()];
    if (demo) { setDiscount(demo.discount); setPromoApplied(promoCode.toUpperCase()); toast.success(demo.desc + ' apply ho gaya!'); }
    else toast.error('Invalid promo code');
  };

  const handlePlaceOrder = async () => {
    if (!address.street) { toast.error('Ghar ka address daalo'); return; }
    setPlacing(true);
    try {
      const res = await orderAPI.place({ type: cartType, items: cartItems.map(i => ({ itemId: i._id, name: i.name, price: i.price, quantity: i.qty, image: i.image })), deliveryAddress: address, restaurantId, paymentMethod: payment, notes, discount });
      clearCart();
      toast.success('Order place ho gaya! OTP: ' + res.data.otp);
      navigate('/orders/' + res.data._id);
    } catch {
      clearCart(); toast.success('Order place ho gaya! (Demo)');
      navigate('/orders');
    } finally { setPlacing(false); }
  };

  return (
    <div className="page">
      <h1 className="page-title">🛍️ Tera Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          {/* Items */}
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>{cartType === 'grocery' ? '🛒 Kirana Items' : '🍔 Khane Ka Order'}</h3>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>₹{item.price} × {item.qty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => removeFromCart(item._id)}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(item, cartType)}>+</button>
                  </div>
                  <strong style={{ color: 'var(--primary)', minWidth: 60, textAlign: 'right' }}>₹{item.price * item.qty}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>📍 Delivery Address (Doraha)</h3>
            <div className="form-group">
              <label className="form-label">Ghar / Dukan Ka Address *</label>
              <input className="form-input" value={address.street} placeholder="e.g. H.No. 123, Gali No. 5" onChange={e => setAddress({ ...address, street: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area</label>
                <select className="form-input form-select" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })}>
                  {DORAHA_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Shehar</label>
                <input className="form-input" value="Doraha, Ludhiana" disabled />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Special Instructions</label>
              <input className="form-input" placeholder="e.g. Gate pe ring mat karo..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          {/* Promo Code */}
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>🎟️ Promo Code</h3>
            {promoApplied ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7', borderRadius: 8, padding: '10px 14px' }}>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>✅ {promoApplied} applied!</span>
                <button onClick={() => { setDiscount(0); setPromoApplied(''); setPromoCode(''); }} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" placeholder="Code daalo (DORAHA50)" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ textTransform: 'uppercase' }} />
                <button className="btn btn-outline" onClick={applyPromo}>Apply</button>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>💳 Payment</h3>
            {[{ key: 'cod', label: '💵 Nakit (Cash on Delivery)', desc: 'Delivery pe paisa do' }, { key: 'online', label: '📱 Online (UPI/Card)', desc: 'Abhi pay karo' }].map(p => (
              <div key={p.key} onClick={() => setPayment(p.key)}
                style={{ padding: 14, border: '2px solid ' + (payment === p.key ? 'var(--primary)' : 'var(--border)'), borderRadius: 10, marginBottom: 10, cursor: 'pointer', background: payment === p.key ? '#fff5ee' : 'white' }}>
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Bill */}
          <div className="card card-body">
            <h3 style={{ marginBottom: 16 }}>🧾 Bill</h3>
            {[
              { label: 'Subtotal', value: '₹' + total },
              { label: 'Delivery', value: deliveryFee === 0 ? 'FREE 🎉' : '₹' + deliveryFee },
              ...(discount > 0 ? [{ label: 'Discount (' + promoApplied + ')', value: '-₹' + discount, color: 'var(--green)' }] : []),
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                <span style={{ color: r.color || 'var(--text)', fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
            {total < 299 && <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textAlign: 'center', marginBottom: 8 }}>₹{299 - total} aur add karo — FREE delivery!</div>}
            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Order ho raha...' : 'Order Karo ₹' + grandTotal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
