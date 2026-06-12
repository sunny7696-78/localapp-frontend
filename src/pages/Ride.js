import React, { useState } from 'react';
import { rideAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LUDHIANA_AREAS = ['Civil Lines', 'Model Town', 'Sarabha Nagar', 'Dugri', 'BRS Nagar', 'Gurdev Nagar', 'Focal Point', 'Jamalpur', 'Rahon Road', 'Ferozepur Road', 'Pakhowal Road', 'Bus Stand', 'Railway Station', 'Clock Tower', 'Ghumar Mandi'];

const VEHICLES = [
  { type: 'bike', label: 'Bike', icon: '🏍️', desc: '1 passenger', baseFare: 25, perKm: 8 },
  { type: 'auto', label: 'Auto', icon: '🛺', desc: '3 passengers', baseFare: 35, perKm: 12 },
  { type: 'car', label: 'Car', icon: '🚗', desc: '4 passengers', baseFare: 50, perKm: 15 },
];

const Ride = () => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [vehicle, setVehicle] = useState('bike');
  const [booking, setBooking] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [payment, setPayment] = useState('cod');

  const estimatedFare = () => {
    const v = VEHICLES.find(v => v.type === vehicle);
    const dist = 3; // estimated avg 3km
    return Math.round(v.baseFare + dist * v.perKm);
  };

  const handleBook = async () => {
    if (!pickup || !drop) { toast.error('Please select pickup and drop locations'); return; }
    if (pickup === drop) { toast.error('Pickup and drop cannot be same'); return; }
    setBooking(true);
    try {
      const res = await rideAPI.book({ vehicleType: vehicle, pickup: { address: pickup, area: pickup }, drop: { address: drop, area: drop }, paymentMethod: payment });
      setActiveRide(res.data);
      toast.success('Ride booked! Searching for driver...');
    } catch {
      // Demo mode
      setActiveRide({ _id: 'demo_' + Date.now(), vehicleType: vehicle, pickup: { address: pickup }, drop: { address: drop }, status: 'searching', fare: estimatedFare(), otp: '7432', duration: 12 });
      toast.success('Ride booked! (Demo mode)');
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = () => {
    setActiveRide(null);
    toast('Ride cancelled');
  };

  if (activeRide) {
    return (
      <div className="page" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="card card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>
            {VEHICLES.find(v => v.type === activeRide.vehicleType)?.icon}
          </div>
          <h2 style={{ marginBottom: 4 }}>
            {activeRide.status === 'searching' ? '🔍 Finding Driver...' : '✅ Driver Assigned!'}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            {activeRide.status === 'searching' ? 'Please wait while we find a driver near you' : 'Your driver is on the way'}
          </p>

          <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 10, height: 10, background: 'var(--green)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }}></span>
              <div><div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>PICKUP</div><strong>{activeRide.pickup?.address}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 10, height: 10, background: 'var(--red)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }}></span>
              <div><div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>DROP</div><strong>{activeRide.drop?.address}</strong></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[{ label: 'Fare', value: `₹${activeRide.fare}` }, { label: 'OTP', value: activeRide.otp }, { label: 'ETA', value: `${activeRide.duration} min` }].map(s => (
              <div key={s.label} style={{ background: 'var(--bg)', padding: 12, borderRadius: 10 }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {activeRide.status === 'searching' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'var(--primary)', animation: 'none' }}></div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 8 }}>Searching nearby drivers...</p>
            </div>
          )}

          <button className="btn btn-red btn-block" onClick={handleCancel}>Cancel Ride</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 className="page-title">🏍️ Book a Ride</h1>

      <div className="card card-body" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label className="form-label">📍 Pickup Location</label>
          <select className="form-input form-select" value={pickup} onChange={e => setPickup(e.target.value)}>
            <option value="">Select pickup area</option>
            {LUDHIANA_AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">🏁 Drop Location</label>
          <select className="form-input form-select" value={drop} onChange={e => setDrop(e.target.value)}>
            <option value="">Select drop area</option>
            {LUDHIANA_AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Choose Vehicle</h3>
      <div className="vehicle-options" style={{ marginBottom: 20 }}>
        {VEHICLES.map(v => (
          <div key={v.type} className={`vehicle-option ${vehicle === v.type ? 'selected' : ''}`} onClick={() => setVehicle(v.type)}>
            <div className="v-icon">{v.icon}</div>
            <div className="v-name">{v.label}</div>
            <div className="v-fare">~₹{v.baseFare}+</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{v.desc}</div>
          </div>
        ))}
      </div>

      <div className="card card-body" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>Estimated Fare</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>₹{estimatedFare()}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ key: 'cod', label: '💵 Cash' }, { key: 'online', label: '📱 Online' }].map(p => (
            <button key={p.key} onClick={() => setPayment(p.key)}
              style={{ flex: 1, padding: '8px', border: `2px solid ${payment === p.key ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, background: payment === p.key ? '#fff5ee' : 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleBook} disabled={booking} style={{ padding: '14px', fontSize: '1rem' }}>
        {booking ? 'Booking...' : `🏍️ Book ${VEHICLES.find(v => v.type === vehicle)?.label} — ₹${estimatedFare()}`}
      </button>
    </div>
  );
};

export default Ride;
