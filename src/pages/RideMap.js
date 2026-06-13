import React, { useState } from 'react';
import { rideAPI } from '../utils/api';
import toast from 'react-hot-toast';
const AREAS = ['Civil Lines','Model Town','Sarabha Nagar','Dugri','BRS Nagar','Gurdev Nagar','Focal Point','Jamalpur','Rahon Road','Ferozepur Road','Pakhowal Road','Bus Stand','Railway Station','Clock Tower','Ghumar Mandi','Haibowal','Gill Road','Sundar Nagar'];
const VEHICLES = [
  { type:'bike', label:'Bike', icon:'🏍️', desc:'1 passenger - Fastest', baseFare:25, perKm:8 },
  { type:'auto', label:'Auto', icon:'🛺', desc:'3 passengers - Comfortable', baseFare:35, perKm:12 },
  { type:'car', label:'Car', icon:'🚗', desc:'4 passengers - AC', baseFare:50, perKm:15 },
];
const getDistance = (from, to) => { if(from===to) return 1; const hash = (from+to).split('').reduce((a,c)=>a+c.charCodeAt(0),0); return Math.round((hash%8)+2); };
const RideMap = () => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [vehicle, setVehicle] = useState('bike');
  const [payment, setPayment] = useState('cod');
  const [booking, setBooking] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [step, setStep] = useState('book');
  const distance = pickup && drop ? getDistance(pickup,drop) : 3;
  const sel = VEHICLES.find(v=>v.type===vehicle);
  const fare = Math.round(sel.baseFare + distance * sel.perKm);
  const duration = Math.round(distance*3+5);
  const confirmRide = async () => {
    setBooking(true);
    try { const res = await rideAPI.book({ vehicleType:vehicle, pickup:{address:pickup,area:pickup}, drop:{address:drop,area:drop}, paymentMethod:payment }); setActiveRide(res.data); }
    catch { setActiveRide({ _id:'demo_'+Date.now(), vehicleType:vehicle, pickup:{address:pickup}, drop:{address:drop}, status:'searching', fare, otp:Math.floor(1000+Math.random()*9000).toString(), duration, distance }); }
    setStep('tracking'); setBooking(false);
    toast.success('Ride booked! Driver dhundh rahe hain...');
  };
  const cancelRide = () => { setActiveRide(null); setStep('book'); setPickup(''); setDrop(''); toast('Ride cancelled'); };
  if (step==='tracking' && activeRide) return (
    <div className="page" style={{maxWidth:520,margin:'0 auto'}}>
      <div style={{background:'linear-gradient(135deg,#1a1a2e,#16213e)',borderRadius:16,padding:24,marginBottom:20,minHeight:200,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:0.08}}>{[...Array(6)].map((_,i)=><div key={i} style={{position:'absolute',left:0,right:0,top:i*17+'%',height:1,background:'#fff'}}/>)}{[...Array(5)].map((_,i)=><div key={i} style={{position:'absolute',top:0,bottom:0,left:i*22+'%',width:1,background:'#fff'}}/>)}</div>
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><line x1="20%" y1="75%" x2="80%" y2="25%" stroke="var(--primary)" strokeWidth="3" strokeDasharray="8,4"/></svg>
        <div style={{position:'absolute',left:'18%',top:'70%',transform:'translate(-50%,-50%)'}}><div style={{background:'var(--green)',color:'white',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>📍</div></div>
        <div style={{position:'absolute',left:'80%',top:'22%',transform:'translate(-50%,-50%)'}}><div style={{background:'var(--red)',color:'white',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}}>🏁</div></div>
        <div style={{position:'absolute',left:'45%',top:'48%',transform:'translate(-50%,-50%)',fontSize:'1.8rem'}}>{activeRide.vehicleType==='bike'?'🏍️':activeRide.vehicleType==='auto'?'🛺':'🚗'}</div>
        <div style={{position:'absolute',left:'10%',bottom:'15%',color:'white',fontSize:'0.7rem',fontWeight:700,background:'rgba(34,197,94,0.8)',padding:'2px 6px',borderRadius:4}}>{activeRide.pickup?.address}</div>
        <div style={{position:'absolute',right:'5%',top:'15%',color:'white',fontSize:'0.7rem',fontWeight:700,background:'rgba(239,68,68,0.8)',padding:'2px 6px',borderRadius:4}}>{activeRide.drop?.address}</div>
      </div>
      <div className="card card-body" style={{marginBottom:16}}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:'1.3rem',marginBottom:6}}>🔍 Finding your driver...</div>
          <div style={{width:'100%',height:6,background:'var(--border)',borderRadius:3,overflow:'hidden',marginTop:12}}>
            <div style={{height:'100%',background:'var(--primary)',width:'60%',borderRadius:3}}/>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
          {[{label:'Fare',value:'Rs '+activeRide.fare},{label:'OTP',value:activeRide.otp},{label:'ETA',value:activeRide.duration+' min'}].map(s=>(
            <div key={s.label} style={{background:'var(--bg)',padding:12,borderRadius:10,textAlign:'center'}}>
              <div style={{fontWeight:800,fontSize:'1.1rem',color:'var(--primary)'}}>{s.value}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--bg)',borderRadius:10,padding:14,marginBottom:16}}>
          <div style={{display:'flex',gap:10,marginBottom:8}}><span style={{color:'var(--green)',fontWeight:700,width:60,fontSize:'0.8rem'}}>PICKUP</span><span style={{fontWeight:600}}>{activeRide.pickup?.address}</span></div>
          <div style={{display:'flex',gap:10}}><span style={{color:'var(--red)',fontWeight:700,width:60,fontSize:'0.8rem'}}>DROP</span><span style={{fontWeight:600}}>{activeRide.drop?.address}</span></div>
        </div>
        <button className="btn btn-red btn-block" onClick={cancelRide}>Cancel Ride</button>
      </div>
    </div>
  );
  if (step==='confirm') return (
    <div className="page" style={{maxWidth:480,margin:'0 auto'}}>
      <h1 className="page-title">Confirm Ride</h1>
      <div className="card card-body" style={{marginBottom:16}}>
        <div style={{textAlign:'center',fontSize:'3rem',marginBottom:8}}>{sel.icon}</div>
        <h3 style={{textAlign:'center',marginBottom:20}}>{sel.label} Ride</h3>
        <div style={{background:'var(--bg)',borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{display:'flex',gap:12,marginBottom:12}}><div style={{width:10,height:10,borderRadius:'50%',background:'var(--green)',marginTop:5,flexShrink:0}}/><div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>PICKUP</div><strong>{pickup}</strong></div></div>
          <div style={{display:'flex',gap:12}}><div style={{width:10,height:10,borderRadius:'50%',background:'var(--red)',marginTop:5,flexShrink:0}}/><div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>DROP</div><strong>{drop}</strong></div></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[{label:'Distance',value:'~'+distance+' km'},{label:'Duration',value:'~'+duration+' min'},{label:'Fare',value:'Rs '+fare}].map(s=>(
            <div key={s.label} style={{background:'var(--bg)',padding:12,borderRadius:10,textAlign:'center'}}><div style={{fontWeight:800,color:'var(--primary)'}}>{s.value}</div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{s.label}</div></div>
          ))}
        </div>
        <div style={{marginBottom:20}}>
          <label className="form-label">Payment Method</label>
          <div style={{display:'flex',gap:8}}>
            {[{k:'cod',l:'Cash'},{k:'online',l:'Online'}].map(p=>(
              <button key={p.k} onClick={()=>setPayment(p.k)} style={{flex:1,padding:10,border:'2px solid '+(payment===p.k?'var(--primary)':'var(--border)'),borderRadius:8,background:payment===p.k?'#fff5ee':'white',cursor:'pointer',fontWeight:600}}>{p.l}</button>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={()=>setStep('book')}>Back</button>
          <button className="btn btn-primary" style={{flex:2}} onClick={confirmRide} disabled={booking}>{booking?'Booking...':'Confirm Ride'}</button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="page" style={{maxWidth:560,margin:'0 auto'}}>
      <h1 className="page-title">🏍️ Book a Ride</h1>
      <div className="card card-body" style={{marginBottom:20}}>
        <div className="form-group"><label className="form-label">📍 Pickup Location</label>
          <select className="form-input form-select" value={pickup} onChange={e=>setPickup(e.target.value)}><option value="">Select pickup area</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
        <div style={{textAlign:'center',color:'var(--muted)',fontSize:'1.2rem',marginBottom:8}}>↕️</div>
        <div className="form-group" style={{marginBottom:0}}><label className="form-label">🏁 Drop Location</label>
          <select className="form-input form-select" value={drop} onChange={e=>setDrop(e.target.value)}><option value="">Select drop area</option>{AREAS.filter(a=>a!==pickup).map(a=><option key={a}>{a}</option>)}</select></div>
        {pickup&&drop&&<div style={{marginTop:12,background:'var(--bg)',borderRadius:8,padding:10,fontSize:'0.85rem',color:'var(--muted)',textAlign:'center'}}>Estimated distance: <strong style={{color:'var(--text)'}}>{distance} km</strong></div>}
      </div>
      <h3 style={{marginBottom:12}}>Choose Vehicle</h3>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {VEHICLES.map(v=>{
          const vFare = Math.round(v.baseFare+distance*v.perKm);
          return (<div key={v.type} onClick={()=>setVehicle(v.type)} style={{border:'2px solid '+(vehicle===v.type?'var(--primary)':'var(--border)'),borderRadius:14,padding:16,cursor:'pointer',background:vehicle===v.type?'#fff5ee':'white',display:'flex',alignItems:'center',gap:16,transition:'all 0.2s'}}>
            <div style={{fontSize:'2rem'}}>{v.icon}</div>
            <div style={{flex:1}}><div style={{fontWeight:700}}>{v.label}</div><div style={{fontSize:'0.82rem',color:'var(--muted)'}}>{v.desc}</div></div>
            <div style={{textAlign:'right'}}><div style={{fontWeight:800,color:'var(--primary)',fontSize:'1.1rem'}}>Rs {vFare}</div><div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{Math.round(distance*3+5)} min</div></div>
            {vehicle===v.type&&<div style={{color:'var(--primary)',fontSize:'1.2rem'}}>✓</div>}
          </div>);
        })}
      </div>
      <button className="btn btn-primary btn-block" onClick={()=>{ if(!pickup||!drop){toast.error('Pickup aur drop select karo');return;} if(pickup===drop){toast.error('Same location select mat karo');return;} setStep('confirm'); }} style={{padding:16,fontSize:'1rem'}}>
        Book {sel.icon} {sel.label} - Rs {fare}
      </button>
    </div>
  );
};
export default RideMap;
