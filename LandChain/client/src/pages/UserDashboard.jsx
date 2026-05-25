import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { landAPI, blockchainAPI } from '../services/api';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import {
  Wallet,
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Activity,
  UserCheck
} from 'lucide-react';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { walletAddress, balance, isConnected, connectWallet } = useWallet();
  const { notifications } = useNotifications();

  const [myLands, setMyLands] = useState([]);
  const [recentTxs, setRecentTxs] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      setIsLoadingData(true);
      try {
        // Query citizen lands matching wallet
        const landsResponse = await landAPI.getAll({ owner: currentUser.wallet });
        if (landsResponse.success) {
          setMyLands(landsResponse.lands);
        }

        // Query block tx logs
        const txsResponse = await blockchainAPI.getTxHistory(currentUser.wallet);
        if (txsResponse.success) {
          setRecentTxs(txsResponse.history);
        }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const verifiedLandsCount = myLands.filter(l => l.status === 'Verified').length;
  const pendingLandsCount = myLands.filter(l => l.status === 'Pending').length;

  const chartPoints = "10,130 50,110 90,140 130,90 170,70 210,100 250,50 290,40 330,80 370,30";

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
            CITIZEN CONSOLE
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            NETWORK LOGICAL ADDRESS: LANDCHAIN.TN.NODES.USER-CARD
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 font-mono">SYSTEM CLOCK: </span>
          <span className="text-xs text-cyber-cyan font-mono font-bold">2026-05-25 12:56 (GMT+5:30)</span>
        </div>
      </div>

      {/* Grid: Welcome Card & Wallet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <GlassCard className="col-span-1 lg:col-span-2 border-cyber-indigo/20 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 text-cyber-cyan font-bold font-mono text-xs uppercase tracking-wider mb-2">
              <UserCheck size={14} />
              Session Cryptography Verified
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
              Welcome, {currentUser?.name}
            </h2>
            <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
              You are logged in via Aadhaar Card credentials. Your profile is linked to your authorized decentralized digital wallet key. You can view your properties, issue transfers, or register a new deed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold flex items-center gap-1 font-mono uppercase tracking-wider">
              <Shield size={12} /> Aadhaar Sync
            </span>
            <span className="text-xs text-gray-500 font-mono">
              KYC CARD: {currentUser?.aadhaar}
            </span>
          </div>
        </GlassCard>

        {/* Wallet Status Card */}
        <GlassCard className="border-cyber-cyan/20 bg-cyber-cyan/5 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono tracking-widest text-cyber-cyan uppercase font-bold">
                LEDGER ACCOUNT
              </span>
              <Wallet size={18} className="text-cyber-cyan" />
            </div>
            {isConnected ? (
              <div>
                <span className="text-3xl font-bold font-mono tracking-tight text-white">{balance} ETH</span>
                <p className="text-[10px] text-gray-500 font-mono truncate mt-2 bg-cyber-dark/80 p-2 rounded-lg border border-white/5">
                  {walletAddress}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 py-2">
                <span className="text-sm text-gray-400">Sync is required to read on-chain land titles.</span>
                <button
                  onClick={connectWallet}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity mt-1"
                >
                  Connect Web3 Wallet
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono mt-4 pt-3 border-t border-white/5">
            <span>NETWORK:</span>
            <span className="text-cyber-cyan font-bold uppercase">LandChain Testnet</span>
          </div>
        </GlassCard>

      </div>

      {/* Skeletons while Loading */}
      {isLoadingData ? (
        <div className="p-8 text-center text-gray-500 font-mono text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin mx-auto mb-3" />
          SYNCING DIGITAL DEED LEDGERS...
        </div>
      ) : (
        <>
          {/* Grid: Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="py-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase">Owned Lands</span>
                  <h3 className="text-3xl font-bold font-mono text-white mt-1">{myLands.length}</h3>
                </div>
                <div className="p-3 bg-cyber-cyan/5 text-cyber-cyan rounded-xl border border-cyber-cyan/15">
                  <FileSpreadsheet size={20} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="py-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase">Verified Deeds</span>
                  <h3 className="text-3xl font-bold font-mono text-emerald-400 mt-1">{verifiedLandsCount}</h3>
                </div>
                <div className="p-3 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/15">
                  <Shield size={20} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="py-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-gray-500 uppercase">Pending Audits</span>
                  <h3 className="text-3xl font-bold font-mono text-amber-400 mt-1">{pendingLandsCount}</h3>
                </div>
                <div className="p-3 bg-amber-500/5 text-amber-400 rounded-xl border border-amber-500/15">
                  <Clock size={20} />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Grid: Lands Table & Activity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lands Ownership list */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                  Your Registered Properties ({myLands.length})
                </span>
                <Link to="/my-lands" className="text-xs text-cyber-cyan hover:underline flex items-center gap-1">
                  Manage All <ArrowRight size={12} />
                </Link>
              </div>

              <GlassCard className="p-0 overflow-hidden">
                {myLands.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-[10px] uppercase font-mono tracking-wider text-gray-500 bg-cyber-dark/40 border-b border-white/5">
                        <tr>
                          <th className="px-5 py-4">Survey ID</th>
                          <th className="px-5 py-4">District/State</th>
                          <th className="px-5 py-4">Area</th>
                          <th className="px-5 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {myLands.map((land) => (
                          <tr key={land._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-4 font-bold text-white">
                              <Link to={`/my-lands`} className="hover:underline hover:text-cyber-cyan transition-colors">
                                {land.surveyNumber}
                              </Link>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-400">
                              {land.district}, {land.state}
                            </td>
                            <td className="px-5 py-4 text-xs">{land.area}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                land.status === 'Verified' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : land.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {land.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                    <p>No registered land titles detected bound to this profile.</p>
                    <Link
                      to="/register-land"
                      className="px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold uppercase rounded-lg transition-colors mt-2"
                    >
                      Create Genesis Plot Request
                    </Link>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Transaction activity chart */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                Node activity
              </span>
              <GlassCard className="flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono tracking-widest text-cyber-cyan uppercase font-bold flex items-center gap-1">
                      <Activity size={12} /> Transaction Volume
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">1h average</span>
                  </div>
                  <div className="w-full h-32 relative flex items-end">
                    <svg className="w-full h-full text-cyber-cyan overflow-visible">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={chartPoints}
                        className="drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                      />
                      <polygon
                        fill="url(#chartGlow)"
                        points={`10,150 ${chartPoints} 370,150`}
                      />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-gray-500 uppercase block">Active Node Nodes</span>
                    <span className="text-white font-bold block mt-0.5">3 Validators</span>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase block">Avg Block Speed</span>
                    <span className="text-white font-bold block mt-0.5">14.2 seconds</span>
                  </div>
                </div>
              </GlassCard>
            </div>

          </div>

          {/* Bottom Grid: Recent on-chain logs & Notification board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Recent Txs */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                  Recent Transactions Logs
                </span>
                <Link to="/explorer" className="text-xs text-cyber-cyan hover:underline">
                  Inspect Block Explorer
                </Link>
              </div>
              <GlassCard className="p-0 overflow-hidden">
                <div className="divide-y divide-white/5 font-mono text-xs">
                  {recentTxs.slice(0, 3).map((tx) => (
                    <div key={tx.hash} className="p-4 hover:bg-white/[0.01] transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-cyber-blue-light border border-white/5 flex items-center justify-center text-cyber-cyan font-bold">
                          Tx
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-white font-semibold truncate text-xs">{tx.action}</p>
                          <span className="text-[10px] text-gray-500 truncate block mt-0.5 block">
                            HASH: {tx.hash}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-white font-bold block">{tx.fee}</span>
                        <span className="text-[9px] text-emerald-400 uppercase font-bold mt-0.5 block">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Notifications Alert Board */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                Registry Alerts
              </span>
              <GlassCard className="flex flex-col justify-between h-[180px] p-5">
                <div className="overflow-y-auto pr-1 flex flex-col gap-3">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 2).map((n) => (
                      <div key={n.id} className="text-xs flex flex-col gap-0.5 border-l-2 border-cyber-cyan pl-2.5 py-0.5">
                        <span className="font-bold text-white tracking-wide uppercase text-[10px]">{n.title}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No alert logs reported.</p>
                  )}
                </div>
                <div className="border-t border-white/5 pt-3 text-[10px] text-gray-500 font-mono flex justify-between items-center">
                  <span>LEDGER STABLE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </GlassCard>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default UserDashboard;
