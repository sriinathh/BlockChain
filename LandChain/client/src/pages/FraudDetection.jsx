import React, { useState, useEffect } from 'react';
import { getStoredFraudReports } from '../services/mockData';
import GlassCard from '../components/GlassCard';
import {
  ShieldAlert,
  Flame,
  UserCheck,
  CheckCircle,
  FileSearch,
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const FraudDetection = () => {
  const { addToast } = useNotifications();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getStoredFraudReports());
  }, []);

  const handleResolveAlert = (id, surveyNum) => {
    // Simulate updating alert status
    setReports(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'Resolved', riskScore: 0 } : r)
    );
    addToast('Security Log Updated', `Fraud Alert for Survey ${surveyNum} marked as RESOLVED.`, 'success');
  };

  const activeReports = reports.filter(r => r.status === 'Investigating');
  const avgRiskScore = reports.length > 0
    ? Math.round(reports.reduce((acc, curr) => acc + curr.riskScore, 0) / reports.length)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
          AI FRAUD ENGINE
        </h1>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
          COGNITIVE CONTRACT & GIS OVERLAP THREAT DETECTION TELEMETRY
        </p>
      </div>

      {/* Grid: Risk Score Panel & Risk Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Score Circle Gauge */}
        <GlassCard className="col-span-1 border-cyber-indigo/20 flex flex-col items-center justify-center text-center p-6 min-h-[250px]">
          <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-4">
            Network Risk Coeff
          </span>
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-cyber-dark border border-white/5 shadow-2xl">
            {/* Pulsing glow color based on risk level */}
            <div className={`absolute inset-3 rounded-full filter blur-xl opacity-35 animate-pulse ${
              avgRiskScore > 70 ? 'bg-rose-500' : avgRiskScore > 40 ? 'bg-amber-500' : 'bg-cyber-cyan'
            }`} />
            
            {/* SVG circle stroke representation */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="6"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke={avgRiskScore > 70 ? '#f43f5e' : avgRiskScore > 40 ? '#f59e0b' : '#06b6d4'}
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - avgRiskScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center">
              <span className={`text-4xl font-extrabold font-mono tracking-tighter ${
                avgRiskScore > 70 ? 'text-rose-400' : avgRiskScore > 40 ? 'text-amber-400' : 'text-cyber-cyan'
              }`}>
                {avgRiskScore}%
              </span>
              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-1">
                {avgRiskScore > 70 ? 'HIGH RISK' : avgRiskScore > 40 ? 'ELEVATED' : 'NOMINAL'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Global Security Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GlassCard className="py-5 justify-between flex flex-col h-[115px]">
            <div className="flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-gray-500 uppercase">Tampered Checksums</span>
                <span className="text-2xl font-bold text-white block mt-1">0 Incidents</span>
              </div>
              <div className="p-2 bg-emerald-500/5 text-emerald-400 rounded-lg border border-emerald-500/15">
                <CheckCircle size={16} />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono uppercase block mt-1">
              Deed file cryptographic checks OK
            </span>
          </GlassCard>

          <GlassCard className="py-5 justify-between flex flex-col h-[115px]">
            <div className="flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-gray-500 uppercase">GIS Boundary Collisions</span>
                <span className="text-2xl font-bold text-amber-400 block mt-1">1 Collision</span>
              </div>
              <div className="p-2 bg-amber-500/5 text-amber-400 rounded-lg border border-amber-500/15">
                <Flame size={16} />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono uppercase block mt-1">
              Survey overlap collision flag
            </span>
          </GlassCard>

          <GlassCard className="py-5 justify-between flex flex-col h-[115px] sm:col-span-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-gray-500 uppercase">Active Audit Investigations</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {activeReports.length} Flagged Survey Rows
                </span>
              </div>
              <div className="p-2 bg-cyber-cyan/5 text-cyber-cyan rounded-lg border border-cyber-cyan/15">
                <FileSearch size={16} />
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Alerts Table list */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-400">
          AI Risk Warnings Ledger Logs ({reports.length})
        </span>

        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <GlassCard
              key={report.id}
              className={`p-5 border transition-all ${
                report.status === 'Resolved'
                  ? 'border-white/5 opacity-60 bg-cyber-blue-light/10'
                  : report.riskScore > 70
                  ? 'border-rose-500/30 bg-rose-950/5'
                  : 'border-amber-500/30 bg-amber-950/5'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Alert title and metadata */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border flex-shrink-0 mt-0.5 ${
                    report.status === 'Resolved'
                      ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15'
                      : report.riskScore > 70
                      ? 'bg-rose-500/5 text-rose-400 border-rose-500/15 animate-pulse'
                      : 'bg-amber-500/5 text-amber-400 border-amber-500/15'
                  }`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-white font-bold text-sm">{report.type}</span>
                      <span className="text-gray-500">• Alert ID: {report.id}</span>
                      <span className="text-gray-500">• Land: {report.landId}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 max-w-2xl leading-relaxed">
                      {report.description}
                    </p>
                    <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-wide">
                      Evidence Base: <span className="text-gray-400 font-bold select-all">{report.evidence}</span>
                    </div>
                  </div>
                </div>

                {/* Score gauge and resolution actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 md:border-l border-white/5 md:pl-6">
                  <div className="text-left md:text-right font-mono">
                    <span className="text-[9px] text-gray-500 uppercase block">Threat Level</span>
                    <span className={`text-xl font-bold block mt-0.5 ${
                      report.status === 'Resolved'
                        ? 'text-emerald-400'
                        : report.riskScore > 70
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}>
                      {report.riskScore}% Risk
                    </span>
                  </div>

                  {report.status === 'Investigating' ? (
                    <button
                      onClick={() => handleResolveAlert(report.id, report.surveyNumber)}
                      className="px-3.5 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/35 text-cyber-cyan text-[10px] font-bold font-mono uppercase tracking-wider transition-colors"
                    >
                      Verify as Resolved
                    </button>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                      <UserCheck size={12} /> Resolved
                    </span>
                  )}
                </div>

              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FraudDetection;
