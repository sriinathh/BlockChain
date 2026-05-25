import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function FraudDetection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await api.get('/admin/fraud/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <FiShield className="text-3xl text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">AI Fraud Guard</h3>
            <p className="text-xs text-slate-500">Real-time velocity checks and limit monitoring auditing checkbooks.</p>
          </div>
        </div>
      </div>

      {/* Grid: Alerts list / Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts table */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30 lg:col-span-2 space-y-4">
          <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Active Security Flags</h4>
          
          <div className="space-y-3 overflow-y-auto max-h-[450px] pr-1">
            {loading ? (
              <div className="text-center py-6 text-slate-500 text-xs">Auditing transactions...</div>
            ) : reports.length > 0 ? (
              reports.map(rep => (
                <div key={rep._id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold font-mono text-cyan-400">Flag ID: #{rep._id.substring(18)}</span>
                    <span className={`font-bold px-2 py-0.5 rounded border capitalize ${
                      rep.status === 'flagged' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">Reason:</span> {rep.reason}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                    <span>Score: <span className={`font-bold ${rep.riskScore > 0.8 ? 'text-rose-400' : 'text-yellow-500'}`}>{(rep.riskScore * 100).toFixed(0)}% Risk</span></span>
                    <span>Amount: <span className="font-bold text-white">${rep.amount.toLocaleString()}</span></span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <FiCheckCircle className="text-3xl text-emerald-400" />
                <span>Zero anomalies flagged in the current session.</span>
              </div>
            )}
          </div>
        </div>

        {/* Explainers */}
        <aside className="bank-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
          <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Audit Parameters</h4>
          
          <div className="space-y-4 text-xs text-slate-400">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center gap-1.5"><FiAlertTriangle className="text-yellow-500" /> Volume Thresholds</div>
              <p className="leading-relaxed">Transactions exceeding $10,000 are auto-flagged and put on temporary hold pending review.</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center gap-1.5"><FiAlertTriangle className="text-rose-500" /> Velocity Spikes</div>
              <p className="leading-relaxed">Consecutive micro-transfers of identical values are immediately scored for automated block listing.</p>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-slate-200 flex items-center gap-1.5"><FiCheckCircle className="text-emerald-400" /> Role Verification</div>
              <p className="leading-relaxed">Only Bank Officers can toggle user blocklist entries or manually release held transactions.</p>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
