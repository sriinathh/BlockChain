import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Brand from './Brand';
import { FiBell } from 'react-icons/fi';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full fixed z-50 top-0 left-0 bg-white/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="MetaBank Home">
            <Brand imgClass="w-10 h-10" textClass="text-lg font-bold text-[var(--text-900)]" />
          </Link>
          <div className="hidden sm:block text-sm text-[var(--muted)]">Secure Banking • Insured</div>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 mx-6">
          <div className="flex items-center bg-white border rounded-md px-3 py-2 flex-1">
            <input className="w-full outline-none text-sm text-[var(--text-700)]" placeholder="Search transactions, beneficiaries, services..." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-md text-[var(--primary)] bg-[var(--nav-active)]">Bank</span>
            <select className="text-sm border-transparent bg-transparent" aria-label="Language">
              <option>EN</option>
              <option>HI</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <ThemeSwitcher />
            <button className="p-2 rounded-md text-[var(--muted)]"><FiBell /></button>
          </div>

          <Link to="/dashboard" className="btn-primary hidden sm:inline-flex">Launch Banking</Link>

          <button onClick={() => setOpen(!open)} className="p-2 rounded-md md:hidden">
            <Menu />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-2 p-4">
          <div className="bank-card bank-card-sm">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-[var(--text-700)]">Home</Link>
              <Link to="/dashboard" className="text-[var(--text-700)]">Dashboard</Link>
              <Link to="/wallet" className="text-[var(--text-700)]">Wallet</Link>
              <Link to="/ai-assistant" className="text-[var(--text-700)]">AI Assistant</Link>
              <Link to="/dashboard" className="btn-primary mt-2">Launch Banking</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
