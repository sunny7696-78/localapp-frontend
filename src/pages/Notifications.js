import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../utils/api';

const DEMO_NOTIFS = [
  { _id:'n1', title:'Order Delivered!', message:'Your grocery order #A1B2C3 has been delivered.', type:'order', isRead:false, createdAt: new Date(Date.now()-3600000).toISOString() },
  { _id:'n2', title:'Driver Assigned', message:'Harpreet Singh will deliver your order.', type:'order', isRead:false, createdAt: new Date(Date.now()-7200000).toISOString() },
  { _id:'n3', title:'🎉 Special Offer!', message:'Get 20% off on all dairy products today!', type:'promo', isRead:true, createdAt: new Date(Date.now()-86400000).toISOString() },
  { _id:'n4', title:'Ride Completed', message:'Your ride to Sarabha Nagar was completed. Fare: ₹85', type:'ride', isRead:true, createdAt: new Date(Date.now()-172800000).toISOString() },
];

const TYPE_ICON = { order:'📦', ride:'🏍️', promo:'🎉', system:'🔔' };
const TYPE_COLOR = { order:'badge-blue', ride:'badge-orange', promo:'badge-green', system:'badge-yellow' };

const Notifications = () => {
  const [notifs, setNotifs] = useState(DEMO_NOTIFS);
  const [unread, setUnread] = useState(2);

  useEffect(() => {
    notificationAPI.getAll().then(r => { setNotifs(r.data.notifications); setUnread(r.data.unread); }).catch(()=>{});
  }, []);

  const markAllRead = async () => {
    try { await notificationAPI.readAll(); } catch {}
    setNotifs(prev => prev.map(n=>({...n,isRead:true})));
    setUnread(0);
  };

  const markRead = async (id) => {
    try { await notificationAPI.readOne(id); } catch {}
    setNotifs(prev => prev.map(n=>n._id===id?{...n,isRead:true}:n));
    setUnread(prev=>Math.max(0,prev-1));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff/60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins/60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  return (
    <div className="page" style={{maxWidth:600,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 className="page-title" style={{marginBottom:0}}>🔔 Notifications {unread>0&&<span className="cart-badge" style={{fontSize:'0.8rem',width:22,height:22}}>{unread}</span>}</h1>
        {unread>0 && <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>}
      </div>

      {notifs.length===0 ? (
        <div className="empty"><div className="empty-icon">🔔</div><h3>No notifications yet</h3></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {notifs.map(n=>(
            <div key={n._id} onClick={()=>!n.isRead&&markRead(n._id)}
              style={{background:n.isRead?'white':'#fff5ee',border:`1px solid ${n.isRead?'var(--border)':'#ffedd5'}`,borderRadius:12,padding:16,cursor:n.isRead?'default':'pointer',transition:'all 0.2s'}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <div style={{fontSize:'1.5rem',flexShrink:0}}>{TYPE_ICON[n.type]||'🔔'}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                    <div style={{fontWeight:n.isRead?600:800,fontSize:'0.95rem'}}>{n.title}</div>
                    <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      {!n.isRead&&<span style={{width:8,height:8,borderRadius:'50%',background:'var(--primary)',display:'inline-block'}}/>}
                      <span style={{fontSize:'0.75rem',color:'var(--muted)',whiteSpace:'nowrap'}}>{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                  <div style={{fontSize:'0.85rem',color:'var(--muted)'}}>{n.message}</div>
                  <span className={`badge ${TYPE_COLOR[n.type]}`} style={{marginTop:6,fontSize:'0.72rem'}}>{n.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
