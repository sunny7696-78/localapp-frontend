import React from 'react';

const WHATSAPP_NUMBER = '919876543210'; // Change to your number

const WhatsAppOrder = ({ items = [], total = 0, address = '', type = 'grocery' }) => {
  const sendOrder = () => {
    const itemList = items.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
    const msg = `🏪 *LocalApp Doraha - Naya Order*\n\n` +
      `📦 Type: ${type === 'grocery' ? 'Kirana' : 'Food'}\n\n` +
      `*Items:*\n${itemList}\n\n` +
      `💰 *Total: ₹${total + 20}* (delivery ₹20 included)\n\n` +
      `📍 *Delivery Address:*\n${address || 'App se address diya'}\n\n` +
      `✅ Please confirm my order!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <button onClick={sendOrder}
      style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#25D366', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
      <span style={{ fontSize: '1.2rem' }}>📱</span> WhatsApp pe Order Karo
    </button>
  );
};

export default WhatsAppOrder;
