import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';

const DEMO_RESTAURANTS = [
  { _id: 'r1', name: 'Punjabi Dhaba', cuisine: ['Punjabi', 'North Indian'], deliveryTime: '30-40 min', deliveryFee: 20, rating: 4.5, isOpen: true, image: '🍛' },
  { _id: 'r2', name: 'Burger Point', cuisine: ['Burgers', 'Fast Food'], deliveryTime: '20-30 min', deliveryFee: 15, rating: 4.2, isOpen: true, image: '🍔' },
  { _id: 'r3', name: 'Pizza Hut Ludhiana', cuisine: ['Pizza', 'Italian'], deliveryTime: '35-45 min', deliveryFee: 30, rating: 4.3, isOpen: true, image: '🍕' },
  { _id: 'r4', name: 'Tikki Wala', cuisine: ['Chaat', 'Street Food'], deliveryTime: '15-25 min', deliveryFee: 10, rating: 4.7, isOpen: true, image: '🥙' },
  { _id: 'r5', name: 'Momos Express', cuisine: ['Chinese', 'Momos'], deliveryTime: '20-30 min', deliveryFee: 15, rating: 4.4, isOpen: true, image: '🥟' },
  { _id: 'r6', name: 'South Indian Corner', cuisine: ['South Indian', 'Dosa'], deliveryTime: '25-35 min', deliveryFee: 20, rating: 4.1, isOpen: false, image: '🫓' },
];

const Food = () => {
  const [restaurants, setRestaurants] = useState(DEMO_RESTAURANTS);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    restaurantAPI.getAll().then(res => {
      if (res.data.length > 0) setRestaurants(res.data);
    }).catch(() => {});
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <h1 className="page-title">🍔 Restaurants Near You</h1>
      <input className="form-input" placeholder="🔍 Search restaurants or cuisine..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 20, background: 'white' }} />

      <div className="grid-3">
        {filtered.map(r => (
          <div key={r._id} className="card product-card" onClick={() => r.isOpen && navigate(`/food/${r._id}`)}>
            <div className="product-img" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: 'white', fontSize: '3.5rem' }}>
              {r.image || '🍽️'}
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="product-name">{r.name}</div>
                <span className={`badge ${r.isOpen ? 'badge-green' : 'badge-red'}`}>
                  {r.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 8 }}>
                {r.cuisine.join(' • ')}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', color: 'var(--muted)' }}>
                <span>⭐ {r.rating}</span>
                <span>🕐 {r.deliveryTime}</span>
                <span>🛵 ₹{r.deliveryFee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🍽️</div>
          <h3>No restaurants found</h3>
        </div>
      )}
    </div>
  );
};

export default Food;
