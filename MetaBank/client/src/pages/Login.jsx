import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { FiMail, FiLock, FiCpu, FiShield, FiCreditCard } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [need2FA, setNeed2FA] = useState(false);
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { connect, account } = useWallet();
  const navigate = useNavigate();

  const handleWalletLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await connect();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'MetaMask Login Failed. Ensure provider is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }) 
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');
      if (data.require2FA) {
        setNeed2FA(true);
        return;
      }
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err) { 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  const submit2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login-2fa', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, token: totp }) 
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || '2FA verification failed');
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err) { 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(6,182,212,0.06)_0px,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(at_100%_100%,rgba(2,132,199,0.06)_0px,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-cyan-500/10 items-center justify-center font-bold text-cyan-400 text-2xl border border-cyan-500/25 mb-4">
            M
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to access your secure decentralized ledger.</p>
        </div>

        <div className="bank-card p-6 md:p-8 bg-slate-900/40 border-slate-800">
          {!need2FA ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiMail /></span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="email@example.com" 
                    className="glass-input pl-10" 
                    required 
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiLock /></span>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="glass-input pl-10" 
                    required 
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}

              <button 
                type="submit" 
                className="w-full btn-primary py-3 text-sm"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In with Credentials'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase">Or continue with</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <button 
                type="button" 
                onClick={handleWalletLogin}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 font-bold transition-all text-sm"
                disabled={loading}
              >
                <FiCreditCard className="text-lg" />
                Sign In with Web3 Wallet
              </button>
            </form>
          ) : (
            <form onSubmit={submit2FA} className="space-y-4">
              <div className="text-center space-y-2 mb-4">
                <div className="inline-flex w-10 h-10 rounded-full bg-cyan-500/10 items-center justify-center text-cyan-400 text-lg border border-cyan-500/20">
                  <FiShield />
                </div>
                <h3 className="text-lg font-bold text-white">2FA Verification</h3>
                <p className="text-xs text-slate-400">Enter the authenticator code from Google Authenticator or Authy.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Authenticator Token</label>
                <input 
                  type="text" 
                  value={totp} 
                  onChange={(e) => setTotp(e.target.value)} 
                  placeholder="123456" 
                  className="glass-input text-center text-xl tracking-widest" 
                  required 
                />
              </div>

              {error && <div className="text-sm text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}

              <button 
                type="submit" 
                className="w-full btn-primary py-3 text-sm"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Token & Login'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account? <Link to="/register" className="text-cyan-400 hover:underline">Open one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
