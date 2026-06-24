import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';

// Loads Razorpay checkout.js script once
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({ amount, name, description, orderType, refId, onSuccess, disabled, buttonText, userInfo }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) { toast.error('Payment SDK load nahi hua. Internet check karo.'); setLoading(false); return; }

      // Step 1: create order on backend
      const { data } = await API.post('/payment/create-order', { amount, receipt: refId });

      // Step 2: open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'LocalApp Doraha',
        description: description || name,
        prefill: {
          name: userInfo?.name || '',
          contact: userInfo?.phone || '',
        },
        theme: { color: '#FF6B00' },
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderType,
              refId,
            });
            if (verifyRes.data.verified) {
              toast.success('Payment successful! ✅');
              if (onSuccess) onSuccess(response.razorpay_payment_id);
            } else {
              toast.error('Payment verify nahi hua. Support se contact karo.');
            }
          } catch {
            toast.error('Payment verification error. Support se contact karo.');
          }
        },
        modal: {
          ondismiss: function () {
            toast('Payment cancel ho gaya');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment fail ho gaya: ' + (response.error?.description || 'Try again'));
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment start nahi hua');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-primary btn-block" onClick={handlePay} disabled={disabled || loading} style={{ padding: 14, fontSize: '1rem' }}>
      {loading ? 'Loading...' : (buttonText || `📱 Pay ₹${amount}`)}
    </button>
  );
};

export default RazorpayButton;
