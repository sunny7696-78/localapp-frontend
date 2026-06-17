import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, locationAPI } from '../utils/api';

const DORAHA_CENTER = { lat: 30.7978, lng: 76.0314 };

const LiveTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const driverMarker = useRef(null);
  const homeMarker = useRef(null);
  const routeLine = useRef(null);
  const pollRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [driverLoc, setDriverLoc] = useState(null);
  const [eta, setEta] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;
    orderAPI.getOne(orderId).then(r => setOrder(r.data)).catch(() => {});
  }, [orderId]);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !window.L) return;
    const L = window.L;

    const homeLat = order?.deliveryAddress?.lat || DORAHA_CENTER.lat;
    const homeLng = order?.deliveryAddress?.lng || DORAHA_CENTER.lng;

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([homeLat, homeLng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    const homeIcon = L.divIcon({
      html: '<div style="background:#1D9E75;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.4);"><span style="transform:rotate(45deg);font-size:16px;">🏠</span></div>',
      className: '', iconSize: [34, 34], iconAnchor: [17, 34],
    });
    homeMarker.current = L.marker([homeLat, homeLng], { icon: homeIcon }).addTo(map).bindPopup('Delivery Address');

    mapInstance.current = map;
  }, [order]);

  // Poll driver location every 5s
  useEffect(() => {
    if (!orderId) return;
    const poll = async () => {
      try {
        const res = await locationAPI.get(orderId);
        const { lat, lng, isDefault } = res.data;
        setDriverLoc({ lat, lng });
        setIsLive(!isDefault);
        updateDriverMarker(lat, lng);
      } catch {}
    };
    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => clearInterval(pollRef.current);
  }, [orderId]);

  const updateDriverMarker = (lat, lng) => {
    const L = window.L;
    const map = mapInstance.current;
    if (!map || !L) return;

    if (!driverMarker.current) {
      const driverIcon = L.divIcon({
        html: '<div style="background:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 15px rgba(255,107,0,0.5);border:3px solid #FF6B00;">🏍️</div>',
        className: '', iconSize: [40, 40], iconAnchor: [20, 20],
      });
      driverMarker.current = L.marker([lat, lng], { icon: driverIcon }).addTo(map).bindPopup('Delivery Partner');
    } else {
      driverMarker.current.setLatLng([lat, lng]);
    }

    if (homeMarker.current) {
      const homeLL = homeMarker.current.getLatLng();
      if (routeLine.current) map.removeLayer(routeLine.current);
      routeLine.current = L.polyline([[lat, lng], [homeLL.lat, homeLL.lng]], { color: '#FF6B00', weight: 3, dashArray: '8,6', opacity: 0.8 }).addTo(map);

      const dist = map.distance([lat, lng], [homeLL.lat, homeLL.lng]);
      const estMin = Math.max(1, Math.round((dist / 1000) / 25 * 60));
      setEta(estMin);

      const bounds = L.latLngBounds([[lat, lng], [homeLL.lat, homeLL.lng]]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  const status = order?.status || 'pending';
  const STATUS_INFO = {
    pending: { label: 'Order confirm ho raha hai...', color: '#888', icon: '⏳' },
    accepted: { label: 'Driver assign ho gaya', color: '#FF6B00', icon: '✅' },
    preparing: { label: 'Order taiyar ho raha hai', color: '#FF6B00', icon: '👨‍🍳' },
    picked_up: { label: 'Driver aa raha hai...', color: '#FF6B00', icon: '🏍️' },
    delivered: { label: 'Order deliver ho gaya!', color: '#1D9E75', icon: '📦' },
  };
  const info = STATUS_INFO[status] || STATUS_INFO.pending;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 80px' }}>
      <div style={{ background: 'var(--secondary)', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Live Tracking</div>
          <div style={{ fontSize: '0.78rem', color: '#aaa' }}>Order #{orderId?.slice(-6).toUpperCase() || 'A1B2C3'}</div>
        </div>
        <div style={{ background: info.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
          {info.icon} {eta != null && status !== 'delivered' ? eta + ' min' : ''}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div ref={mapRef} style={{ height: 320, width: '100%', background: '#1a1a2e' }} />
        {!isLive && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem' }}>
            📡 Driver location ka wait ho raha hai...
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '10px 16px' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{info.icon} {info.label}</div>
          {eta != null && status !== 'delivered' && <div style={{ color: '#aaa', fontSize: '0.78rem' }}>Estimated: {eta} minute</div>}
        </div>
      </div>

      <div className="card card-body" style={{ margin: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
              {order?.driver?.name?.[0] || 'D'}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{order?.driver?.name || 'Driver assign ho raha hai'}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                {order?.driver?.vehicle ? `🏍️ ${order.driver.vehicle.number} · ${order.driver.vehicle.model}` : 'Vehicle details'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {order?.driver?.phone && (
              <a href={`tel:${order.driver.phone}`} style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1.1rem' }}>📞</a>
            )}
            <button onClick={() => setChatOpen(!chatOpen)} style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>💬</button>
          </div>
        </div>
      </div>

      {order?.otp && (
        <div className="card card-body" style={{ margin: '0 16px 12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 6 }}>🔐 Delivery OTP (Driver ko batao)</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: 10, color: 'var(--primary)' }}>{order.otp}</div>
        </div>
      )}

      {chatOpen && (
        <div className="card card-body" style={{ margin: '0 16px 12px' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>💬 Driver ko message karo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Main ghar pe hoon', 'Gate khula hai', 'Thoda time lo', 'Kidhar ho?', 'Shukriya!'].map(msg => (
              <button key={msg} onClick={() => navigate('/chat/order-' + (orderId || 'demo'))}
                style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.82rem' }}>{msg}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => navigate('/chat/order-' + (orderId || 'demo'))}>
            💬 Full Chat Kholo
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
