import React, { useState } from 'react';
import api from '../utils/api';
import { FiShield, FiCheckCircle, FiCheck } from 'react-icons/fi';

const themesList = [
  { id: 'professional', name: 'Professional Blue', bg: 'bg-[#005BAC] border-cyan-500/20' },
  { id: 'emerald', name: 'Emerald Mint', bg: 'bg-[#0b6b3a] border-emerald-500/20' },
  { id: 'gold', name: 'Elite Gold', bg: 'bg-[#7a4f00] border-yellow-500/20' },
  { id: 'enterprise', name: 'Default Enterprise', bg: 'bg-[#0284c7] border-cyan-500/20' }
];

export default function Settings() {
  const [qr, setQr] = useState(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('enterprise');

  const setup2FA = async () => {
    setMessage('');
    setSuccess(false);
    try {
      const res = await api.post('/auth/setup-2fa');
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || 'Failed to initialize 2FA');
      setQr(data.qrData);
    } catch (e) { 
      setMessage(e.message); 
    }
  };

  const verify = async () => {
    setMessage('');
    setSuccess(false);
    try {
      const res = await api.post('/auth/verify-2fa', { token: code });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || 'Verification token invalid');
      setSuccess(true);
      setMessage('Two-factor authentication successfully enabled.');
      setQr(null);
      setCode('');
    } catch (e) { 
      setMessage(e.message); 
    }
  };

  const changeTheme = (themeId) => {
    setSelectedTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <h2 className="text-xl font-bold text-white">System Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Toggle 2FA security setups and choose theme profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Security / 2FA Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5"><FiShield className="text-cyan-400" /> Two-Factor Authentication</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Protect your withdrawals. Once enabled, credential sign-ins require verification codes from Google Authenticator or Authy.
            </p>
            
            {!qr ? (
              <button onClick={setup2FA} className="btn-primary text-xs font-bold py-2.5">
                Enable Authenticator 2FA
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="text-xs text-slate-300">Scan this code in your Authenticator app:</div>
                <div className="flex justify-center bg-white p-2.5 rounded-lg w-40 h-40 mx-auto">
                  <img src={qr} alt="totp qr" className="w-full h-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Enter Code</label>
                  <input 
                    type="text" 
                    placeholder="123456" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    className="glass-input text-center text-sm font-mono tracking-widest" 
                  />
                </div>
                <button onClick={verify} className="w-full btn-primary text-xs font-bold py-2.5">
                  Verify & Activate 2FA
                </button>
              </div>
            )}

            {message && (
              <div className={`text-xs p-3 rounded-lg border ${
                success 
                  ? 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5 flex items-center gap-1.5' 
                  : 'text-red-400 border-red-500/10 bg-red-500/5'
              }`}>
                {success && <FiCheckCircle />}
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Theme Settings Panel */}
        <aside className="space-y-6">
          <div className="bank-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
            <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Interface Theme</h4>
            
            <div className="space-y-3">
              {themesList.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedTheme === theme.id 
                      ? 'border-cyan-500 bg-slate-950 font-bold text-white' 
                      : 'border-slate-800 bg-slate-900/10 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border ${theme.bg}`} />
                    <span>{theme.name}</span>
                  </div>
                  {selectedTheme === theme.id && <FiCheck className="text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
