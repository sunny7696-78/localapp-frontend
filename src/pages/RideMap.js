import React, { useState } from 'react';
import { rideAPI } from '../utils/api';
import { LocationPickerMap } from '../components/GoogleMap';
import toast from 'react-hot-toast';

const VEHICLES = [
  { type: 'bike', label: 'Bike', icon: '🏍️', desc: '1 sawari · Sabse sasta', baseFare: 20, perKm: 7 },
  { type: 'auto', label: 'Auto', icon: '🛺', desc: '3 sawari · Aaraam se', baseFare: 30, perKm: 10 },
  { type: 'car', label: 'Car', icon: '🚗', desc: '4 sawari · AC', baseFare: 50, perKm: 14 },
];

const getDistance = (loc1, loc2) => {
  if (!loc1 || !loc2) return 3;
  const R = 6371;
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(loc1.lat*Math.PI/180)*Math.cos(loc2.lat*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
};

const RideMap = () => {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [vehicle, setVehicle] = useState('bike');
  const [payment, setPayment] = useState('cod');
  const [booking, setBooking] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [step, setStep] = useState('book');
  const [useMap, setUseMap] = useState(true);

  const distance = pickup && drop ? getDistance(pickup, drop) : 3;
  const sel = VEHICLES.find(v => v.type === vehicle);
  const fare = Math.round(sel.baseFare + distance * sel.perKm);
  const duration = Math.round(distance * 2.5 + 5);

  const confirmRide = async () => {
    setBooking(true);
    try {
      const res = await rideAPI.book({ vehicleType: vehicle, pickup: { address: pickup?.address, area: pickup?.address, lat: pickup?.lat, lng: pickup?.lng }, drop: { address: drop?.address, area: drop?.address, lat: drop?.lat, lng: drop?.lng }, paymentMethod: payment, distance, fare });
      setActiveRide(res.data);
    } catch {
      setActiveRide({ _id: 'demo_'+Date.now(), vehicleType: vehicle, pickup: { address: pickup?.address }, drop: { address: drop?.address }, status: 'searching', fare, otp: Math.floor(1000+Math.random()*9000).toString(), duration, distance });
    }
    setStep('tracking'); setBooking(false);
    toast.success('Ride book ho gayi! Driver dhundh rahe hain...');
  };

  const cancelRide = () => { setActiveRide(null); setStep('book'); setPickup(null); setDrop(null); toast('Ride cancel ho gayi'); };

  if (step === 'tracking' && activeRide) return (
    <div className="page" style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 16, padding: 24, marginBottom: 20, minHeight: 180, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>{[...Array(7)].map((_,i)=><div key={i} style={{ position:'absolute',left:0,right:0,top:i*15+'%',height:1,background:'#fff' }}/>)}</div>
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}><line x1="20%" y1="75%" x2="80%" y2="25%" stroke="var(--primary)" strokeWidth="3" strokeDasharray="8,4"/></svg>
        <div style={{ position:'absolute',left:'18%',top:'70%',transform:'translate(-50%,-50%)' }}><div style={{ background:'var(--green)',color:'white',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center' }}>📍</div></div>
        <div style={{ position:'absolute',left:'80%',top:'22%',transform:'translate(-50%,-50%)' }}><div style={{ background:'var(--red)',color:'white',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center' }}>🏁</div></div>
        <div style={{ position:'absolute',left:'45%',top:'48%',transform:'translate(-50%,-50%)',fontSize:'1.8rem' }}>{activeRide.vehicleType==='bike'?'🏍️':activeRide.vehicleType==='auto'?'🛺':'🚗'}</div>
        <div style={{ position:'absolute',left:'8%',bottom:'12%',color:'white',fontSize:'0.68rem',fontWeight:700,background:'rgba(34,197,94,0.85)',padding:'2px 8px',borderRadius:4 }}>{activeRide.pickup?.address?.slice(0,25)}</div>
        <div style={{ position:'absolute',right:'4%',top:'12%',color:'white',fontSize:'0.68rem',fontWeight:700,background:'rgba(239,68,68,0.85)',padding:'2px 8px',borderRadius:4 }}>{activeRide.drop?.address?.slice(0,25)}</div>
      </div>
      <div className="card card-body" style={{ marginBottom: 16 }}>
        <div style={{ textAlign:'center',marginBottom:16 }}>
          <div style={{ fontSize:'1.2rem',marginBottom:8 }}>🔍 Driver dhundh rahe hain...</div>
          <div style={{ width:'100%',height:6,background:'var(--border)',borderRadius:3,overflow:'hidden' }}><div style={{ height:'100%',background:'var(--primary)',width:'65%',borderRadius:3 }}/></div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16 }}>
          {[{label:'Kiraya',value:'₹'+activeRide.fare},{label:'OTP',value:activeRide.otp},{label:'Doori',value:activeRide.distance+' km'}].map(s=>(
            <div key={s.label} style={{ background:'var(--bg)',padding:12,borderRadius:10,textAlign:'center' }}>
              <div style={{ fontWeight:800,fontSize:'1.1rem',color:'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize:'0.75rem',color:'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'var(--bg)',borderRadius:10,padding:14,marginBottom:16 }}>
          <div style={{ display:'flex',gap:10,marginBottom:8 }}><span style={{ color:'var(--green)',fontWeight:700,width:70,fontSize:'0.8rem',flexShrink:0 }}>PICKUP</span><span style={{ fontWeight:600,fontSize:'0.88rem' }}>{activeRide.pickup?.address}</span></div>
          <div style={{ display:'flex',gap:10 }}><span style={{ color:'var(--red)',fontWeight:700,width:70,fontSize:'0.8rem',flexShrink:0 }}>DROP</span><span style={{ fontWeight:600,fontSize:'0.88rem' }}>{activeRide.drop?.address}</span></div>
        </div>
        <button className="btn btn-red btn-block" onClick={cancelRide}>Cancel Ride</button>
      </div>
    </div>
  );

  if (step === 'confirm') return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 className="page-title">Ride Confirm Karo</h1>
      <div className="card card-body">
        <div style={{ textAlign:'center',fontSize:'3rem',marginBottom:8 }}>{sel.icon}</div>
        <h3 style={{ textAlign:'center',marginBottom:20 }}>{sel.label} Ride</h3>
        <div style={{ background:'var(--bg)',borderRadius:12,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',gap:12,marginBottom:12 }}><div style={{ width:10,height:10,borderRadius:'50%',background:'var(--green)',marginTop:5,flexShrink:0 }}/><div><div style={{ fontSize:'0.75rem',color:'var(--muted)' }}>PICKUP</div><strong>{pickup?.address?.slice(0,60)}</strong></div></div>
          <div style={{ marginLeft:4,borderLeft:'2px dashed var(--border)',height:16,marginBottom:4 }}/>
          <div style={{ display:'flex',gap:12 }}><div style={{ width:10,height:10,borderRadius:'50%',background:'var(--red)',marginTop:5,flexShrink:0 }}/><div><div style={{ fontSize:'0.75rem',color:'var(--muted)' }}>DROP</div><strong>{drop?.address?.slice(0,60)}</strong></div></div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20 }}>
          {[{label:'Doori',value:distance+' km'},{label:'Samay',value:'~'+duration+' min'},{label:'Kiraya',value:'₹'+fare}].map(s=>(
            <div key={s.label} style={{ background:'var(--bg)',padding:12,borderRadius:10,textAlign:'center' }}><div style={{ fontWeight:800,color:'var(--primary)' }}>{s.value}</div><div style={{ fontSize:'0.75rem',color:'var(--muted)' }}>{s.label}</div></div>
          ))}
        </div>
        <div style={{ marginBottom:20 }}>
          <label className="form-label">Payment</label>
          <div style={{ display:'flex',gap:8 }}>
            {[{k:'cod',l:'💵 Nakit'},{k:'online',l:'📱 Online'}].map(p=>(
              <button key={p.k} onClick={()=>setPayment(p.k)} style={{ flex:1,padding:10,border:'2px solid '+(payment===p.k?'var(--primary)':'var(--border)'),borderRadius:8,background:payment===p.k?'#fff5ee':'white',cursor:'pointer',fontWeight:600 }}>{p.l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10 }}>
          <button className="btn btn-outline" style={{ flex:1 }} onClick={()=>setStep('book')}>Wapas</button>
          <button className="btn btn-primary" style={{ flex:2 }} onClick={confirmRide} disabled={booking}>{booking?'Booking...':'Confirm Ride'}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 className="page-title">🏍️ Ride Book Karo</h1>
      <div style={{ background:'#fff5ee',border:'1px solid #ffedd5',borderRadius:10,padding:12,marginBottom:16,fontSize:'0.85rem',color:'#92400e',fontWeight:600,textAlign:'center' }}>
        📍 Doraha · Sidhwan Bet · Sahnewal · Ludhiana aur aas paas
      </div>
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <div style={{ display:'flex',gap:8,marginBottom:16 }}>
          <button onClick={()=>setUseMap(true)} style={{ flex:1,padding:'8px',border:'2px solid '+(useMap?'var(--primary)':'var(--border)'),borderRadius:8,background:useMap?'#fff5ee':'white',cursor:'pointer',fontWeight:600,fontSize:'0.85rem' }}>🗺️ Map se select karo</button>
          <button onClick={()=>setUseMap(false)} style={{ flex:1,padding:'8px',border:'2px solid '+(!useMap?'var(--primary)':'var(--border)'),borderRadius:8,background:!useMap?'#fff5ee':'white',cursor:'pointer',fontWeight:600,fontSize:'0.85rem' }}>📝 Address likho</button>
        </div>
        {useMap ? (
          <LocationPickerMap pickup={pickup} drop={drop} onPickupSelect={setPickup} onDropSelect={setDrop} />
        ) : (
          <>
            <div className="form-group"><label className="form-label">📍 Pickup Address</label><input className="form-input" placeholder="Gali, mohalla, landmark..." value={pickup?.address||''} onChange={e=>setPickup({address:e.target.value,lat:30.7971,lng:75.9346})}/></div>
            <div className="form-group" style={{ marginBottom:0 }}><label className="form-label">🏁 Drop Address</label><input className="form-input" placeholder="Kahan jaana hai..." value={drop?.address||''} onChange={e=>setDrop({address:e.target.value,lat:30.8171,lng:75.9546})}/></div>
          </>
        )}
        {pickup && drop && <div style={{ marginTop:12,background:'var(--bg)',borderRadius:8,padding:10,fontSize:'0.85rem',textAlign:'center',color:'var(--muted)' }}>📏 Real distance: <strong style={{ color:'var(--text)' }}>{distance} km</strong></div>}
      </div>
      <h3 style={{ marginBottom:12 }}>Sawari Choose Karo</h3>
      <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:20 }}>
        {VEHICLES.map(v=>{
          const vFare = Math.round(v.baseFare+distance*v.perKm);
          return (
            <div key={v.type} onClick={()=>setVehicle(v.type)} style={{ border:'2px solid '+(vehicle===v.type?'var(--primary)':'var(--border)'),borderRadius:14,padding:16,cursor:'pointer',background:vehicle===v.type?'#fff5ee':'white',display:'flex',alignItems:'center',gap:16 }}>
              <div style={{ fontSize:'2rem' }}>{v.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700 }}>{v.label}</div><div style={{ fontSize:'0.82rem',color:'var(--muted)' }}>{v.desc}</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontWeight:800,color:'var(--primary)',fontSize:'1.1rem' }}>₹{vFare}</div><div style={{ fontSize:'0.75rem',color:'var(--muted)' }}>{Math.round(distance*2.5+5)} min</div></div>
              {vehicle===v.type&&<div style={{ color:'var(--primary)',fontSize:'1.2rem' }}>✓</div>}
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary btn-block" style={{ padding:16,fontSize:'1rem' }}
        onClick={()=>{ if(!pickup||!drop){toast.error('Pickup aur drop choose karo');return;} setStep('confirm'); }}>
        {sel.icon} {sel.label} Book Karo — ₹{fare}
      </button>
    </div>
  );
};

export default RideMap;
