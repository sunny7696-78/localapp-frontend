import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';

const DEMO_RESTAURANTS = [
  { _id: 'r1', name: 'Doraha Dhaba', cuisine: ['Punjabi', 'Dal Makhani', 'Roti'], deliveryTime: '25-35 min', deliveryFee: 20, rating: 4.6, isOpen: true, image: '🍛', area: 'Doraha Mandi' },
  { _id: 'r2', name: 'Sharma Fast Food', cuisine: ['Burger', 'Momos', 'Chowmein'], deliveryTime: '15-25 min', deliveryFee: 15, rating: 4.3, isOpen: true, image: '🍔', area: 'Doraha Bus Stand' },
  { _id: 'r3', name: 'Punjabi Rasoi', cuisine: ['Sarson Da Saag', 'Makki Roti', 'Lassi'], deliveryTime: '30-40 min', deliveryFee: 20, rating: 4.8, isOpen: true, image: '🥘', area: 'Doraha Mandi' },
  { _id: 'r4', name: 'Sidhwan Sweets', cuisine: ['Mithai', 'Samosa', 'Kachori', 'Chai'], deliveryTime: '20-30 min', deliveryFee: 10, rating: 4.5, isOpen: true, image: '🍮', area: 'Sidhwan Bet' },
  { _id: 'r5', name: 'Doraha Chaat Corner', cuisine: ['Golgappe', 'Tikki', 'Bhel', 'Chaat'], deliveryTime: '15-20 min', deliveryFee: 15, rating: 4.7, isOpen: true, image: '🥙', area: 'Doraha Grain Market' },
  { _id: 'r6', name: 'Pizza & More', cuisine: ['Pizza', 'Pasta', 'Garlic Bread'], deliveryTime: '35-45 min', deliveryFee: 25, rating: 4.2, isOpen: false, image: '🍕', area: 'Doraha Bus Stand' },
];

const CUISINES = ['All', 'Punjabi', 'Fast Food', 'Mithai', 'Chaat', 'Chinese'];

const Food = () => {
  const [restaurants, setRestaurants] = useState(DEMO_RESTAURANTS);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    restaurantAPI.getAll().then(r => { if (r.data.length > 0) setRestaurants(r.data); }).catch(() => {});
  }, []);

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchCuisine = cuisine === 'All' || r.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase()));
    return matchSearch && matchCuisine;
  });

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🍔 Doraha Restaurants</h1>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📍 Doraha & aas paas</span>
      </div>

      <input className="form-input" placeholder="🔍 Restaurant ya khana dhundho..."
        value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14, background: 'white' }} />

      {/* Cuisine Filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
        {CUISINES.map(c => (
          <button key={c} onClick={() => setCuisine(c)}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: cuisine === c ? 'var(--primary)' : 'white', color: cuisine === c ? 'white' : 'var(--text)', fontWeight: 600, fontSize: '0.85rem', boxShadow: 'var(--shadow)' }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map(r => (
          <div key={r._id} className="card product-card" onClick={() => r.isOpen && navigate('/food/' + r._id)}
            style={{ opacity: r.isOpen ? 1 : 0.7 }}>
            <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative' }}>
              {r.image}
              {!r.isOpen && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Abhi Band Hai</span>
                </div>
              )}
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div className="product-name">{r.name}</div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>⭐ {r.rating}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>📍 {r.area}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 8 }}>{r.cuisine.join(' · ')}</div>
              <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--muted)' }}>
                <span>🕐 {r.deliveryTime}</span>
                <span>🛵 ₹{r.deliveryFee}</span>
                <span className={`badge ${r.isOpen ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.68rem' }}>{r.isOpen ? 'Open' : 'Closed'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🍽️</div>
          <h3>Koi restaurant nahi mila</h3>
          <p>Dusra search try karo</p>
        </div>
      )}
    </div>
  );
};

export default Food;
