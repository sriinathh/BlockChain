import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiUsers, FiCreditCard, FiShield, FiTrendingUp, FiCheck, FiX } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      // 1. Analytics Stats
      const aRes = await api.get('/admin/analytics');
      if (aRes.ok) {
        const aData = await aRes.json();
        setStats(aData.stats);
      }

      // 2. KYC users
      const uRes = await api.get('/admin/users');
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users || []);
      }

      // 3. Pending Loans
      const lRes = await api.get('/admin/loans/pending');
      if (lRes.ok) {
        const lData = await lRes.json();
        setPendingLoans(lData.loans || []);
      }

      // 4. Fraud reports
      const fRes = await api.get('/admin/fraud/reports');
      if (fRes.ok) {
        const fData = await fRes.json();
        setFraudReports(fData.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyKyc = async (userId, currentStatus) => {
    try {
      const res = await api.post('/admin/verify-aadhar', { userId, verified: !currentStatus });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoanApproval = async (loanId, approveStatus) => {
    try {
      const res = await api.post('/loan/approve', { loanId, status: approveStatus });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveFraud = async (reportId, status) => {
    try {
      const res = await api.post('/admin/fraud/resolve', { reportId, status });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <h2 className="text-xl font-bold text-white">MetaBank Staff Control Center</h2>
        <p className="text-xs text-slate-500 mt-0.5">Approve loans, verify customer identities, and manage system transaction safety.</p>
      </div>

      {/* Stats Widgets */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Registered Users</div>
              <div className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</div>
            </div>
            <FiUsers className="text-2xl text-cyan-400 opacity-60" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Traditional Cash Reserves</div>
              <div className="text-2xl font-bold text-white mt-1">${stats.totalDeposits.toLocaleString()}</div>
            </div>
            <FiTrendingUp className="text-2xl text-emerald-400 opacity-60" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Pending Underwritings</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingLoansCount}</div>
            </div>
            <FiCreditCard className="text-2xl text-yellow-400 opacity-60" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Fraud Flags held</div>
              <div className="text-2xl font-bold text-rose-500 mt-1">{stats.fraudReportsCount}</div>
            </div>
            <FiShield className="text-2xl text-rose-500 opacity-60" />
          </div>
        </div>
      )}

      {/* Action lists grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KYC Verification Queue */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
          <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">KYC verification queue</h4>
          
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {users.length > 0 ? (
              users.map(u => (
                <div key={u._id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{u.fullName || u.username}</div>
                    <div className="text-slate-500 mt-0.5">{u.email} | Aadhar: {u.aadharNumber || '—'}</div>
                  </div>
                  <button 
                    onClick={() => handleVerifyKyc(u._id, u.aadharVerified)} 
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      u.aadharVerified 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20' 
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
                    }`}
                  >
                    {u.aadharVerified ? 'Verify Active' : 'Approve Aadhar'}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No pending verification uploads.</div>
            )}
          </div>
        </div>

        {/* Loan approval queue */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
          <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Loan Underwriting decisions</h4>
          
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {pendingLoans.length > 0 ? (
              pendingLoans.map(loan => (
                <div key={loan._id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">${loan.amount.toLocaleString()}</div>
                    <div className="text-slate-500 mt-0.5">User: {loan.user?.fullName || loan.user?.username}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Wallet: {loan.wallet ? `${loan.wallet.substring(0, 16)}...` : 'traditional'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLoanApproval(loan._id, 'approved')} 
                      className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm transition-all"
                    >
                      <FiCheck />
                    </button>
                    <button 
                      onClick={() => handleLoanApproval(loan._id, 'rejected')} 
                      className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm transition-all"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No pending loan applications.</div>
            )}
          </div>
        </div>

      </div>

      {/* Fraud review list */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
        <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Suspicious Anomaly Resolution</h4>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {fraudReports.length > 0 ? (
            fraudReports.map(rep => (
              <div key={rep._id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Amount: ${rep.amount.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                      rep.status === 'flagged' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <div className="text-slate-400 font-semibold">{rep.reason}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Reporter: {rep.reporter} | Risk: {(rep.riskScore * 100).toFixed(0)}%</div>
                </div>

                {rep.status === 'flagged' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleResolveFraud(rep._id, 'resolved')} 
                      className="px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold transition-all"
                    >
                      Resolve Check
                    </button>
                    <button 
                      onClick={() => handleResolveFraud(rep._id, 'dismissed')} 
                      className="px-3 py-1.5 rounded border border-slate-850 text-[10px] font-bold text-slate-400 hover:bg-slate-900 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">No transaction safety reports.</div>
          )}
        </div>
      </div>

    </div>
  );
}
