import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../utils/api';
const DEMO_NOTIFS = [
  { _id:'n1', title:'Order Delivered!', message:'Grocery order delivered.', type:'order', isRead:false, createdAt: new Date(Date.now()-3600000).toISOString() },
  { _id:'n2', title:'Special Offer!', message:'20% off on dairy products!', type:'promo', isRead:true, createdAt: new Date(Date.now()-86400000).toISOString() },
];
const TYPE_ICON = { order:'📦', ride:'🏍️', promo:'🎉', system:'🔔' };
const Notifications = () => {
  const [notifs, setNotifs] = useState(DEMO_NOTIFS);
  const [unread, setUnread] = useState(1);
  useEffect(() => { notificationAPI.getAll().then(r => { setNotifs(r.data.notifications); setUnread(r.data.unread); }).catch(()=>{}); }, []);
  const markAllRead = async () => { try { await notificationAPI.readAll(); } catch {} setNotifs(prev => prev.map(n=>({...n,isRead:true}))); setUnread(0); };
  const timeAgo = (date) => { const m = Math.floor((Date.now()-new Date(date).getTime())/60000); return m<60?m+'m ago':Math.floor(m/60)+'h ago'; };
  return (
    <div className="page" style={{maxWidth:600,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 className="page-title" style={{marginBottom:0}}>🔔 Notifications</h1>
        {unread>0 && <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {notifs.map(n=>(
          <div key={n._id} style={{background:n.isRead?'white':'#fff5ee',border:'1px solid '+(n.isRead?'var(--border)':'#ffedd5'),borderRadius:12,padding:16}}>
            <div style={{display:'flex',gap:12}}>
              <div style={{fontSize:'1.5rem'}}>{TYPE_ICON[n.type]||'🔔'}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <div style={{fontWeight:n.isRead?600:800}}>{n.title}</div>
                  <span style={{fontSize:'0.75rem',color:'var(--muted)'}}>{timeAgo(n.createdAt)}</span>
                </div>
                <div style={{fontSize:'0.85rem',color:'var(--muted)'}}>{n.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Notifications;
