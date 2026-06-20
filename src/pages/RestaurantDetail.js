import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const DEMO_RESTAURANTS = {
  r1: { name: 'Doraha Dhaba', cuisine: ['Punjabi'], deliveryTime: '25-35 min', deliveryFee: 20, rating: 4.6, area: 'Doraha Mandi', menu: [
    { _id: 'm1', name: 'Dal Makhani', price: 160, category: 'Main Course', isVeg: true },
    { _id: 'm2', name: 'Butter Chicken', price: 240, category: 'Main Course', isVeg: false },
    { _id: 'm3', name: 'Paneer Butter Masala', price: 200, category: 'Main Course', isVeg: true },
    { _id: 'm4', name: 'Sarson Da Saag', price: 140, category: 'Main Course', isVeg: true },
    { _id: 'm5', name: 'Makki Di Roti', price: 25, category: 'Bread', isVeg: true },
    { _id: 'm6', name: 'Tandoori Roti', price: 18, category: 'Bread', isVeg: true },
    { _id: 'm7', name: 'Lassi Sweet', price: 55, category: 'Drinks', isVeg: true },
    { _id: 'm8', name: 'Chawal', price: 60, category: 'Rice', isVeg: true },
  ]},
  r2: { name: 'Sharma Fast Food', cuisine: ['Burgers', 'Momos'], deliveryTime: '15-25 min', deliveryFee: 15, rating: 4.3, area: 'Doraha Bus Stand', menu: [
    { _id: 'm9', name: 'Veg Burger', price: 80, category: 'Burgers', isVeg: true },
    { _id: 'm10', name: 'Chicken Burger', price: 120, category: 'Burgers', isVeg: false },
    { _id: 'm11', name: 'Veg Momos (8pc)', price: 70, category: 'Momos', isVeg: true },
    { _id: 'm12', name: 'Chicken Momos (8pc)', price: 100, category: 'Momos', isVeg: false },
    { _id: 'm13', name: 'Veg Chowmein', price: 80, category: 'Chinese', isVeg: true },
    { _id: 'm14', name: 'French Fries', price: 60, category: 'Sides', isVeg: true },
  ]},
  r3: { name: 'Punjabi Rasoi', cuisine: ['Punjabi'], deliveryTime: '30-40 min', deliveryFee: 20, rating: 4.8, area: 'Doraha Mandi', menu: [
    { _id: 'm15', name: 'Sarson Da Saag + Makki Roti', price: 160, category: 'Special', isVeg: true },
    { _id: 'm16', name: 'Rajma Chawal', price: 130, category: 'Main Course', isVeg: true },
    { _id: 'm17', name: 'Kadhi Chawal', price: 120, category: 'Main Course', isVeg: true },
    { _id: 'm18', name: 'Chole Bhature', price: 110, category: 'Main Course', isVeg: true },
    { _id: 'm19', name: 'Lassi', price: 50, category: 'Drinks', isVeg: true },
  ]},
  r4: { name: 'Sidhwan Sweets', cuisine: ['Mithai', 'Snacks'], deliveryTime: '20-30 min', deliveryFee: 10, rating: 4.5, area: 'Sidhwan Bet', menu: [
    { _id: 'm20', name: 'Samosa (2pc)', price: 20, category: 'Snacks', isVeg: true },
    { _id: 'm21', name: 'Kachori (2pc)', price: 25, category: 'Snacks', isVeg: true },
    { _id: 'm22', name: 'Gulab Jamun (4pc)', price: 40, category: 'Mithai', isVeg: true },
    { _id: 'm23', name: 'Jalebi 250g', price: 60, category: 'Mithai', isVeg: true },
    { _id: 'm24', name: 'Chai', price: 15, category: 'Drinks', isVeg: true },
  ]},
  r5: { name: 'Doraha Chaat Corner', cuisine: ['Chaat'], deliveryTime: '15-20 min', deliveryFee: 15, rating: 4.7, area: 'Doraha Grain Market', menu: [
    { _id: 'm25', name: 'Golgappe (10pc)', price: 40, category: 'Chaat', isVeg: true },
    { _id: 'm26', name: 'Aloo Tikki (2pc)', price: 50, category: 'Chaat', isVeg: true },
    { _id: 'm27', name: 'Bhel Puri', price: 55, category: 'Chaat', isVeg: true },
    { _id: 'm28', name: 'Papdi Chaat', price: 70, category: 'Chaat', isVeg: true },
    { _id: 'm29', name: 'Dahi Bhalle', price: 80, category: 'Chaat', isVeg: true },
  ]},
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [vegOnly, setVegOnly] = useState(false);
  const { cartItems, addToCart, removeFromCart, itemCount, total } = useCart();
  const { t: tr } = useLanguage();

  useEffect(() => {
    restaurantAPI.getOne(id).then(res => setRestaurant(res.data))
      .catch(() => setRestaurant(DEMO_RESTAURANTS[id] || DEMO_RESTAURANTS['r1']));
  }, [id]);

  if (!restaurant) return <div className="loader"><div className="spinner" /></div>;

  const getQty = (itemId) => cartItems.find(i => i._id === itemId)?.qty || 0;
  const categories = [...new Set(restaurant.menu?.map(i => i.category) || [])];

  return (
    <div className="page">
      <button onClick={() => navigate('/food')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: 16, fontSize: '0.9rem' }}>← {tr('back')}</button>

      {/* Restaurant Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🍽️</div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{restaurant.name}</h2>
              <p style={{ color: 'var(--muted)', margin: '4px 0', fontSize: '0.88rem' }}>{restaurant.cuisine?.join(' · ')}</p>
              {restaurant.area && <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>📍 {restaurant.area}</p>}
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>⭐ {restaurant.rating}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.85rem', color: 'var(--muted)' }}>
            <span>🕐 {restaurant.deliveryTime}</span>
            <span>🛵 Delivery ₹{restaurant.deliveryFee}</span>
            <span>📦 Min ₹{restaurant.minOrder || 100}</span>
          </div>
          {/* Veg toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <div onClick={() => setVegOnly(!vegOnly)}
              style={{ width: 44, height: 24, borderRadius: 12, background: vegOnly ? 'var(--green)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
              <div style={{ position: 'absolute', top: 3, left: vegOnly ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: vegOnly ? 'var(--green)' : 'var(--muted)' }}>{tr('vegOnly')}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      {categories.map(cat => {
        const items = restaurant.menu?.filter(i => i.category === cat && (!vegOnly || i.isVeg)) || [];
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(item => {
                const qty = getQty(item._id);
                return (
                  <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', padding: 16, gap: 12 }}>
                    <span style={{ fontSize: '0.65rem', color: item.isVeg ? 'var(--green)' : 'var(--red)', border: '1.5px solid ' + (item.isVeg ? 'var(--green)' : 'var(--red)'), padding: '1px 4px', borderRadius: 2, fontWeight: 700, flexShrink: 0 }}>
                      {item.isVeg ? '●' : '●'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</div>
                    </div>
                    {qty === 0 ? (
                      <button className="btn btn-outline btn-sm" onClick={() => { addToCart({ ...item, _id: item._id }, 'food', id, { name: restaurant.name, phone: restaurant.phone }); toast.success('Add ho gaya!'); }}>+ {tr('add')}</button>
                    ) : (
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => removeFromCart(item._id)}>−</button>
                        <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                        <button className="qty-btn" onClick={() => addToCart({ ...item, _id: item._id }, 'food', id)}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {itemCount > 0 && (
        <div className="cart-float" onClick={() => navigate('/cart')}>
          <span>🛍️ {itemCount} items</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{total} → {tr('viewCart')}</span>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
