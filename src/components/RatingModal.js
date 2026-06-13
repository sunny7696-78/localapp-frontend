import React, { useState } from 'react';
import { reviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
const RatingModal = ({ isOpen, onClose, targetType, targetId, targetName, orderId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    if (!rating) { toast.error('Rating select karo'); return; }
    setSubmitting(true);
    try { await reviewAPI.create({ targetType, targetId, rating, comment, orderId }); toast.success('Review submitted!'); onClose(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
      <div style={{background:'white',borderRadius:20,padding:28,width:'100%',maxWidth:400}}>
        <h3 style={{marginBottom:6}}>Rate and Review</h3>
        <p style={{color:'var(--muted)',fontSize:'0.88rem',marginBottom:20}}>{targetName}</p>
        <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:20}}>
          {[1,2,3,4,5].map(star=>(
            <span key={star} onClick={()=>setRating(star)} onMouseEnter={()=>setHover(star)} onMouseLeave={()=>setHover(0)}
              style={{fontSize:'2.5rem',cursor:'pointer',color:(hover||rating)>=star?'#f59e0b':'var(--border)'}}>★</span>
          ))}
        </div>
        <div style={{textAlign:'center',marginBottom:16,color:'var(--muted)',fontSize:'0.88rem'}}>
          {rating===1?'Poor':rating===2?'Fair':rating===3?'Good':rating===4?'Very Good':rating===5?'Excellent':''}
        </div>
        <div className="form-group">
          <label className="form-label">Comment (Optional)</label>
          <textarea className="form-input" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience..." style={{resize:'none'}}/>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{flex:1}} onClick={handleSubmit} disabled={submitting}>{submitting?'Submitting...':'Submit'}</button>
        </div>
      </div>
    </div>
  );
};
export default RatingModal;
