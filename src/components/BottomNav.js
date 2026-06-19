import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();

  if (!user) return null;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const customerTabs = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Search', path: '/search' },
    { icon: '🛍️', label: 'Cart', path: '/cart', badge: itemCount },
    { icon: '📦', label: 'Orders', path: '/orders' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const driverTabs = [
    { icon: '🏠', label: 'Home', path: '/driver' },
    { icon: '💰', label: 'Earnings', path: '/earnings' },
    { icon: '🔔', label: 'Alerts', path: '/notifications' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const vendorTabs = [
    { icon: '📊', label: 'Dashboard', path: '/vendor' },
    { icon: '🏪', label: 'Shop', path: '/shop' },
    { icon: '🔔', label: 'Alerts', path: '/notifications' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const tabs = user.role === 'driver' ? driverTabs : user.role === 'vendor' ? vendorTabs : customerTabs;

  return (
    <>
      {/* Spacer so content doesn't hide behind bottom nav */}
      <div style={{ height: 70 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'white', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {tabs.map(tab => {
          const active = isActive(tab.path);
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)}
              style={{
                flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                padding: '10px 4px 8px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3, position: 'relative',
                transition: 'all 0.2s',
              }}>
              {/* Active indicator */}
              {active && (
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 3, background: 'var(--primary)', borderRadius: '0 0 4px 4px' }} />
              )}
              <div style={{ position: 'relative', fontSize: '1.3rem', lineHeight: 1 }}>
                {tab.icon}
                {tab.badge > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -8, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 500, color: active ? 'var(--primary)' : 'var(--muted)' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
