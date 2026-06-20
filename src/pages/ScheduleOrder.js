import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const DORAHA_AREAS = ['Doraha Mandi', 'Doraha Bus Stand', 'Sidhwan Bet', 'Raikot Road'];

const ScheduleOrder = () => {
  const navigate = useNavigate();
  const { t: tr } = useLanguage();
  const [type, setType] = useState('grocery');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('Doraha Mandi');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const handleSchedule = () => {
    if (!date || !time) { toast.error(tr('chooseDateTime')); return; }
    const scheduled = new Date(`${date}T${time}`);
    if (scheduled < new Date()) { toast.error(tr('chooseFutureTime')); return; }
    setSaved(true);
    toast.success(`${tr('orderScheduled')} ${new Date(scheduled).toLocaleString('en-IN')}`);
  };

  if (saved) return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
      <h2 style={{ marginBottom: 8 }}>{tr('orderScheduledTitle')}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{tr('yourOrderType')} {type === 'grocery' ? tr('groceryService') : type === 'food' ? tr('foodService') : tr('rideService')} {date} {tr('at')} {time} {tr('willBeReady')}</p>
      <div className="card card-body" style={{ marginBottom: 20, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>{tr('type')}</span><strong>{type}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>{tr('date')}</span><strong>{date}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--muted)' }}>{tr('time')}</span><strong>{time}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span style={{ color: 'var(--muted)' }}>{tr('area')}</span><strong>{address}</strong>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSaved(false)}>{tr('changeBtn')}</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/')}>{tr('goHome')}</button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="page-title">📅 {tr('scheduleOrder')}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>{tr('scheduleOrderDesc')}</p>

      <div className="card card-body" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>{tr('whatDoYouNeed')}</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[{ k: 'grocery', l: '🛒 ' + tr('groceryService'), desc: tr('dailyNeeds') }, { k: 'food', l: '🍔 ' + tr('foodService'), desc: tr('restaurantFood') }, { k: 'ride', l: '🏍️ ' + tr('rideService'), desc: tr('goSomewhere') }].map(t => (
            <div key={t.k} onClick={() => setType(t.k)} style={{ flex: 1, border: '2px solid ' + (type === t.k ? 'var(--primary)' : 'var(--border)'), borderRadius: 12, padding: 12, cursor: 'pointer', textAlign: 'center', background: type === t.k ? '#fff5ee' : 'white' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{t.l}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{tr('date')} *</label>
            <input className="form-input" type="date" value={date} min={tomorrow} max={maxDate} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{tr('time')} *</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{tr('deliveryArea')}</label>
          <select className="form-input form-select" value={address} onChange={e => setAddress(e.target.value)}>
            {DORAHA_AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{tr('notes')}</label>
          <input className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder={tr('morningDeliveryPlaceholder')} />
        </div>
      </div>

      {/* Time slots */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>⚡ {tr('quickSlots')}</h3>
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
        📅 {tr('scheduleBtn')}
      </button>
    </div>
  );
};

export default ScheduleOrder;
