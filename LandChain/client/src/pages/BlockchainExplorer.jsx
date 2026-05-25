import React, { useState, useEffect } from 'react';
import { getStoredBlocks, getStoredTransactions } from '../services/mockData';
import GlassCard from '../components/GlassCard';
import {
  Database,
  Cpu,
  Search,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

const BlockchainExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [txs, setTxs] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBlocks(getStoredBlocks());
    setTxs(getStoredTransactions());

    // Set up timer to simulate new transaction broadcast arriving every 20 seconds
    const interval = setInterval(() => {
      // Just refresh from storage, in case user performed actions in another tab
      setBlocks(getStoredBlocks());
      setTxs(getStoredTransactions());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Search by Tx hash, block height, or wallet address
    const foundTx = txs.find(
      t => t.hash.toLowerCase() === searchQuery.toLowerCase() 
           || t.from.toLowerCase() === searchQuery.toLowerCase()
           || t.to.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundTx) {
      setSelectedTx(foundTx);
    } else {
      // Check block height
      const foundBlock = blocks.find(b => b.height.toString() === searchQuery);
      if (foundBlock) {
        // Mock a tx click for that block height
        const blockTx = txs.find(t => t.blockNumber === foundBlock.height);
        if (blockTx) {
          setSelectedTx(blockTx);
        } else {
          alert('Block found, but no transaction metrics loaded.');
        }
      } else {
        alert('Search target not found in active blockchain state.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
            LANDCHAIN EXPLORER
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            ON-CHAIN DISTRIBUTED LEDGER LEDGER SEARCH ENGINE
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Block, Tx Hash, or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan rounded-xl text-xs font-bold uppercase"
          >
            Query
          </button>
        </form>
      </div>

      {/* Grid: Live Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="py-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase">Latest Block</span>
              <span className="text-lg font-bold text-white block mt-1">
                #{blocks[0]?.height || 128956}
              </span>
            </div>
            <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
              <Layers size={16} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="py-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase">Avg Gas Fee</span>
              <span className="text-lg font-bold text-cyber-cyan block mt-1">
                18.2 Gwei
              </span>
            </div>
            <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
              <Zap size={16} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="py-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase">Total Transactions</span>
              <span className="text-lg font-bold text-white block mt-1">
                {txs.length} Minted
              </span>
            </div>
            <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
              <Activity size={16} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="py-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase">System Status</span>
              <span className="text-lg font-bold text-emerald-400 block mt-1">
                SYNCHRONIZED
              </span>
            </div>
            <div className="p-2.5 bg-emerald-500/5 text-emerald-400 rounded-lg border border-emerald-500/15">
              <ShieldCheck size={16} />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Grid: Blocks & Transactions Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        
        {/* Blocks Column */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
            Mined Blocks Chronology
          </span>
          
          <div className="flex flex-col gap-4">
            {blocks.map((block) => (
              <GlassCard key={block.height} className="p-5 hover:border-cyber-cyan/30">
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-white font-bold text-sm">Block #{block.height}</span>
                  <span className="text-gray-500">{new Date(block.timestamp).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-gray-400">
                  <div>
                    <span className="text-gray-500 block">VALIDATOR NODE:</span>
                    <span className="text-white mt-0.5 block">{block.miner}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">GAS EXPENDED:</span>
                    <span className="text-cyber-cyan mt-0.5 block font-bold">{block.gasUsed} Units</span>
                  </div>
                </div>
                <div className="mt-3.5 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500">TRANSACTIONS: {block.txCount} payload</span>
                  <span className="text-cyber-cyan uppercase font-bold flex items-center gap-1">
                    <Database size={10} className="animate-pulse" /> Verified Node
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Transactions Column */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
            Recent On-Chain Activity logs
          </span>

          <div className="flex flex-col gap-4">
            {txs.map((tx) => (
              <div
                key={tx.hash}
                onClick={() => setSelectedTx(tx)}
                className="cursor-pointer"
              >
                <GlassCard className="p-5 hover:border-cyber-indigo/30 transition-all flex flex-col justify-between h-[155px]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-cyber-blue border border-white/5 flex items-center justify-center font-bold text-cyber-cyan">
                        Tx
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{tx.action}</p>
                        <span className="text-[10px] text-gray-500 truncate block mt-0.5 font-mono">
                          HASH: {tx.hash}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                      Success
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono mt-3 pt-3 border-t border-white/5 text-gray-400">
                    <div>
                      <span className="text-gray-500 block">GAS PRICE:</span>
                      <span className="text-white font-bold">{tx.gasPrice}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 block">TRANSACTION FEE:</span>
                      <span className="text-cyber-cyan font-bold">{tx.fee}</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TRANSACTION METRIC INPSECTOR DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/80 backdrop-blur-md px-4">
          <GlassCard className="max-w-lg w-full border-cyber-cyan/35 p-6 bg-cyber-dark relative overflow-hidden animate-zoomIn shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-5 right-5 p-2 bg-cyber-blue-light/50 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div className="mb-4">
              <span className="text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold">
                BLOCK TRANSACTION INSPECTOR
              </span>
              <h2 className="text-xl font-bold font-display text-white mt-1 uppercase tracking-wide truncate">
                {selectedTx.action}
              </h2>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">BLOCK CONFIRMATION #{selectedTx.blockNumber}</p>
            </div>

            {/* Spec Details Table */}
            <div className="bg-cyber-dark/90 border border-white/5 rounded-2xl p-4 font-mono text-xs text-gray-400 flex flex-col gap-3 mb-6">
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500">TRANSACTION HASH</span>
                <span className="text-cyber-cyan break-all select-all font-semibold">{selectedTx.hash}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-gray-500">FROM ADDRESS</span>
                  <span className="text-white truncate break-all select-all">{selectedTx.from}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-gray-500">TO ADDRESS</span>
                  <span className="text-white truncate break-all select-all">{selectedTx.to}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-gray-500">GAS PRICE</span>
                  <span className="text-white font-bold">{selectedTx.gasPrice}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-gray-500">GAS EXPENDED</span>
                  <span className="text-white font-bold">{selectedTx.gasUsed}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-gray-500">MINT FEE</span>
                  <span className="text-cyber-cyan font-bold">{selectedTx.fee}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-gray-500">TRANSACTION TIME:</span>
                <span className="text-white font-bold">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>

            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan font-bold uppercase tracking-wider text-xs rounded-xl transition-colors"
              >
                Close Transaction Inspector
              </button>
            </div>

          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default BlockchainExplorer;
