import React, { useState, useEffect } from 'react';
import { FiSearch, FiDatabase, FiLayers, FiCpu } from 'react-icons/fi';

export default function BlockchainExplorer() {
  const [stats, setStats] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [searchHash, setSearchHash] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      // 1. Load Stats
      const sRes = await fetch('/api/explorer/stats');
      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData);
      }
      
      // 2. Load Blocks
      const bRes = await fetch('/api/explorer/blocks');
      if (bRes.ok) {
        const bData = await bRes.json();
        setBlocks(bData.blocks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    if (!searchHash) return;

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/explorer/tx/${searchHash}`);
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Transaction not found');
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-2">MetaBank Blockchain Explorer</h2>
          <p className="text-xs text-slate-500 mb-4">Browse block heights, gas speeds, and smart contract ledger receipts.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search transaction hash..." 
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="glass-input text-xs font-mono" 
            />
            <button type="submit" className="btn-primary text-xs font-bold px-5 flex items-center gap-1.5 flex-shrink-0">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Grid: Search Result / Stats */}
      {searchResult && (
        <div className="bank-card p-6 border-cyan-500/20 bg-cyan-500/5 space-y-4">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Transaction Receipt</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <div className="text-slate-500">Hash:</div>
              <div className="text-white break-all mt-0.5">{searchResult.tx.hash}</div>
            </div>
            <div>
              <div className="text-slate-500">Block Number:</div>
              <div className="text-white mt-0.5">{searchResult.tx.blockNumber}</div>
            </div>
            <div>
              <div className="text-slate-500">From:</div>
              <div className="text-cyan-400 break-all mt-0.5">{searchResult.tx.from}</div>
            </div>
            <div>
              <div className="text-slate-500">To:</div>
              <div className="text-cyan-400 break-all mt-0.5">{searchResult.tx.to}</div>
            </div>
            <div>
              <div className="text-slate-500">Gas Used:</div>
              <div className="text-white mt-0.5">{searchResult.receipt ? searchResult.receipt.gasUsed : 'Pending'}</div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}

      {/* Stats Widgets */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Current Block Height</div>
              <div className="text-2xl font-bold text-white mt-1">#{stats.blockNumber}</div>
            </div>
            <FiDatabase className="text-2xl text-cyan-400 opacity-60" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Network Profile</div>
              <div className="text-2xl font-bold text-white mt-1 capitalize">{stats.networkName}</div>
            </div>
            <FiLayers className="text-2xl text-sky-400 opacity-60" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Gas Price (Gwei)</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.gasPrice} Gwei</div>
            </div>
            <FiCpu className="text-2xl text-emerald-400 opacity-60" />
          </div>
        </div>
      )}

      {/* Latest Blocks Table */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/30">
        <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Latest Local Hardhat Blocks</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Block Height</th>
                <th className="pb-3">Block Hash</th>
                <th className="pb-3">Transactions</th>
                <th className="pb-3 text-right">Age (Epoch)</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map(block => (
                <tr key={block.number} className="border-b border-slate-900 hover:bg-slate-900/20 text-slate-300 font-mono">
                  <td className="py-3 font-bold text-cyan-400">#{block.number}</td>
                  <td className="py-3 text-slate-500 truncate max-w-[200px]">{block.hash}</td>
                  <td className="py-3">{block.transactionsCount} txs</td>
                  <td className="py-3 text-right text-slate-500">{new Date(block.timestamp * 1000).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
