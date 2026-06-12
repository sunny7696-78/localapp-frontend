import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const CustomerLinks = () => (
    <>
      <Link to="/grocery" className={isActive('/grocery') ? 'active' : ''}>🛒 Kirana</Link>
      <Link to="/food" className={isActive('/food') ? 'active' : ''}>🍔 Food</Link>
      <Link to="/ride" className={isActive('/ride') ? 'active' : ''}>🏍️ Ride</Link>
      <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>📦 Orders</Link>
      <Link to="/cart" style={{ position: 'relative' }}>
        🛍️{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </Link>
    </>
  );

  const DriverLinks = () => (
    <>
      <Link to="/driver" className={isActive('/driver') ? 'active' : ''}>🏍️ Dashboard</Link>
    </>
  );

  const VendorLinks = () => (
    <>
      <Link to="/vendor" className={isActive('/vendor') ? 'active' : ''}>🏪 Dashboard</Link>
    </>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Local<span>App</span>
        <span style={{ fontSize: '0.6rem', color: '#888', marginLeft: 6, fontWeight: 400 }}>Ludhiana</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'customer' && <CustomerLinks />}
            {user.role === 'driver' && <DriverLinks />}
            {user.role === 'vendor' && <VendorLinks />}
            {user.role === 'admin' && (
              <>
                <CustomerLinks />
                <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>⚙️ Admin</Link>
              </>
            )}
            <Link to="/profile">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
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
