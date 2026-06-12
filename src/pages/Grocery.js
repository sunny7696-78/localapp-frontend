import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'all', label: '🏪 All', emoji: '' },
  { key: 'fruits', label: '🍎 Fruits' },
  { key: 'vegetables', label: '🥦 Vegetables' },
  { key: 'dairy', label: '🥛 Dairy' },
  { key: 'grains', label: '🌾 Grains' },
  { key: 'snacks', label: '🍿 Snacks' },
  { key: 'beverages', label: '☕ Beverages' },
  { key: 'household', label: '🧹 Household' },
  { key: 'personal_care', label: '🧴 Personal Care' },
];

// Demo products (shown when API not connected)
const DEMO_PRODUCTS = [
  { _id: '1', name: 'Amul Milk 1L', price: 60, mrp: 65, category: 'dairy', image: '', unit: 'litre' },
  { _id: '2', name: 'Tomatoes 1kg', price: 40, mrp: 50, category: 'vegetables', image: '', unit: 'kg' },
  { _id: '3', name: 'Basmati Rice 5kg', price: 350, mrp: 400, category: 'grains', image: '', unit: 'kg' },
  { _id: '4', name: 'Amul Butter 500g', price: 220, mrp: 240, category: 'dairy', image: '', unit: 'pack' },
  { _id: '5', name: 'Maggi 12-pack', price: 120, mrp: 144, category: 'snacks', image: '', unit: 'pack' },
  { _id: '6', name: 'Tata Tea Premium', price: 85, mrp: 95, category: 'beverages', image: '', unit: 'pack' },
  { _id: '7', name: 'Onions 1kg', price: 30, mrp: 40, category: 'vegetables', image: '', unit: 'kg' },
  { _id: '8', name: 'Surf Excel 1kg', price: 195, mrp: 210, category: 'household', image: '', unit: 'kg' },
  { _id: '9', name: 'Banana (dozen)', price: 50, mrp: 60, category: 'fruits', image: '', unit: 'dozen' },
  { _id: '10', name: 'Paneer 200g', price: 90, mrp: 100, category: 'dairy', image: '', unit: 'pack' },
  { _id: '11', name: 'Potato 2kg', price: 45, mrp: 55, category: 'vegetables', image: '', unit: 'kg' },
  { _id: '12', name: 'Bisleri 1L (6-pack)', price: 90, mrp: 100, category: 'beverages', image: '', unit: 'pack' },
];

const EMOJI_MAP = { fruits: '🍎', vegetables: '🥦', dairy: '🥛', grains: '🌾', snacks: '🍿', beverages: '☕', household: '🧹', personal_care: '🧴', other: '📦' };

const Grocery = () => {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { cartItems, addToCart, removeFromCart, itemCount, total } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll({ category, search }).then(res => {
      if (res.data.products?.length > 0) setProducts(res.data.products);
    }).catch(() => {}); // fallback to demo
  }, [category, search]);

  const filtered = category === 'all'
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));

  const getQty = (id) => cartItems.find(i => i._id === id)?.qty || 0;

  return (
    <div className="page">
      <h1 className="page-title">🛒 Kirana & Grocery</h1>

      <input className="form-input" placeholder="🔍 Search products..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, background: 'white' }} />

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            style={{
              padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: category === c.key ? 'var(--primary)' : 'white',
              color: category === c.key ? 'white' : 'var(--text)',
              fontWeight: 600, fontSize: '0.85rem',
              boxShadow: 'var(--shadow)',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid-4">
        {filtered.map(p => {
          const qty = getQty(p._id);
          return (
            <div key={p._id} className="card product-card">
              <div className="product-img" style={{ fontSize: '3rem' }}>
                {EMOJI_MAP[p.category] || '📦'}
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>{p.unit}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="product-price">₹{p.price}</span>
                    {p.mrp && <span className="product-mrp">₹{p.mrp}</span>}
                  </div>
                  {qty === 0 ? (
                    <button className="btn btn-primary btn-sm" onClick={() => { addToCart(p, 'grocery'); toast.success('Added!'); }}>+ Add</button>
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
          <h3>No products found</h3>
          <p>Try a different search or category</p>
        </div>
      )}

      {itemCount > 0 && (
        <div className="cart-float" onClick={() => navigate('/cart')}>
          <span>🛍️ {itemCount} items</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{total} →</span>
        </div>
      )}
    </div>
  );
};

export default Grocery;
