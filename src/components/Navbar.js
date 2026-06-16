import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationAPI } from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  useEffect(() => {
    if (user) {
      notificationAPI.getAll().then(r => setUnread(r.data.unread || 0)).catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Local<span>App</span></Link>

      <div className="nav-links">
        {user ? (
          <>
            {(user.role === 'customer' || user.role === 'admin') && (
              <>
                <Link to="/grocery" className={isActive('/grocery') ? 'active' : ''}>🛒 Kirana</Link>
                <Link to="/food" className={isActive('/food') ? 'active' : ''}>🍔 Food</Link>
                <Link to="/ride" className={isActive('/ride') ? 'active' : ''}>🏍️ Ride</Link>
                <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>📦 Orders</Link>
                <Link to="/cart" style={{ position: 'relative' }}>
                  🛍️{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </Link>
              </>
            )}
            {user.role === 'driver' && <Link to="/driver" className={isActive('/driver') ? 'active' : ''}>🏍️ Dashboard</Link>}
            {user.role === 'vendor' && (
              <>
                <Link to="/vendor" className={isActive('/vendor') ? 'active' : ''}>📊 Dashboard</Link>
                <Link to="/shop" className={isActive('/shop') ? 'active' : ''}>🏪 My Shop</Link>
              </>
            )}
            {user.role === 'admin' && <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>⚙️ Admin</Link>}

            {/* Notifications */}
            <Link to="/notifications" style={{ position: 'relative' }}>
              🔔{unread > 0 && <span className="cart-badge" style={{ background: 'var(--red)' }}>{unread}</span>}
            </Link>

            <Link to="/profile">
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ background: 'var(--primary)', color: 'white', padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
