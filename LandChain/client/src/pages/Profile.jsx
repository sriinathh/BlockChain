import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { landAPI, blockchainAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  Wallet,
  Settings,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const { walletAddress, balance, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { addToast } = useNotifications();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [landsCount, setLandsCount] = useState(0);
  const [txHistory, setTxHistory] = useState([]);

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!currentUser) return;
      setName(currentUser.name);
      setEmail(currentUser.email);
      setDistrict(currentUser.district || 'Kanchipuram');
      setState(currentUser.state || 'Tamil Nadu');

      try {
        // Query lands
        const landsRes = await landAPI.getAll({ owner: currentUser.wallet });
        if (landsRes.success) {
          setLandsCount(landsRes.lands.length);
        }

        // Query tx logs
        const txsRes = await blockchainAPI.getTxHistory(currentUser.wallet);
        if (txsRes.success) {
          setTxHistory(txsRes.history);
        }
      } catch (error) {
        console.error('Failed to load profile metrics:', error.message);
      }
    };

    fetchProfileStats();
  }, [currentUser]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    addToast('Profile Lock', 'Profile updates are disabled in this testnet release to preserve KYC integrity.', 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
          PROFILE CARD
        </h1>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
          CITIZEN IDENTIFICATION CARD & CRYPTOGRAPHIC LEDGER LINK
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card & Edit Form */}
        <div className="lg:col-span-7">
          <GlassCard className="border-cyber-indigo/20">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyber-indigo to-cyber-cyan flex items-center justify-center font-display font-black text-2xl text-white shadow-xl">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">{currentUser?.name}</h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono uppercase tracking-wider flex items-center gap-0.5">
                    <ShieldCheck size={10} /> Aadhaar Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">
                  DEED WALLET ID: {currentUser?.role} CARD
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <User size={12} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <MapPin size={12} /> District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <MapPin size={12} /> State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {/* Immutable Aadhaar */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-bold">
                  IMMUTABLE AADHAAR NUMBER ID
                </span>
                <input
                  type="text"
                  value={currentUser?.aadhaar}
                  className="w-full bg-cyber-dark/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-500 font-mono tracking-widest focus:outline-none cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Edit triggers */}
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white text-xs font-bold uppercase rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all"
                    >
                      Commit Profile Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(currentUser.name);
                        setEmail(currentUser.email);
                        setDistrict(currentUser.district);
                        setState(currentUser.state);
                      }}
                      className="px-5 py-3 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all text-xs font-bold uppercase"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 border border-white/5 hover:border-cyber-cyan/35 bg-cyber-blue-light/35 text-cyber-cyan hover:text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Settings size={14} /> EDIT REGISTRY METADATA
                  </button>
                )}
              </div>

            </form>
          </GlassCard>
        </div>

        {/* Ledger Credentials & Transaction Logs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Wallet credential sync */}
          <GlassCard className="border-cyber-cyan/15 bg-cyber-cyan/5">
            <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase block mb-4">
              Cryptographic Wallet Bounds
            </span>
            {isConnected ? (
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Balance:</span>
                  <span className="text-white font-bold text-sm">{balance} ETH</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-white/5 pt-2 mt-1">
                  <span className="text-[10px] text-gray-500">Wallet Public Address:</span>
                  <span className="text-[10px] text-gray-400 break-all select-all">{walletAddress}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold uppercase rounded-lg transition-colors text-[10px] tracking-wide mt-2"
                >
                  Unbind Wallet Key
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center py-2 font-mono text-xs">
                <p className="text-gray-500">No cryptographic wallet signature bound to this session.</p>
                <button
                  onClick={connectWallet}
                  className="w-full py-2.5 bg-cyber-cyan text-cyber-dark font-bold uppercase rounded-lg transition-all"
                >
                  Link Web3 Ledger Key
                </button>
              </div>
            )}
          </GlassCard>

          {/* Owned land summary */}
          <GlassCard className="border-cyber-indigo/10 py-5">
            <div className="flex justify-between items-center font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Registered land items</span>
                <span className="text-2xl font-bold text-white block mt-1">{landsCount} Properties</span>
              </div>
              <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
                {landsCount}
              </div>
            </div>
          </GlassCard>

          {/* Transaction history logs */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
              <Clock size={14} /> Personal Transaction History
            </span>
            <div className="border-l border-white/10 pl-4 py-1 flex flex-col gap-4 font-mono text-xs">
              {txHistory.map((tx, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyber-cyan/40 border border-cyber-cyan/90" />
                  <div className="flex justify-between">
                    <span className="font-bold text-white uppercase text-[10px] flex items-center gap-1">
                      {tx.action} <ArrowUpRight size={10} className="text-cyber-cyan" />
                    </span>
                    <span className="text-[9px] text-gray-500">Mined Block</span>
                  </div>
                  <span className="text-[9px] text-gray-600 truncate block mt-0.5 max-w-[280px]">
                    HASH: {tx.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
