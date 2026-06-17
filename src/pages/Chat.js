import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Chat = () => {
  const { user } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const DEMO_MESSAGES = [
    { _id: 'd1', senderName: 'Harpreet Driver', senderRole: 'driver', message: 'Haan ji, main 10 minute mein pahunch jaata hoon', createdAt: new Date(Date.now() - 300000).toISOString() },
    { _id: 'd2', senderName: user?.name || 'You', senderRole: 'customer', message: 'Theek hai, main ghar pe hoon', createdAt: new Date(Date.now() - 240000).toISOString() },
    { _id: 'd3', senderName: 'Harpreet Driver', senderRole: 'driver', message: 'Order ready kar liya, bas thodi der mein', createdAt: new Date(Date.now() - 180000).toISOString() },
  ];

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/${roomId || 'general'}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setMessages(data);
      else setMessages(DEMO_MESSAGES);
    } catch { setMessages(DEMO_MESSAGES); }
  };

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [roomId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    const tempMsg = { _id: 'temp_' + Date.now(), senderName: user?.name, senderRole: user?.role, message: input, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    const msgText = input;
    setInput('');
    try {
      await fetch(`${API_URL}/chat/${roomId || 'general'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ message: msgText })
      });
    } catch { }
    setSending(false);
  };

  const timeStr = (date) => new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isMe = (msg) => msg.senderName === user?.name || msg.sender === user?._id;

  const QUICK_REPLIES = ['Theek hai', 'Main aa raha hoon', 'Kitna time lagega?', 'Order kahan hai?', 'Shukriya!'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'var(--secondary)', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
          {user?.role === 'driver' ? '👤' : '🏍️'}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{user?.role === 'driver' ? 'Customer' : 'Delivery Partner'}</div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>● Online</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f0f0f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((msg, i) => {
          const me = isMe(msg);
          return (
            <div key={msg._id || i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%' }}>
                {!me && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 3, marginLeft: 4 }}>{msg.senderName}</div>}
                <div style={{ background: me ? 'var(--primary)' : 'white', color: me ? 'white' : 'var(--text)', borderRadius: me ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', fontSize: '0.9rem' }}>
                  {msg.message}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 3, textAlign: me ? 'right' : 'left', marginLeft: me ? 0 : 4 }}>{timeStr(msg.createdAt)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div style={{ padding: '8px 12px', background: 'white', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid var(--border)' }}>
        {QUICK_REPLIES.map(r => (
          <button key={r} onClick={() => setInput(r)} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', whiteSpace: 'nowrap', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text)' }}>{r}</button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding: '10px 14px', background: 'white', display: 'flex', gap: 10, alignItems: 'center', borderTop: '1px solid var(--border)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message likhо..."
          style={{ flex: 1, padding: '10px 16px', border: '2px solid var(--border)', borderRadius: 25, fontSize: '0.9rem', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button type="submit" disabled={sending || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: '50%', background: input.trim() ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default Chat;
