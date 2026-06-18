import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'all', label: '🏪 Sab' },
  { key: 'fruits', label: '🍎 Fal' },
  { key: 'vegetables', label: '🥦 Sabzi' },
  { key: 'dairy', label: '🥛 Dairy' },
  { key: 'grains', label: '🌾 Anaj' },
  { key: 'snacks', label: '🍿 Snacks' },
  { key: 'beverages', label: '☕ Drinks' },
  { key: 'household', label: '🧹 Ghar' },
  { key: 'personal_care', label: '🧴 Personal' },
];

const DEMO_PRODUCTS = [
  { _id: '1', name: 'Amul Gold Milk 1L', price: 66, mrp: 70, category: 'dairy', unit: 'litre' },
  { _id: '2', name: 'Tamatar 1kg', price: 35, mrp: 45, category: 'vegetables', unit: 'kg' },
  { _id: '3', name: 'Basmati Chawal 5kg', price: 340, mrp: 400, category: 'grains', unit: 'kg' },
  { _id: '4', name: 'Amul Butter 500g', price: 245, mrp: 265, category: 'dairy', unit: 'pack' },
  { _id: '5', name: 'Maggi 12-pack', price: 118, mrp: 144, category: 'snacks', unit: 'pack' },
  { _id: '6', name: 'Tata Tea Premium 500g', price: 172, mrp: 200, category: 'beverages', unit: 'pack' },
  { _id: '7', name: 'Pyaaz 1kg', price: 28, mrp: 35, category: 'vegetables', unit: 'kg' },
  { _id: '8', name: 'Surf Excel 1kg', price: 192, mrp: 220, category: 'household', unit: 'kg' },
  { _id: '9', name: 'Kela (Banana) dozen', price: 45, mrp: 60, category: 'fruits', unit: 'dozen' },
  { _id: '10', name: 'Paneer Fresh 200g', price: 90, mrp: 100, category: 'dairy', unit: 'pack' },
  { _id: '11', name: 'Aloo 2kg', price: 48, mrp: 60, category: 'vegetables', unit: 'kg' },
  { _id: '12', name: 'Bisleri 1L x6', price: 88, mrp: 100, category: 'beverages', unit: 'pack' },
  { _id: '13', name: 'Toor Dal 1kg', price: 115, mrp: 135, category: 'grains', unit: 'kg' },
  { _id: '14', name: 'Seb (Apple) 1kg', price: 150, mrp: 180, category: 'fruits', unit: 'kg' },
  { _id: '15', name: 'Dahi 400g', price: 40, mrp: 45, category: 'dairy', unit: 'pack' },
  { _id: '16', name: 'Dettol Soap 3-pack', price: 88, mrp: 105, category: 'personal_care', unit: 'pack' },
];

const EMOJI_MAP = { fruits: '🍎', vegetables: '🥦', dairy: '🥛', grains: '🌾', snacks: '🍿', beverages: '☕', household: '🧹', personal_care: '🧴', other: '📦' };

const Grocery = () => {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { cartItems, addToCart, removeFromCart, itemCount, total } = useCart();
  const navigate = useNavigate();
  const { t: tr } = useLanguage();

  useEffect(() => {
    productAPI.getAll({ category, search }).then(res => {
      if (res.data.products?.length > 0) setProducts(res.data.products);
    }).catch(() => {});
  }, [category, search]);

  const filtered = products.filter(p =>
    (category === 'all' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getQty = (id) => cartItems.find(i => i._id === id)?.qty || 0;

  const discount = (price, mrp) => mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🛒 {tr('dorahaGrocery')}</h1>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📍 {tr('dorahaAndNearby')}</span>
      </div>

      {/* Free delivery banner */}
      <div style={{ background: 'linear-gradient(135deg,var(--primary),#ff8c42)', color: 'white', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: '0.88rem', fontWeight: 700, textAlign: 'center' }}>
        🎉 ₹299 se upar FREE delivery! Abhi ₹{Math.max(0, 299 - total)} aur add karo
      </div>

      <input className="form-input" placeholder={'🔍 ' + tr('searchProduct')} value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14, background: 'white' }} />

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: category === c.key ? 'var(--primary)' : 'white', color: category === c.key ? 'white' : 'var(--text)', fontWeight: 600, fontSize: '0.85rem', boxShadow: 'var(--shadow)' }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid-4">
        {filtered.map(p => {
          const qty = getQty(p._id);
          const disc = discount(p.price, p.mrp);
          return (
            <div key={p._id} className="card product-card">
              <div className="product-img" style={{ position: 'relative' }}>
                <span style={{ fontSize: '3rem' }}>{EMOJI_MAP[p.category] || '📦'}</span>
                {disc >= 5 && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--green)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                    {disc}% OFF
                  </span>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8 }}>{p.unit}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="product-price">₹{p.price}</span>
                    {p.mrp && p.mrp > p.price && <span className="product-mrp">₹{p.mrp}</span>}
                  </div>
                  {qty === 0 ? (
                    <button className="btn btn-primary btn-sm" onClick={() => { addToCart(p, 'grocery'); toast.success('Cart mein add!'); }}>+ {tr('add')}</button>
                  ) : (
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => removeFromCart(p._id)}>−</button>
                      <span style={{ fontWeight: 700 }}>{qty}</span>
                      <button className="qty-btn" onClick={() => addToCart(p, 'grocery')}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>{tr('noProductFound')}</h3>
          <p>{tr('tryDifferentSearch')}</p>
        </div>
      )}

      {itemCount > 0 && (
        <div className="cart-float" onClick={() => navigate('/cart')}>
          <span>🛍️ {itemCount} items</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{total} → Cart Dekho</span>
        </div>
      )}
    </div>
  );
};

export default Grocery;
