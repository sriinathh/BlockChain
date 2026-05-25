import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { adminAPI, landAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  Users,
  FileSpreadsheet,
  AlertTriangle,
  Check,
  X,
  Database,
  MonitorCheck
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { currentUser, isLoading } = useAuth();
  const { addToast } = useNotifications();

  const [stats, setStats] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingLands, setPendingLands] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Get stats
      const statsRes = await adminAPI.getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentTransactions(statsRes.recentTransactions);
      }

      // 2. Get Users
      const usersRes = await adminAPI.getUsers();
      if (usersRes.success) {
        setUsers(usersRes.users);
      }

      // 3. Get Pending Lands
      const landsRes = await landAPI.getAll({ status: 'Pending' });
      if (landsRes.success) {
        setPendingLands(landsRes.lands);
      }
    } catch (error) {
      console.error("Failed to load admin metrics:", error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      fetchAdminData();
    }
  }, [currentUser]);

  // Route guard: only Admin can view this page
  if (!isLoading && (!currentUser || currentUser.role !== 'Admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleApprove = async (landId, surveyNumber) => {
    try {
      const response = await landAPI.update(landId, { status: 'Verified' });
      if (response.success) {
        addToast('Property Approved', `Survey plot ${surveyNumber} verified on-chain.`, 'success');
        setPendingLands(prev => prev.filter(l => l._id !== landId));
        // Refresh stats
        fetchAdminData();
      }
    } catch (error) {
      addToast('Audit Failed', error.message, 'error');
    }
  };

  const handleReject = async (landId, surveyNumber) => {
    try {
      const response = await landAPI.update(landId, { status: 'Rejected' });
      if (response.success) {
        addToast('Property Rejected', `Deed registry for Survey ${surveyNumber} rejected.`, 'error');
        setPendingLands(prev => prev.filter(l => l._id !== landId));
        fetchAdminData();
      }
    } catch (error) {
      addToast('Audit Failed', error.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
            ADMINISTRATOR BOARD
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            CORE NODE CONSENSUS LEVEL • HIGH AUTHORITY LEVEL
          </p>
        </div>
      </div>

      {isLoadingData ? (
        <div className="p-8 text-center text-gray-500 font-mono text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin mx-auto mb-3" />
          SYNCING AUDITOR CONSOLE DATA...
        </div>
      ) : (
        <>
          {/* Grid: Global Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <GlassCard className="py-4">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">System Users</span>
                  <span className="text-2xl font-bold text-white block mt-1">{stats.totalUsers} Citizens</span>
                </div>
                <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
                  <Users size={18} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="py-4">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Total Registers</span>
                  <span className="text-2xl font-bold text-white block mt-1">{stats.totalLands} Plots</span>
                </div>
                <div className="p-2.5 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
                  <FileSpreadsheet size={18} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="py-4">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Fraud Risk Alerts</span>
                  <span className="text-2xl font-bold text-rose-400 block mt-1">{stats.totalFraudAlerts} Active</span>
                </div>
                <div className="p-2.5 bg-rose-500/5 text-rose-400 rounded-lg border border-rose-500/15">
                  <AlertTriangle size={18} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="py-4">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Mined Blocks</span>
                  <span className="text-2xl font-bold text-emerald-400 block mt-1">{stats.networkBlocks} Ht</span>
                </div>
                <div className="p-2.5 bg-emerald-500/5 text-emerald-400 rounded-lg border border-emerald-500/15">
                  <Database size={18} />
                </div>
              </div>
            </GlassCard>

          </div>

          {/* Grid: Audit Pending Properties Table */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
              Citizen Deed Mint Requests Approval Board ({pendingLands.length})
            </span>

            <GlassCard className="p-0 overflow-hidden">
              {pendingLands.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-[10px] uppercase font-mono tracking-wider text-gray-500 bg-cyber-dark/40 border-b border-white/5">
                      <tr>
                        <th className="px-5 py-4">Deed Ref</th>
                        <th className="px-5 py-4">Owner Name / Aadhaar</th>
                        <th className="px-5 py-4">District/State</th>
                        <th className="px-5 py-4">GPS Position</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-xs">
                      {pendingLands.map((land) => (
                        <tr key={land._id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-5 py-4 font-bold text-white">
                            {land.surveyNumber} <br />
                            <span className="text-[9px] text-cyber-cyan font-normal">ID: {land.id || land._id.substring(18)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-white block font-medium">{land.ownerName}</span>
                            <span className="text-[9px] text-gray-500">{land.ownerId?.aadhaar || 'KYC SYNCED'}</span>
                          </td>
                          <td className="px-5 py-4">{land.district}, {land.state}</td>
                          <td className="px-5 py-4 text-gray-500">{land.gps}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(land._id, land.surveyNumber)}
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                                title="Approve and write to ledger"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleReject(land._id, land.surveyNumber)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 rounded-lg transition-colors"
                                title="Reject request and flag error"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500 font-mono text-xs">
                  🎉 No pending deed registrations require audit review. Validator queues are stable.
                </div>
              )}
            </GlassCard>
          </div>

          {/* Grid: User Directory and Ledger Nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Citizens list */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                Registered Citizens Audit Registry
              </span>
              <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300 font-mono">
                    <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-cyber-dark/40 border-b border-white/5">
                      <tr>
                        <th className="px-5 py-4">Name</th>
                        <th className="px-5 py-4">Aadhaar Mapping</th>
                        <th className="px-5 py-4">Associated Ledger Key</th>
                        <th className="px-5 py-4">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u.aadhaar} className="hover:bg-white/[0.01]">
                          <td className="px-5 py-3.5 text-white font-medium">{u.name}</td>
                          <td className="px-5 py-3.5">{u.aadhaar}</td>
                          <td className="px-5 py-3.5 text-gray-500 truncate max-w-[140px]" title={u.wallet}>
                            {u.wallet}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              u.role === 'Admin' 
                                ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/15'
                                : 'bg-cyber-blue-light/50 text-gray-400 border border-white/5'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Validation Node Monitor */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
                Active Validator Node Health
              </span>
              <GlassCard className="flex flex-col gap-4">
                
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <MonitorCheck size={14} className="text-emerald-400" /> Node status
                  </span>
                  <span className="text-emerald-400 font-bold uppercase">3 Nodes Live</span>
                </div>

                <div className="flex flex-col gap-3 font-mono text-[10px] text-gray-500">
                  <div className="p-3 bg-cyber-dark/80 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold">Authority Node-1 (Delhi)</span>
                      <span className="block text-gray-500 text-[9px] mt-0.5">LATENCY: 12ms • SPEED: 14.5 tx/s</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="p-3 bg-cyber-dark/80 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold">Authority Node-2 (Chennai)</span>
                      <span className="block text-gray-500 text-[9px] mt-0.5">LATENCY: 34ms • SPEED: 14.1 tx/s</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="p-3 bg-cyber-dark/80 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold">Authority Node-3 (Mumbai)</span>
                      <span className="block text-gray-500 text-[9px] mt-0.5">LATENCY: 22ms • SPEED: 15.0 tx/s</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

              </GlassCard>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
