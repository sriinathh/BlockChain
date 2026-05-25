import React from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';

export default function TopNavbar() {
  const { account, balance, connect } = useWallet();
  return (
    <header className="w-full bank-card flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="text-sm text-[var(--text-700)]">Network: <span className="font-semibold text-[var(--primary)]">Ethereum</span></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center border rounded-md px-3 py-1 gap-2">
          <FiSearch className="text-[var(--muted)]" />
          <input className="bg-transparent outline-none text-sm text-[var(--text-700)]" placeholder="Search transactions, tokens..." />
        </div>

        <div className="text-sm text-[var(--text-700)]">{account ? `${account.slice(0,6)}...${account.slice(-4)}` : 'Not connected'}</div>
        {balance && <div className="text-sm text-[var(--muted)]">{Number(balance).toFixed(4)} ETH</div>}

        {!account ? (
          <button onClick={connect} className="btn-primary">Connect Wallet</button>
        ) : (
          <button className="btn-outline">Connected</button>
        )}

        <button className="p-2 rounded-md text-[var(--muted)]"> <FiBell /> </button>
      </div>
    </header>
  );
}
