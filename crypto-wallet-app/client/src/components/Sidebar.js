import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSend, FiClock, FiSettings } from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const Item = ({to, label, Icon}) => (
  <NavLink to={to} className={({isActive})=>`flex items-center gap-3 p-3 rounded-md ${isActive? 'bg-violet-700/30':'hover:bg-white/5'}`}>
    <SafeIcon Icon={Icon} size={18} /> <span>{label}</span>
  </NavLink>
);

export default function Sidebar(){
  return (
    <aside className="w-64 hidden md:flex flex-col gap-3 p-4 card">
      <div className="mb-2 px-2 text-sm muted">Navigation</div>
      <Item to="/dashboard" label="Dashboard" Icon={FiHome} />
      <Item to="/send" label="Send" Icon={FiSend} />
      <Item to="/transactions" label="Transactions" Icon={FiClock} />
      <Item to="/settings" label="Settings" Icon={FiSettings} />
      <div className="mt-auto px-2 text-xs muted">© {new Date().getFullYear()} CryptoWallet</div>
    </aside>
  );
}
