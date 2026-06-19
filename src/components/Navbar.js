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
  const [offline, setOffline] = useState(!navigator.onLine);

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  useEffect(() => {
    if (user) notificationAPI.getAll().then(r => setUnread(r.data.unread || 0)).catch(() => {});
  }, [user, location.pathname]);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };

  const MobileMenu = () => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex' }} onClick={() => setMenuOpen(false)}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ width: 260, background: 'var(--secondary)', height: '100%', overflowY: 'auto', padding: '60px 0 20px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>

        {/* User info */}
        {user && (
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: 'white', marginBottom: 10 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ color: 'white', fontWeight: 700 }}>{user.name}</div>
            <div style={{ color: '#aaa', fontSize: '0.82rem' }}>{user.phone}</div>
            <span style={{ background: 'rgba(255,107,0,0.3)', color: 'var(--primary)', padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, marginTop: 6, display: 'inline-block' }}>{user.role}</span>
          </div>
        )}

        {/* Links */}
        {[
          ...(user?.role === 'customer' || user?.role === 'admin' ? [
            { icon: '🏠', label: 'Home', path: '/' },
            { icon: '🔍', label: 'Search', path: '/search' },
            { icon: '🛒', label: 'Kirana', path: '/grocery' },
            { icon: '🍔', label: 'Food', path: '/food' },
            { icon: '🏍️', label: 'Ride', path: '/ride' },
            { icon: '📦', label: 'Orders', path: '/orders' },
            { icon: '📅', label: 'Schedule', path: '/schedule' },
            { icon: '💰', label: 'Wallet', path: '/wallet' },
            { icon: '👥', label: 'Refer & Earn', path: '/referral' },
            { icon: '📍', label: 'Saved Addresses', path: '/addresses' },
          ] : []),
          ...(user?.role === 'driver' ? [
            { icon: '🏍️', label: 'Dashboard', path: '/driver' },
            { icon: '💵', label: 'Earnings', path: '/earnings' },
          ] : []),
          ...(user?.role === 'vendor' ? [
            { icon: '📊', label: 'Dashboard', path: '/vendor' },
            { icon: '🏪', label: 'My Shop', path: '/shop' },
          ] : []),
          ...(user?.role === 'admin' ? [
            { icon: '📊', label: 'Analytics', path: '/analytics' },
            { icon: '🎟️', label: 'Promos', path: '/promos' },
            { icon: '⚙️', label: 'Admin', path: '/admin' },
          ] : []),
          { icon: '🔔', label: 'Notifications', path: '/notifications', badge: unread },
          { icon: '👤', label: 'Profile', path: '/profile' },
        ].map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: isActive(item.path) ? 'rgba(255,107,0,0.15)' : 'none', border: 'none', cursor: 'pointer', color: isActive(item.path) ? 'var(--primary)' : '#ccc', fontWeight: isActive(item.path) ? 700 : 400, fontSize: '0.95rem', textAlign: 'left', position: 'relative' }}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
            {item.badge > 0 && <span style={{ marginLeft: 'auto', background: 'var(--red)', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: '0.72rem', fontWeight: 800 }}>{item.badge}</span>}
          </button>
        ))}

        {user && (
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontWeight: 600, fontSize: '0.95rem', marginTop: 'auto' }}>
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {offline && <div className="offline-banner">📵 Internet nahi hai — Offline mode</div>}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Local<span>App</span>
          <span style={{ fontSize: '0.55rem', color: '#888', marginLeft: 4, fontWeight: 400 }}>Doraha</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {user ? (<>
            {(user.role === 'customer' || user.role === 'admin') && (<>
              <Link to="/search">🔍</Link>
              <Link to="/grocery" className={isActive('/grocery') ? 'active' : ''}>🛒 Kirana</Link>
              <Link to="/food" className={isActive('/food') ? 'active' : ''}>🍔 Food</Link>
              <Link to="/ride" className={isActive('/ride') ? 'active' : ''}>🏍️ Ride</Link>
              <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>📦 Orders</Link>
              <Link to="/cart" style={{ position: 'relative' }}>🛍️{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}</Link>
            </>)}
            {user.role === 'driver' && <Link to="/driver">🏍️ Dashboard</Link>}
            {user.role === 'vendor' && <><Link to="/vendor">📊 Dashboard</Link><Link to="/shop">🏪 Shop</Link></>}
            {user.role === 'admin' && <><Link to="/analytics">📊</Link><Link to="/admin">⚙️ Admin</Link></>}
            <Link to="/notifications" style={{ position: 'relative' }}>🔔{unread > 0 && <span className="cart-badge" style={{ background: 'var(--red)' }}>{unread}</span>}</Link>
            <Link to="/profile"><div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{user.name?.charAt(0).toUpperCase()}</div></Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>) : (<>
            <Link to="/search">🔍</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ background: 'var(--primary)', color: 'white', padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem' }}>Register</Link>
          </>)}
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user && (
            <Link to="/cart" className="mobile-menu-btn" style={{ position: 'relative', textDecoration: 'none', color: 'white' }}>
              🛍️{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </nav>

      {menuOpen && <MobileMenu />}
    </>
  );
};

export default Navbar;
