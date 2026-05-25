import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { Shield, Eye, EyeOff, Key, UserCheck, Smartphone } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import BlockchainParticle from '../components/BlockchainParticle';

const Login = () => {
  const { login } = useAuth();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format Aadhaar: XXXX-XXXX-XXXX
  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const matches = value.match(/(\d{0,4})(\d{0,4})(\d{0,4})/);
    let formatted = '';
    if (matches) {
      formatted = !matches[2] ? matches[1] : `${matches[1]}-${matches[2]}${matches[3] ? `-${matches[3]}` : ''}`;
    }
    setAadhaar(formatted.substring(0, 14));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (aadhaar.length < 14) {
      addToast('Validation Error', 'Aadhaar must be exactly 12 digits.', 'error');
      return;
    }
    if (!password) {
      addToast('Validation Error', 'Please enter your password.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(aadhaar, password);
    setIsSubmitting(false);

    if (result.success) {
      addToast('Authentication Success', `Welcome back, ${result.user.name}!`, 'success');
      if (result.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      addToast('Authentication Failed', result.message, 'error');
    }
  };

  const fillMockUser = () => {
    setAadhaar('1234-5678-9012');
    setPassword('password123');
    addToast('Credentials Filled', 'Mock User credentials loaded.', 'info');
  };

  const fillMockAdmin = () => {
    setAadhaar('0000-0000-0000');
    setPassword('admin123');
    addToast('Credentials Filled', 'Mock Admin credentials loaded.', 'info');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 overflow-hidden bg-cyber-dark">
      <BlockchainParticle count={20} />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo Shield */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-indigo to-cyber-cyan flex items-center justify-center border border-cyber-cyan/35 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
            SECURE PORTAL LOGIN
          </h2>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            AUTHORIZED AUDIT NODES ONLY
          </p>
        </div>

        <GlassCard hoverGlow={false} className="border-cyber-indigo/30 bg-cyber-blue-light/20 shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Aadhaar Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <Smartphone size={12} />
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={handleAadhaarChange}
                placeholder="0000-0000-0000"
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest focus:outline-none transition-colors placeholder-gray-600"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <Key size={12} />
                Digital Signature Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl pl-4 pr-10 py-3 text-sm text-white font-mono tracking-wider focus:outline-none transition-colors placeholder-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Wallet Address Sync Indicator */}
            <div className="p-3.5 bg-cyber-dark/50 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-400 font-mono">Wallet Credentials:</span>
                <span className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[200px]">
                  {isConnected ? walletAddress : 'Not Synchronized'}
                </span>
              </div>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="px-3 py-1.5 rounded-lg border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 font-bold transition-all"
                >
                  Sync
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <UserCheck size={12} /> Connected
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyber-indigo to-cyber-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                'ENTER CORE NETWORK'
              )}
            </button>
          </form>

          {/* Quick Mock logins for developers */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-2.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-center text-gray-500">
              Demo Sandbox Quick Access
            </span>
            <div className="flex gap-2">
              <button
                onClick={fillMockUser}
                className="flex-1 py-2 text-[10px] font-bold font-mono tracking-wider border border-white/5 hover:border-cyber-cyan/20 bg-cyber-blue-light/20 text-gray-400 hover:text-white rounded-lg transition-all"
              >
                Mock User Login
              </button>
              <button
                onClick={fillMockAdmin}
                className="flex-1 py-2 text-[10px] font-bold font-mono tracking-wider border border-white/5 hover:border-cyber-cyan/20 bg-cyber-blue-light/20 text-gray-400 hover:text-white rounded-lg transition-all"
              >
                Mock Admin Login
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Footer Nav Toggle */}
        <p className="text-center text-xs text-gray-500 mt-6">
          New citizen registration?{' '}
          <Link to="/register" className="text-cyber-cyan hover:underline hover:glow-text-cyan font-bold transition-all">
            Create Profile Card
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
