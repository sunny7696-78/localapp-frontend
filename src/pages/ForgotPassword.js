import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: phone, 2: otp, 3: new password
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!phone || phone.length < 10) { toast.error('Sahi phone number daalo'); return; }
    // In production: call API to send OTP via SMS
    toast.success(`OTP bheja gaya: ${generatedOtp} (Demo mode)`);
    setStep(2);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) { toast.success('OTP sahi hai!'); setStep(3); }
    else toast.error('Galat OTP — dobara try karo');
  };

  const resetPassword = async () => {
    if (newPass.length < 6) { toast.error('Password 6+ characters ka hona chahiye'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords match nahi kar rahe'); return; }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, newPassword: newPass })
      });
      if (res.ok) { toast.success('Password reset ho gaya!'); navigate('/login'); }
      else toast.error('Error aaya — dobara try karo');
    } catch {
      toast.success('Password reset ho gaya! (Demo)');
      navigate('/login');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🔐 LocalApp</div>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Password Reset</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 24 }}>
          {step === 1 ? 'Phone number daao — OTP bhejenge' : step === 2 ? `OTP enter karo jo ${phone} pe aaya` : 'Naya password set karo'}
        </p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="98765XXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" onClick={sendOtp}>OTP Bhejo 📱</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label className="form-label">4-Digit OTP</label>
              <input className="form-input" type="number" placeholder="XXXX" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4}
                style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: 8, fontWeight: 800 }} />
            </div>
            <button className="btn btn-primary btn-block" onClick={verifyOtp}>OTP Verify Karo ✅</button>
            <button onClick={() => { sendOtp(); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', width: '100%', marginTop: 10, fontWeight: 600 }}>
              OTP nahi aaya? Dobara bhejo
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-group">
              <label className="form-label">Naya Password</label>
              <input className="form-input" type="password" placeholder="Kam se kam 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password Confirm Karo</label>
              <input className="form-input" type="password" placeholder="Dobara daalo" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" onClick={resetPassword}>Password Reset Karo 🔐</button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.88rem' }}>
            ← Login pe wapas jao
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
