import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import api from '../utils/api';

export default function Transactions() {
  const { account } = useWallet();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, USD, ETH, MBT
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const profileRes = await api.get('/user/profile');
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.user);
        
        const walletAddr = pData.user.wallets && pData.user.wallets[0] ? pData.user.wallets[0] : '0x0000000000000000000000000000000000000000';
        const txRes = await fetch(`/api/bank/history/${walletAddr}`);
        if (txRes.ok) {
          const tData = await txRes.json();
          setTransactions(tData.transactions || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [account]);

  const handleDownloadPDF = () => {
    const walletAddr = profile?.wallets && profile.wallets[0] ? profile.wallets[0] : '0x0000000000000000000000000000000000000000';
    window.open(`/api/bank/statement/${walletAddr}`, '_blank');
  };

  const handleDownloadCSV = () => {
    const walletAddr = profile?.wallets && profile.wallets[0] ? profile.wallets[0] : '0x0000000000000000000000000000000000000000';
    window.open(`/api/bank/csv/${walletAddr}`, '_blank');
  };

  const filtered = transactions.filter(t => {
    const matchesQuery = 
      (t.sender && t.sender.toLowerCase().includes(query.toLowerCase())) ||
      (t.receiver && t.receiver.toLowerCase().includes(query.toLowerCase())) ||
      (t.txHash && t.txHash.toLowerCase().includes(query.toLowerCase())) ||
      (t.network && t.network.toLowerCase().includes(query.toLowerCase()));
      
    if (filterType === 'ALL') return matchesQuery;
    return matchesQuery && t.tokenType === filterType;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Ledger & Statements</h2>
          <p className="text-xs text-slate-500 mt-0.5">Filter, search, and export your transaction audit logs.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-xs font-bold transition-all"
          >
            <FiFileText /> Download Passbook PDF
          </button>
          <button 
            onClick={handleDownloadCSV} 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 transition-all"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Search filter panel */}
        <aside className="bank-card p-5 border-slate-800 bg-slate-900/30 h-fit space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Search Address / Hash</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiSearch /></span>
              <input 
                type="text" 
                placeholder="0x... or network" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="glass-input pl-9 text-xs" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Filter Asset Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['ALL', 'USD', 'ETH', 'MBT'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`py-2 rounded-lg border text-center font-bold transition-all ${filterType === type ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'border-slate-800 hover:bg-slate-900 text-slate-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Transactions Table/List */}
        <div className="lg:col-span-3 bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-500 font-bold uppercase">Transactions ({filtered.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">Real-time sync</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-10 text-slate-500 text-xs">Loading ledger logs...</div>
            ) : filtered.length > 0 ? (
              filtered.map(tx => (
                <div key={tx._id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850 flex items-center justify-between text-xs hover:border-cyan-500/15 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${tx.sender ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {tx.sender ? 'OUT' : 'IN'}
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono truncate max-w-[280px]">
                        {tx.sender ? `To: ${tx.receiver}` : `From: ${tx.sender || 'SYSTEM Deposit'}`}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className={`font-bold ${tx.sender ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.sender ? '-' : '+'}{tx.amount.toLocaleString()} {tx.tokenType}
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${tx.network === 'blockchain' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-slate-850 text-slate-400 border-slate-800'}`}>
                        {tx.network}
                      </span>
                      {tx.txHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[9px] text-cyan-400 underline hover:text-cyan-300 font-mono"
                        >
                          Etherscan
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">No matching transactions found.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
