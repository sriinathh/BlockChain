import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { Shield, Wallet, LogIn, User, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { walletAddress, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('landchain_theme') !== 'light';
  });

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('landchain_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('landchain_theme', 'light');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: currentUser?.role === 'Admin' ? '/admin' : '/dashboard', authRequired: true },
    { name: 'Register Land', path: '/register-land', authRequired: true },
    { name: 'My Lands', path: '/my-lands', authRequired: true },
    { name: 'Explorer', path: '/explorer' },
    { name: 'GIS Maps', path: '/maps' },
    { name: 'Profile', path: '/profile', authRequired: true },
  ];

  const handleWalletClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-indigo to-cyber-cyan flex items-center justify-center border border-cyber-cyan/35 group-hover:scale-105 transition-transform duration-300">
              <Shield size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-wider bg-gradient-to-r from-white via-gray-200 to-cyber-cyan bg-clip-text text-transparent">
              LAND<span className="text-cyber-cyan">CHAIN</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.authRequired && !currentUser) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors relative py-1 ${
                    isActive ? 'text-cyber-cyan font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions Menu */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Dark Mode toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-white/5 hover:border-cyber-cyan/30 text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wallet button */}
            <button
              onClick={handleWalletClick}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${
                isConnected
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-cyber-cyan/20'
                  : 'bg-gradient-to-r from-cyber-indigo to-cyber-cyan border-transparent text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-0.5'
              }`}
            >
              <Wallet size={14} className={isConnecting ? 'animate-spin' : ''} />
              {isConnecting ? 'Syncing...' : isConnected ? formatAddress(walletAddress) : 'Connect Wallet'}
            </button>

            {/* Login/User button */}
            {currentUser ? (
              <Link
                to={currentUser.role === 'Admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-cyber-cyan/20 bg-cyber-blue-light/50 text-gray-200 hover:text-white transition-colors"
              >
                <User size={14} />
                <span className="text-xs uppercase tracking-wide font-medium">{currentUser.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyber-cyan/20 bg-cyber-dark text-gray-300 hover:text-white transition-colors"
              >
                <LogIn size={14} />
                <span className="text-xs uppercase tracking-wide font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={handleWalletClick}
              className={`p-2 rounded-lg border ${
                isConnected ? 'border-cyber-cyan/40 text-cyber-cyan' : 'border-white/10 text-white'
              }`}
            >
              <Wallet size={16} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-white/5 hover:border-cyber-cyan/30 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/5 px-4 pt-2 pb-6 flex flex-col gap-3 animate-fadeIn">
          {navLinks.map((link) => {
            if (link.authRequired && !currentUser) return null;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wide uppercase text-gray-300 hover:text-cyber-cyan py-2 border-b border-white/5"
              >
                {link.name}
              </Link>
            );
          })}
          {currentUser ? (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest px-2">Account Role: {currentUser.role}</span>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-cyber-blue-light/30 hover:bg-cyber-blue-light text-sm"
              >
                <User size={16} />
                View Profile
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white bg-cyber-blue-light/20"
            >
              <LogIn size={16} />
              Login to System
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
