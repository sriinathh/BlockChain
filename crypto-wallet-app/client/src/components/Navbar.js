import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

export default function Navbar(){
  const { connectWallet, address, disconnectWallet, connecting } = useWallet();
  const hasProvider = typeof window !== 'undefined' && Boolean(window.ethereum);
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 glass-card neat-navbar bg-gradient-to-r from-[#5b4fe0]/20 to-transparent">
      <div className="flex items-center gap-4">
        {motion && motion.div ? (
          <motion.div className="text-xl font-bold text-white/90" whileTap={{ scale: .95 }} initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} transition={{duration:0.3}} tabIndex={0}>CryptoWallet</motion.div>
        ) : (
          <div className="text-xl font-bold text-white/90" tabIndex={0}>CryptoWallet</div>
        )}
        <ul className="hidden md:flex gap-4 text-sm text-slate-200/80 items-center">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/features" className="nav-link">Features</Link></li>
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/transactions" className="nav-link">Transactions</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
        </ul>
      </div>
      <div className="flex items-center gap-3">
        {address ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-300">{address.slice(0,6)}...{address.slice(-4)}</div>
            <button className="px-3 py-1 neon-btn glass-card rounded-md text-sm" onClick={disconnectWallet}>Disconnect</button>
          </div>
        ) : (
          hasProvider ? (
            <button className="px-4 py-2 neon-btn bg-[#6b5ce9] hover:bg-[#5a4fd1] rounded-md text-sm font-semibold" onClick={() => connectWallet().catch(()=>{})} disabled={connecting}>{connecting? 'Connecting...' : 'Connect Wallet'}</button>
          ) : (
            <a className="px-4 py-2 neon-btn bg-[#6b5ce9] hover:bg-[#5a4fd1] rounded-md text-sm font-semibold" href="https://metamask.io/download.html" target="_blank" rel="noreferrer">Install MetaMask</a>
          )
        )}
      </div>
    </nav>
  );
}
