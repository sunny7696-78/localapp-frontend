import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';
import { RestaurantSkeleton } from '../components/Skeleton';

const DEMO_RESTAURANTS = [
  { _id:'r1', name:'Doraha Dhaba', cuisine:['Punjabi','Dal Makhani'], deliveryTime:'25-35 min', deliveryFee:20, rating:4.6, isOpen:true, image:'🍛', area:'Doraha Mandi' },
  { _id:'r2', name:'Sharma Fast Food', cuisine:['Burger','Momos','Chowmein'], deliveryTime:'15-25 min', deliveryFee:15, rating:4.3, isOpen:true, image:'🍔', area:'Doraha Bus Stand' },
  { _id:'r3', name:'Punjabi Rasoi', cuisine:['Sarson Saag','Rajma','Kadhi'], deliveryTime:'30-40 min', deliveryFee:20, rating:4.8, isOpen:true, image:'🥘', area:'Doraha Mandi' },
  { _id:'r4', name:'Sidhwan Sweets', cuisine:['Mithai','Samosa','Kachori'], deliveryTime:'20-30 min', deliveryFee:10, rating:4.5, isOpen:true, image:'🍮', area:'Sidhwan Bet' },
  { _id:'r5', name:'Doraha Chaat Corner', cuisine:['Golgappe','Tikki','Chaat'], deliveryTime:'15-20 min', deliveryFee:15, rating:4.7, isOpen:true, image:'🥙', area:'Doraha Grain Market' },
  { _id:'r6', name:'Pizza & More', cuisine:['Pizza','Pasta'], deliveryTime:'35-45 min', deliveryFee:25, rating:4.2, isOpen:false, image:'🍕', area:'Doraha Bus Stand' },
];

const CUISINES = ['All','Punjabi','Fast Food','Mithai','Chaat','Chinese'];

const Food = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    restaurantAPI.getAll().then(r => { if (r.data.length > 0) setRestaurants(r.data); else setRestaurants(DEMO_RESTAURANTS); })
      .catch(() => setRestaurants(DEMO_RESTAURANTS)).finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const mc = cuisine === 'All' || r.cuisine?.some(c => c.toLowerCase().includes(cuisine.toLowerCase()));
    return ms && mc;
  });

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🍔 Doraha Restaurants</h1>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>📍 Doraha & aas paas</span>
      </div>

      <input className="form-input" placeholder="🔍 Restaurant ya cuisine dhundho..."
        value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 12, background: 'white' }} />

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 16, scrollbarWidth: 'none' }}>
        {CUISINES.map(c => (
          <button key={c} onClick={() => setCuisine(c)}
            style={{ padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: cuisine === c ? 'var(--primary)' : 'white', color: cuisine === c ? 'white' : 'var(--text)', fontWeight: 600, fontSize: '0.82rem', boxShadow: 'var(--shadow)', flexShrink: 0 }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-3">{[...Array(6)].map((_, i) => <RestaurantSkeleton key={i} />)}</div>
      ) : (
        <div className="grid-3">
          {filtered.map(r => (
            <div key={r._id} className="card product-card" onClick={() => r.isOpen && navigate('/food/' + r._id)} style={{ opacity: r.isOpen ? 1 : 0.65 }}>
              <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem', position: 'relative' }}>
                {r.image || '🍽️'}
                {!r.isOpen && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 20 }}>Abhi Band</span>
                  </div>
                )}
                <span style={{ position: 'absolute', top: 8, right: 8, background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800 }}>⭐ {r.rating}</span>
              </div>
              <div className="card-body" style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 3 }}>{r.name}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--muted)', marginBottom: 4 }}>📍 {r.area}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 6 }}>{r.cuisine?.slice(0,2).join(' · ')}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: '0.74rem', color: 'var(--muted)' }}>
                  <span>🕐 {r.deliveryTime}</span>
                  <span>🛵 ₹{r.deliveryFee}</span>
                  <span className={`badge ${r.isOpen ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>{r.isOpen ? 'Open' : 'Closed'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && <div className="empty"><div className="empty-icon">🍽️</div><h3>Koi restaurant nahi mila</h3></div>}
    </div>
  );
};

export default Food;
