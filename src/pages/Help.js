import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SUPPORT_PHONE = '9876500002';
const SUPPORT_WHATSAPP = '919876500002';

const Help = () => {
  const navigate = useNavigate();
  const { t: tr } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const FAQS = [
    { q: tr('faqQ1'), a: tr('faqA1') },
    { q: tr('faqQ2'), a: tr('faqA2') },
    { q: tr('faqQ3'), a: tr('faqA3') },
    { q: tr('faqQ4'), a: tr('faqA4') },
    { q: tr('faqQ5'), a: tr('faqA5') },
    { q: tr('faqQ6'), a: tr('faqA6') },
    { q: tr('faqQ7'), a: tr('faqA7') },
  ];

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>← {tr('back')}</button>
      <h1 className="page-title">🆘 {tr('helpSupport')}</h1>

      {/* Quick contact */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>{tr('contactUs')}</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <a href={`tel:${SUPPORT_PHONE}`} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none' }}>📞 {tr('callSupport')}</a>
          <a href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(tr('helpWhatsAppMsg'))}`} target="_blank" rel="noreferrer"
            className="btn" style={{ flex: 1, background: '#25D366', color: 'white' }}>📱 WhatsApp</a>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 8 }}>{tr('supportHours')}</p>
      </div>

      {/* FAQ */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>❓ {tr('faqTitle')}</h3>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.92rem' }}>
              <span>{f.q}</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.1rem', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </div>
            {openFaq === i && (
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', paddingBottom: 12, lineHeight: 1.6 }}>{f.a}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="card card-body">
        <h3 style={{ marginBottom: 12 }}>{tr('usefulLinks')}</h3>
        <div onClick={() => navigate('/orders')} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
          <span>📦 {tr('myOrders')}</span><span style={{ color: 'var(--muted)' }}>›</span>
        </div>
        <div onClick={() => navigate('/profile')} style={{ padding: '10px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
          <span>👤 {tr('myProfile')}</span><span style={{ color: 'var(--muted)' }}>›</span>
        </div>
      </div>
    </div>
  );
};

export default Help;
