import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, cartType, restaurantId, addToCart, removeFromCart, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: user?.address?.street || '', area: user?.address?.area || 'Civil Lines', city: 'Ludhiana' });
  const [payment, setPayment] = useState('cod');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add items from Grocery or Food section</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => navigate('/grocery')}>🛒 Browse Grocery</button>
            <button className="btn btn-secondary" onClick={() => navigate('/food')}>🍔 Order Food</button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = 20;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!address.street) { toast.error('Please enter delivery address'); return; }
    setPlacing(true);
    try {
      const res = await orderAPI.place({
        type: cartType,
        items: cartItems.map(i => ({ itemId: i._id, name: i.name, price: i.price, quantity: i.qty, image: i.image })),
        deliveryAddress: address,
        restaurantId: restaurantId,
        paymentMethod: payment,
        notes,
      });
      clearCart();
      toast.success(`Order placed! OTP: ${res.data.otp}`);
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      // Offline demo mode
      const fakeId = 'demo_' + Date.now();
      clearCart();
      toast.success('Order placed! (Demo mode)');
      navigate('/orders');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">🛍️ Your Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Order Items ({cartType === 'grocery' ? '🛒 Grocery' : '🍔 Food'})</h3>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>₹{item.price} × {item.qty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => removeFromCart(item._id)}>−</button>
                    <span style={{ fontWeight: 700 }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(item, cartType)}>+</button>
                  </div>
                  <strong style={{ color: 'var(--primary)', minWidth: 60, textAlign: 'right' }}>₹{item.price * item.qty}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-body">
            <h3 style={{ marginBottom: 12 }}>📍 Delivery Address</h3>
            <div className="form-group">
              <label className="form-label">Street / House No.</label>
              <input className="form-input" value={address.street} placeholder="e.g. H.No. 123, Street 5"
                onChange={e => setAddress({ ...address, street: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area</label>
                <select className="form-input form-select" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })}>
                  {['Civil Lines', 'Model Town', 'Sarabha Nagar', 'Dugri', 'BRS Nagar', 'Gurdev Nagar', 'Focal Point', 'Jamalpur', 'Shaheed Bhagat Singh Nagar'].map(a => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value="Ludhiana" disabled />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <input className="form-input" placeholder="e.g. Don't ring bell, call on arrival..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>💳 Payment Method</h3>
            {[{ key: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when delivered' }, { key: 'online', label: '📱 Online Payment', desc: 'UPI, Card, Netbanking' }].map(p => (
              <div key={p.key} onClick={() => setPayment(p.key)}
                style={{ padding: 14, border: `2px solid ${payment === p.key ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, marginBottom: 10, cursor: 'pointer', background: payment === p.key ? '#fff5ee' : 'white' }}>
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="card card-body">
            <h3 style={{ marginBottom: 16 }}>🧾 Bill Summary</h3>
            {[{ label: 'Subtotal', value: `₹${total}` }, { label: 'Delivery Fee', value: `₹${deliveryFee}` }, { label: 'Discount', value: '₹0' }].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing Order...' : `Place Order ₹${grandTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
