import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const DEMO_MENU = {
  r1: {
    name: 'Punjabi Dhaba', cuisine: ['Punjabi'], deliveryTime: '30-40 min', deliveryFee: 20, rating: 4.5,
    menu: [
      { _id: 'm1', name: 'Dal Makhani', price: 180, category: 'Main Course', isVeg: true },
      { _id: 'm2', name: 'Butter Chicken', price: 260, category: 'Main Course', isVeg: false },
      { _id: 'm3', name: 'Paneer Tikka', price: 220, category: 'Starter', isVeg: true },
      { _id: 'm4', name: 'Tandoori Roti', price: 20, category: 'Bread', isVeg: true },
      { _id: 'm5', name: 'Lassi (Sweet)', price: 60, category: 'Drinks', isVeg: true },
    ]
  },
  r2: {
    name: 'Burger Point', cuisine: ['Burgers'], deliveryTime: '20-30 min', deliveryFee: 15, rating: 4.2,
    menu: [
      { _id: 'm6', name: 'Veg Burger', price: 120, category: 'Burgers', isVeg: true },
      { _id: 'm7', name: 'Chicken Burger', price: 160, category: 'Burgers', isVeg: false },
      { _id: 'm8', name: 'French Fries', price: 80, category: 'Sides', isVeg: true },
      { _id: 'm9', name: 'Cold Coffee', price: 90, category: 'Drinks', isVeg: true },
    ]
  },
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const { cartItems, addToCart, removeFromCart, itemCount, total } = useCart();

  useEffect(() => {
    restaurantAPI.getOne(id)
      .then(res => setRestaurant(res.data))
      .catch(() => setRestaurant(DEMO_MENU[id] || DEMO_MENU['r1']));
  }, [id]);

  if (!restaurant) return <div className="loader"><div className="spinner"/></div>;

  const getQty = (itemId) => cartItems.find(i => i._id === itemId)?.qty || 0;

  const categories = [...new Set(restaurant.menu?.map(i => i.category) || [])];

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
          🍽️
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{restaurant.name}</h2>
              <p style={{ color: 'var(--muted)', margin: '4px 0' }}>{restaurant.cuisine?.join(' • ')}</p>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--yellow)' }}>⭐ {restaurant.rating}</span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: '0.88rem', color: 'var(--muted)' }}>
            <span>🕐 {restaurant.deliveryTime}</span>
            <span>🛵 Delivery ₹{restaurant.deliveryFee}</span>
            <span>📦 Min ₹{restaurant.minOrder || 100}</span>
          </div>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {restaurant.menu?.filter(i => i.category === cat).map(item => {
              const qty = getQty(item._id);
              return (
                <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', padding: 16, gap: 12 }}>
                  <span style={{ fontSize: '0.7rem', color: item.isVeg ? 'var(--green)' : 'var(--red)', border: `1.5px solid ${item.isVeg ? 'var(--green)' : 'var(--red)'}`, padding: '1px 4px', borderRadius: 2, fontWeight: 700, flexShrink: 0 }}>
                    {item.isVeg ? '🟢' : '🔴'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</div>
                  </div>
                  {qty === 0 ? (
                    <button className="btn btn-outline btn-sm" onClick={() => { addToCart({ ...item, _id: item._id }, 'food', id); toast.success('Added!'); }}>+ Add</button>
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
      ))}

      {itemCount > 0 && (
        <div className="cart-float" onClick={() => navigate('/cart')}>
          <span>🛍️ {itemCount} items</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{total} → View Cart</span>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
