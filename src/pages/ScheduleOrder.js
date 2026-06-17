import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DORAHA_AREAS = ['Doraha Mandi', 'Doraha Bus Stand', 'Sidhwan Bet', 'Raikot Road'];

const ScheduleOrder = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('grocery');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('Doraha Mandi');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const handleSchedule = () => {
    if (!date || !time) { toast.error('Date aur time choose karo'); return; }
    const scheduled = new Date(`${date}T${time}`);
    if (scheduled < new Date()) { toast.error('Future time choose karo'); return; }
    setSaved(true);
    toast.success(`Order schedule ho gaya! ${new Date(scheduled).toLocaleString('en-IN')}`);
  };

  if (saved) return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
      <h2 style={{ marginBottom: 8 }}>Order Schedule Ho Gaya!</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Tera {type === 'grocery' ? 'grocery' : type === 'food' ? 'food' : 'ride'} order {date} ko {time} pe ready rahega.</p>
      <div className="card card-body" style={{ marginBottom: 20, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>Type</span><strong>{type}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>Date</span><strong>{date}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>Time</span><strong>{time}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span style={{ color: 'var(--muted)' }}>Area</span><strong>{address}</strong>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSaved(false)}>Badlo</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/')}>Home Jao</button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="page-title">📅 Order Schedule Karo</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>Kal ya agle hafte ke liye order book karo — samay pe ready rahega!</p>

      <div className="card card-body" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Kya chahiye?</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[{ k: 'grocery', l: '🛒 Kirana', desc: 'Daily needs' }, { k: 'food', l: '🍔 Khana', desc: 'Restaurant food' }, { k: 'ride', l: '🏍️ Ride', desc: 'Kahin jaana' }].map(t => (
            <div key={t.k} onClick={() => setType(t.k)} style={{ flex: 1, border: '2px solid ' + (type === t.k ? 'var(--primary)' : 'var(--border)'), borderRadius: 12, padding: 12, cursor: 'pointer', textAlign: 'center', background: type === t.k ? '#fff5ee' : 'white' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t.l}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input className="form-input" type="date" value={date} min={tomorrow} max={maxDate} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time *</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Area</label>
          <select className="form-input form-select" value={address} onChange={e => setAddress(e.target.value)}>
            {DORAHA_AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notes</label>
          <input className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Morning delivery chahiye..." />
        </div>
      </div>

      {/* Time slots */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>⚡ Quick Slots</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {['08:00', '10:00', '12:00', '14:00', '16:00', '19:00'].map(slot => (
            <button key={slot} onClick={() => setTime(slot)}
              style={{ padding: '10px', border: '2px solid ' + (time === slot ? 'var(--primary)' : 'var(--border)'), borderRadius: 10, background: time === slot ? '#fff5ee' : 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: time === slot ? 'var(--primary)' : 'var(--text)' }}>
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-block" style={{ padding: 16, fontSize: '1rem' }} onClick={handleSchedule}>
        📅 Schedule Karo
      </button>
    </div>
  );
};

export default ScheduleOrder;
