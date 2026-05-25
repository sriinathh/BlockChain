import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCreditCard, 
  FiActivity, 
  FiUser, 
  FiCpu, 
  FiLayers, 
  FiShield, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { RiExchangeLine, RiSecurePaymentLine } from 'react-icons/ri';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/user/profile');
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data.user);
      } catch (e) { /* ignore */ }
    };
    load();
  }, []);

  const baseItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/wallet', label: 'Web3 Wallet', icon: <FiCreditCard /> },
    { to: '/deposit', label: 'Deposit Cash', icon: <FiLayers /> },
    { to: '/withdraw', label: 'Withdrawal', icon: <FiLayers /> },
    { to: '/transfer', label: 'Transfers', icon: <FiActivity /> },
    { to: '/exchange', label: 'Exchange Crypto', icon: <RiExchangeLine /> },
    { to: '/staking', label: 'Staking Rewards', icon: <RiSecurePaymentLine /> },
    { to: '/loans', label: 'Loan Management', icon: <FiCreditCard /> },
    { to: '/transactions', label: 'History & Passbook', icon: <FiActivity /> },
    { to: '/nft-identity', label: 'NFT Bank Card', icon: <FiUser /> },
    { to: '/explorer', label: 'Chain Explorer', icon: <FiLayers /> },
    { to: '/fraud', label: 'Fraud Detection', icon: <FiShield /> },
    { to: '/ai-assistant', label: 'AI Assistant', icon: <FiCpu /> },
    { to: '/profile', label: 'KYC Profile', icon: <FiUser /> },
    { to: '/settings', label: 'Settings', icon: <FiSettings /> }
  ];

  const adminItems = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: <FiShield /> }
  ];

  const isStaff = profile && (profile.role === 'admin' || profile.role === 'officer');
  const items = isStaff ? [...adminItems, ...baseItems] : baseItems;

  return (
    <aside className={`hidden md:block transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} p-4`}> 
      <div className="bank-card h-full flex flex-col p-4">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 text-xl border border-cyan-500/20">
              M
            </div>
            {!collapsed && (
              <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">MetaBank</span>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-[var(--muted)] text-sm p-1.5 rounded bg-slate-900/40 hover:bg-cyan-500/10 border border-slate-800">
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {items.map((it) => (
            <NavLink 
              key={it.to} 
              to={it.to} 
              className={({ isActive }) => `flex items-center gap-3 p-2.5 rounded-lg transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'}`}
            >
              <div className="text-lg">{it.icon}</div>
              {!collapsed && <span className="text-sm font-medium">{it.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-slate-800 pt-4">
          <button 
            onClick={() => { localStorage.removeItem('authToken'); window.location.href = '/login'; }} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-800 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-semibold"
          >
            <FiLogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
