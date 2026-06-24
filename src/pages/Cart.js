import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import API from '../utils/api';
import RazorpayButton from '../components/RazorpayButton';
import toast from 'react-hot-toast';

const DORAHA_AREAS = ['Doraha Mandi','Doraha Bus Stand','Doraha Grain Market','Doraha Civil Hospital','Sidhwan Bet','Raikot Road Doraha','Sahnewal','Mullanpur Dakha'];
const WA_NUMBER = '919876500002';

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
  const [pendingOrderId, setPendingOrderId] = useState(null);

  if (cartItems.length === 0) return (
    <div className="page">
      <div className="empty" style={{ paddingTop: 60 }}>
        <div style={{ fontSize: '5rem', marginBottom: 12 }}>🛒</div>
        <h3>Cart Khali Hai!</h3>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Kuch toh add karo — kirana ya khana!</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
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
    try {
      const res = await API.post('/promos/apply', { code: promoCode, orderTotal: total, orderType: cartType });
      if (res.data.valid) {
        setDiscount(res.data.discount);
        setPromoApplied(res.data.code);
        toast.success((res.data.description || 'Promo apply ho gaya!') + ' -₹' + res.data.discount);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Galat ya expired promo code');
    }
  };

  const createOrderRecord = async () => {
    const res = await orderAPI.place({
      type: cartType,
      items: cartItems.map(i => ({ itemId: i._id, name: i.name, price: i.price, quantity: i.qty })),
      deliveryAddress: address,
      restaurantId,
      paymentMethod: payment,
      notes,
      discount,
    });
    return res.data;
  };

  const handlePlaceOrder = async () => {
    if (!address.street) { toast.error('Apna address daalo'); return; }
    setPlacing(true);
    try {
      const order = await createOrderRecord();
      if (payment === 'cod') {
        clearCart();
        toast.success('🎉 Order place ho gaya! OTP: ' + order.otp);
        navigate('/track/' + order._id);
      } else {
        setPendingOrderId(order._id);
        toast('Order ban gaya — ab payment complete karo', { icon: '💳' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order place nahi hua, dobara try karo');
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = (orderId) => {
    clearCart();
    navigate('/track/' + orderId);
  };

  const handleWhatsApp = () => {
    if (!address.street) { toast.error('Pehle address daalo'); return; }
    const itemList = cartItems.map(i => `• ${i.name} ×${i.qty} = ₹${i.price * i.qty}`).join('\n');
    const msg = `🏪 *LocalApp Doraha - Naya Order*\n\n` +
      `👤 Customer: ${user?.name}\n📞 Phone: ${user?.phone}\n\n` +
      `📦 *${cartType === 'grocery' ? 'Kirana' : 'Food'} Order:*\n${itemList}\n\n` +
      `💰 Subtotal: ₹${total}\n🚚 Delivery: ₹${deliveryFee}\n` +
      (discount > 0 ? `🎟️ Discount: -₹${discount}\n` : '') +
      `✅ *Total: ₹${grandTotal}*\n\n` +
      `📍 *Delivery Address:*\n${address.street}, ${address.area}, ${address.city}\n\n` +
      `💳 Payment: ${payment === 'cod' ? 'Cash on Delivery' : 'Online'}\n` +
      (notes ? `📝 Notes: ${notes}\n` : '') +
      `\nPlease confirm karo! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="page">
      <h1 className="page-title">🛍️ Tera Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <div>
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3>{cartType === 'grocery' ? '🛒 Kirana Items' : '🍔 Food Items'} ({itemCount})</h3>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>🗑 Clear</button>
            </div>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>₹{item.price} × {item.qty}</div>
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

          <div className="card card-body" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>📍 Delivery Address</h3>
            <div className="form-group">
              <label className="form-label">Ghar / Dukan Ka Address *</label>
              <input className="form-input" value={address.street} placeholder="H.No. 123, Gali No. 5"
                onChange={e => setAddress({ ...address, street: e.target.value })} disabled={!!pendingOrderId} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area</label>
                <select className="form-input form-select" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} disabled={!!pendingOrderId}>
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
              <input className="form-input" placeholder="e.g. Gate pe ring mat karo..." value={notes} onChange={e => setNotes(e.target.value)} disabled={!!pendingOrderId} />
            </div>
          </div>
        </div>

        <div>
          {!pendingOrderId && (
            <div className="card card-body" style={{ marginBottom: 14 }}>
              <h3 style={{ marginBottom: 10 }}>🎟️ Promo Code</h3>
              {promoApplied ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--green)' }}>✅ {promoApplied} — -₹{discount}</span>
                  <button onClick={() => { setDiscount(0); setPromoApplied(''); setPromoCode(''); }} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>×</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-input" placeholder="DORAHA50" value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
                    <button className="btn btn-outline" onClick={applyPromo}>Apply</button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 8 }}>
                    Admin se valid promo code lekar yahan daalo
                  </div>
                </>
              )}
            </div>
          )}

          {!pendingOrderId && (
            <div className="card card-body" style={{ marginBottom: 14 }}>
              <h3 style={{ marginBottom: 10 }}>💳 Payment</h3>
              {[{ key: 'cod', label: '💵 Nakit (COD)', desc: 'Delivery pe paisa do' }, { key: 'online', label: '📱 Online (UPI/Card)', desc: 'PhonePe, GPay, Paytm, Card' }].map(p => (
                <div key={p.key} onClick={() => setPayment(p.key)}
                  style={{ padding: 12, border: '2px solid ' + (payment === p.key ? 'var(--primary)' : 'var(--border)'), borderRadius: 10, marginBottom: 8, cursor: 'pointer', background: payment === p.key ? '#fff5ee' : 'white' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.desc}</div>
                </div>
              ))}
            </div>
          )}

          <div className="card card-body">
            <h3 style={{ marginBottom: 12 }}>🧾 Bill Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal</span><span>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--muted)' }}>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--green)' : 'var(--text)', fontWeight: deliveryFee === 0 ? 700 : 400 }}>
                {deliveryFee === 0 ? 'FREE 🎉' : '₹' + deliveryFee}
              </span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>Discount</span><span style={{ color: 'var(--green)', fontWeight: 700 }}>-₹{discount}</span>
              </div>
            )}
            {total < 299 && !pendingOrderId && (
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textAlign: 'center', background: '#fff5ee', padding: '6px', borderRadius: 6, marginBottom: 8 }}>
                ₹{299 - total} aur add karo — FREE delivery paao!
              </div>
            )}
            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
            </div>

            {!pendingOrderId ? (
              <>
                <button className="btn btn-primary btn-block" style={{ marginTop: 14, padding: 14 }} onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? '⏳ Order ho raha...' : payment === 'cod' ? `✅ Order Karo — ₹${grandTotal}` : `Order Banao — Aage Payment Karo`}
                </button>

                <button onClick={handleWhatsApp}
                  style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#25D366', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                  📱 WhatsApp pe Order Karo
                </button>
              </>
            ) : (
              <div style={{ marginTop: 14 }}>
                <div style={{ background: '#fff5ee', border: '1px solid #ffedd5', borderRadius: 10, padding: 12, marginBottom: 12, textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                  ✅ Order ban gaya! Ab payment complete karo
                </div>
                <RazorpayButton
                  amount={grandTotal}
                  name="LocalApp Order"
                  description={cartType === 'grocery' ? 'Kirana Order' : 'Food Order'}
                  orderType="order"
                  refId={pendingOrderId}
                  userInfo={user}
                  buttonText={`📱 Pay ₹${grandTotal} Now`}
                  onSuccess={() => handlePaymentSuccess(pendingOrderId)}
                />
                <button onClick={() => setPendingOrderId(null)}
                  style={{ width: '100%', background: 'none', border: 'none', color: 'var(--muted)', marginTop: 10, cursor: 'pointer', fontSize: '0.85rem' }}>
                  ← Order details badlo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
