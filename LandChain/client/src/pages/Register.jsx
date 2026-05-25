import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { Shield, Smartphone, Mail, MapPin, User, Wallet, UserCheck, Lock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import BlockchainParticle from '../components/BlockchainParticle';

const Register = () => {
  const { register } = useAuth();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-connect wallet if possible when register mounts
  useEffect(() => {
    if (!isConnected) {
      // Prompt user to sync wallet
    }
  }, [isConnected]);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name) {
      addToast('Validation Error', 'Please enter your full name.', 'error');
      return;
    }
    if (!phone) {
      addToast('Validation Error', 'Please enter your phone number.', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Validation Error', 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (aadhaar.length < 14) {
      addToast('Validation Error', 'Aadhaar must be exactly 12 digits.', 'error');
      return;
    }
    if (!isConnected) {
      addToast('Connection Required', 'Please sync your Web3 wallet address before registering.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      name,
      aadhaar,
      walletAddress,
      email,
      phone,
      password,
      district || 'Kanchipuram',
      state || 'Tamil Nadu'
    );
    setIsSubmitting(false);

    if (result.success) {
      addToast('Registration Success', 'Deed registry profile created! Connected to dashboard.', 'success');
      navigate('/dashboard');
    } else {
      addToast('Registration Failed', result.message, 'error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 overflow-hidden bg-cyber-dark">
      <BlockchainParticle count={20} />

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Header Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-indigo to-cyber-cyan flex items-center justify-center border border-cyber-cyan/35 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
            CITIZEN RECORD CREATION
          </h2>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            CREATES DEED OWNER ID CARD IN METRICS DOCK
          </p>
        </div>

        <GlassCard hoverGlow={false} className="border-cyber-cyan/20 bg-cyber-blue-light/10 shadow-2xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <User size={12} />
                Full Name (Aadhaar Verified)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Srinath Kumar"
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <Mail size={12} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="srinath@landchain.gov.in"
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <Smartphone size={12} />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Aadhaar Number */}
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
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-widest focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Location (District, State) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                  <MapPin size={12} />
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Kanchipuram"
                  className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                  <MapPin size={12} />
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Signature Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                <Lock size={12} />
                Signature Password (min 6 chars)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Wallet Integration Sync Card */}
            <div className="mt-2 p-3 bg-cyber-dark/60 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-400 font-mono">On-Chain Identity Address:</span>
                <span className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[240px]">
                  {isConnected ? walletAddress : 'Unbound. Connect Wallet to lock token title.'}
                </span>
              </div>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="px-3.5 py-2 rounded-lg bg-cyber-indigo hover:bg-cyber-indigo/80 text-white font-bold transition-all flex items-center gap-1"
                >
                  <Wallet size={12} /> Link
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <UserCheck size={12} /> Bound
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyber-indigo to-cyber-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  INITIATING IDENTITY ON-CHAIN...
                </>
              ) : (
                'SIGN DEED REGISTRATION CARD'
              )}
            </button>
          </form>
        </GlassCard>

        {/* Redirect */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-cyber-cyan hover:underline hover:glow-text-cyan font-bold transition-all">
            Enter Vault
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
