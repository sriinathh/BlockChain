import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [need2FA, setNeed2FA] = useState(false);
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');
      if (data.require2FA) {
        setNeed2FA(true);
        return;
      }
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
  };

  const submit2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login-2fa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, token: totp }) });
      const data = await res.json();
      if (!res.ok) return setError(data.message || '2FA failed');
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {!need2FA ? (
        <form onSubmit={submit} className="grid gap-3 bg-[var(--card-bg)] p-6 bank-card">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 border rounded" />
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-end">
            <button className="btn-primary" type="submit">Login</button>
          </div>
        </form>
      ) : (
        <form onSubmit={submit2FA} className="grid gap-3 bg-[var(--card-bg)] p-6 bank-card">
          <div className="text-sm text-[var(--muted)]">Enter the code from your Authenticator app</div>
          <input value={totp} onChange={(e) => setTotp(e.target.value)} placeholder="123456" className="p-2 border rounded" />
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-end">
            <button className="btn-primary" type="submit">Verify & Login</button>
          </div>
        </form>
      )}
    </div>
  );
}
