import React, { useState } from 'react';
import api from '../utils/api';

export default function Settings() {
  const [qr, setQr] = useState(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const setup2FA = async () => {
    setMessage('');
    try {
      const res = await api.post('/auth/setup-2fa');
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || 'Failed');
      setQr(data.qrData);
    } catch (e) { setMessage(e.message); }
  };

  const verify = async () => {
    try {
      const res = await api.post('/auth/verify-2fa', { token: code });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || 'Verify failed');
      setMessage('2FA enabled');
    } catch (e) { setMessage(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-[var(--muted)] mt-2">Security.</p>

      <div className="mt-6 max-w-md">
        <div className="bank-card p-4">
          <h3 className="font-semibold">Two-factor Authentication</h3>
          <p className="text-sm text-[var(--muted)] mt-2">Use an authenticator app (Google Authenticator, Authy).</p>
          {!qr ? (
            <div className="mt-3">
              <button onClick={setup2FA} className="btn-primary">Setup 2FA</button>
            </div>
          ) : (
            <div className="mt-3">
              <div>Scan this QR code in your authenticator app:</div>
              <img src={qr} alt="qr" className="mt-2 w-40 h-40" />
              <div className="mt-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" className="p-2 border rounded" />
                <div className="mt-2">
                  <button onClick={verify} className="btn-primary">Verify</button>
                </div>
              </div>
            </div>
          )}
          {message && <div className="mt-3 text-sm text-[var(--muted)]">{message}</div>}
        </div>
      </div>
    </div>
  );
}
