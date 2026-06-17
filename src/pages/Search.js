import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, restaurantAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const TRENDING = ['Amul Milk', 'Dal Makhani', 'Momos', 'Burger', 'Doraha Dhaba', 'Paneer', 'Lassi', 'Samosa'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], restaurants: [] });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [priceMax, setPriceMax] = useState(500);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const doSearch = async (q) => {
    if (!q.trim()) { setResults({ products: [], restaurants: [] }); return; }
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        productAPI.getAll({ search: q }),
        restaurantAPI.getAll({ search: q })
      ]);
      setResults({ products: pRes.data.products || [], restaurants: rRes.data || [] });
    } catch {
      setResults({
        products: [
          { _id: 'p1', name: 'Amul Milk 1L', price: 66, category: 'dairy', unit: 'litre' },
          { _id: 'p2', name: 'Paneer 200g', price: 90, category: 'dairy', unit: 'pack' },
        ].filter(p => p.name.toLowerCase().includes(q.toLowerCase())),
        restaurants: [
          { _id: 'r1', name: 'Doraha Dhaba', cuisine: ['Punjabi'], rating: 4.6, deliveryTime: '25-35 min' },
          { _id: 'r2', name: 'Sharma Fast Food', cuisine: ['Burgers'], rating: 4.3, deliveryTime: '15-25 min' },
        ].filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.cuisine.some(c => c.toLowerCase().includes(q.toLowerCase())))
      });
    }
    setLoading(false);
  };

  const handleSearch = (q) => { setQuery(q); doSearch(q); };

  const filteredProducts = results.products.filter(p => p.price <= priceMax);

  return (
    <div className="page">
      <h1 className="page-title">🔍 Search</h1>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input className="form-input" placeholder="Kuch bhi dhundho — product, restaurant, khana..." value={query}
          onChange={e => handleSearch(e.target.value)} autoFocus
          style={{ paddingLeft: 44, background: 'white', fontSize: '1rem' }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
        {query && <button onClick={() => { setQuery(''); setResults({ products: [], restaurants: [] }); }}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--muted)' }}>✕</button>}
      </div>

      {/* No query — show trending */}
      {!query && (
        <>
          <h3 style={{ marginBottom: 12 }}>🔥 Trending in Doraha</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {TRENDING.map(t => (
              <button key={t} onClick={() => handleSearch(t)}
                style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', boxShadow: 'var(--shadow)' }}>{t}</button>
            ))}
          </div>
          <h3 style={{ marginBottom: 12 }}>📂 Browse by Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[{ icon: '🥦', label: 'Sabzi', cat: 'vegetables' }, { icon: '🥛', label: 'Dairy', cat: 'dairy' }, { icon: '🌾', label: 'Anaj', cat: 'grains' }, { icon: '🍿', label: 'Snacks', cat: 'snacks' },
              { icon: '☕', label: 'Drinks', cat: 'beverages' }, { icon: '🍎', label: 'Fal', cat: 'fruits' }, { icon: '🧹', label: 'Ghar', cat: 'household' }, { icon: '🍔', label: 'Food', cat: 'food' }
            ].map(c => (
              <div key={c.cat} onClick={() => c.cat === 'food' ? navigate('/food') : navigate('/grocery')}
                style={{ background: 'white', borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Results */}
      {query && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            {['all', 'grocery', 'food'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === f ? 'var(--primary)' : 'white', color: filter === f ? 'white' : 'var(--text)', fontWeight: 600, fontSize: '0.83rem', boxShadow: 'var(--shadow)' }}>
                {f === 'all' ? 'Sab' : f === 'grocery' ? '🛒 Kirana' : '🍔 Food'}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--muted)' }}>
              Max: <strong>₹{priceMax}</strong>
              <input type="range" min="50" max="1000" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ marginLeft: 8, width: 80 }} />
            </div>
          </div>

          {loading && <div className="loader"><div className="spinner" /></div>}

          {/* Products */}
          {(filter === 'all' || filter === 'grocery') && filteredProducts.length > 0 && (
            <>
              <h3 style={{ marginBottom: 12 }}>🛒 Products ({filteredProducts.length})</h3>
              <div className="grid-4" style={{ marginBottom: 20 }}>
                {filteredProducts.map(p => (
                  <div key={p._id} className="card">
                    <div style={{ height: 100, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {p.category === 'dairy' ? '🥛' : p.category === 'vegetables' ? '🥦' : p.category === 'fruits' ? '🍎' : '📦'}
                    </div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 6 }}>{p.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{p.price}</span>
                        <button className="btn btn-primary btn-sm" onClick={() => { addToCart(p, 'grocery'); toast.success('Added!'); }}>+ Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Restaurants */}
          {(filter === 'all' || filter === 'food') && results.restaurants.length > 0 && (
            <>
              <h3 style={{ marginBottom: 12 }}>🍔 Restaurants ({results.restaurants.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.restaurants.map(r => (
                  <div key={r._id} className="card card-body" style={{ cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }} onClick={() => navigate('/food/' + r._id)}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🍽️</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{r.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{r.cuisine?.join(' · ')}</div>
                      <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                        <span>⭐ {r.rating}</span>
                        <span>🕐 {r.deliveryTime}</span>
                      </div>
                    </div>
                    <span style={{ color: 'var(--primary)' }}>›</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && filteredProducts.length === 0 && results.restaurants.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <h3>"{query}" nahi mila</h3>
              <p>Dusra search try karo</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
