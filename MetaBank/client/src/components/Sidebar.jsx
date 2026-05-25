import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCreditCard, FiPieChart, FiUser, FiActivity } from 'react-icons/fi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import Brand from './Brand';

const baseItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/wallet', label: 'Wallet', icon: <FiCreditCard /> },
  { to: '/transactions', label: 'Transactions', icon: <FiActivity /> },
  { to: '/staking', label: 'Staking', icon: <RiSecurePaymentLine /> },
  { to: '/loans', label: 'Loans', icon: <FiCreditCard /> },
  { to: '/analytics', label: 'Analytics', icon: <FiPieChart /> },
  { to: '/nft-identity', label: 'NFT Identity', icon: <FiUser /> },
  { to: '/ai-assistant', label: 'AI Assistant', icon: <FiUser /> },
  { to: '/settings', label: 'Settings', icon: <FiUser /> }
];

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

  const items = profile && profile.role === 'admin' ? [{ to: '/admin/users', label: 'Admin', icon: <FiUser /> }, ...baseItems] : baseItems;
  return (
    <aside className={`hidden md:block ${collapsed ? 'w-20' : 'w-72'} p-4`}> 
      <div className="bank-card h-full flex flex-col p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Metabank.png" alt="Logo" className="w-12 h-12 rounded" />
            {!collapsed && (
              <span className="ml-3 text-2xl font-extrabold text-[var(--text-900)]">MetaBank</span>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-[var(--muted)]">{collapsed ? '»' : '«'}</button>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--nav-hover)] ${isActive ? 'bg-[var(--nav-active)] border-l-4 border-[var(--primary)]' : 'text-[var(--text-700)]'}`}>
              <div className="text-xl text-[var(--primary)]">{it.icon}</div>
              <div className="hidden md:block">{it.label}</div>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4">
          <button onClick={() => { localStorage.removeItem('authToken'); window.location.href = '/login'; }} className="w-full btn-outline">Logout</button>
        </div>
      </div>
    </aside>
  );
}
