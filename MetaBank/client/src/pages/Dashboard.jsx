import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiShield, 
  FiSend, 
  FiArrowDownLeft, 
  FiActivity, 
  FiCpu, 
  FiCopy, 
  FiCheckCircle 
} from 'react-icons/fi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import api from '../utils/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
  { name: 'Jan', value: 12400 },
  { name: 'Feb', value: 13900 },
  { name: 'Mar', value: 15300 },
  { name: 'Apr', value: 14800 },
  { name: 'May', value: 16200 },
  { name: 'Jun', value: 24841 }
];

const spendingData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 340 },
  { name: 'Wed', value: 180 },
  { name: 'Thu', value: 510 },
  { name: 'Fri', value: 230 },
  { name: 'Sat', value: 890 },
  { name: 'Sun', value: 450 }
];

export default function Dashboard() {
  const { account, balance, mbtBalance, connect } = useWallet();
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      // 1. Profile
      const profileRes = await api.get('/user/profile');
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.user);
        
        // 2. Fetch history with wallet or accounts
        const walletAddr = pData.user.wallets && pData.user.wallets[0] ? pData.user.wallets[0] : '0x0000000000000000000000000000000000000000';
        const txRes = await fetch(`/api/bank/history/${walletAddr}`);
        if (txRes.ok) {
          const tData = await txRes.json();
          setTransactions(tData.transactions || []);
        }
      }

      // 3. Accounts
      const accountsRes = await api.get('/api/bank/accounts');
      if (accountsRes.ok) {
        const aData = await accountsRes.json();
        setAccounts(aData.accounts || []);
      }

      // 4. Notifications
      const notifRes = await api.get('/api/notifications');
      if (notifRes.ok) {
        const nData = await notifRes.json();
        setNotifications(nData.notifications || []);
      }

      // 5. Fraud Reports (If Staff/Admin/Officer)
      const fraudRes = await api.get('/api/admin/fraud/reports');
      if (fraudRes.ok) {
        const fData = await fraudRes.json();
        setFraudReports(fData.reports || []);
      }
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [account]);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert('Address copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if there are active fraud alerts
  const activeFraud = fraudReports.filter(r => r.status === 'flagged');

  return (
    <div className="space-y-6">
      
      {/* Alert Banners */}
      {activeFraud.length > 0 && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 flex items-center justify-between shadow-[0_0_20px_rgba(234,179,8,0.05)] animate-pulse">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-2xl" />
            <div>
              <div className="text-sm font-bold">Security Alert: Pending AI Fraud Flag</div>
              <div className="text-xs opacity-80">{activeFraud.length} transactions held for anomaly verification.</div>
            </div>
          </div>
          <Link to="/fraud" className="px-3.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-xs font-bold transition-all">
            Resolve Flags
          </Link>
        </div>
      )}

      {/* KYC Alert */}
      {profile && !profile.aadharVerified && (
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div className="flex items-center gap-3">
            <FiShield className="text-2xl" />
            <div>
              <div className="text-sm font-bold">KYC Identity Pending Verification</div>
              <div className="text-xs opacity-80">Please upload your document or check status to verify your traditional bank account functions.</div>
            </div>
          </div>
          <Link to="/profile" className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-bold transition-all">
            KYC Portal
          </Link>
        </div>
      )}

      {/* Grid: Ledger Accounts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Checking, Savings, Investment card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-800 bg-slate-900/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
            <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Traditional Banking Reserves</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map(acc => (
                <div key={acc._id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-500 capitalize">{acc.type} Account</div>
                  <div className="text-2xl font-bold text-white">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{acc.accountNumber}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transaction Action Shortcuts */}
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => navigate('/deposit')} className="bank-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 border-slate-800 hover:border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg border border-emerald-500/20">
                <FiArrowDownLeft />
              </div>
              <span className="text-xs font-semibold text-slate-300">Deposit Cash</span>
            </button>
            <button onClick={() => navigate('/withdraw')} className="bank-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 border-slate-800 hover:border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 text-lg border border-rose-500/20">
                <FiSend />
              </div>
              <span className="text-xs font-semibold text-slate-300">Withdrawal</span>
            </button>
            <button onClick={() => navigate('/transfer')} className="bank-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 border-slate-800 hover:border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-lg border border-cyan-500/20">
                <FiActivity />
              </div>
              <span className="text-xs font-semibold text-slate-300">Send Transfer</span>
            </button>
          </div>
        </div>

        {/* Web3 Wallet Widget */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Web3 Ledger Wallet</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${account ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-red-500/10 text-red-400 border-red-500/25'}`}>
                {account ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {account ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-xs font-mono text-cyan-400 truncate max-w-[150px]">{account}</span>
                  <button onClick={copyAddress} className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-850"><FiCopy /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Ether Balance</div>
                    <div className="text-sm font-bold text-white truncate">{balance ? `${Number(balance).toFixed(4)} ETH` : '—'}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Reward Balance</div>
                    <div className="text-sm font-bold text-cyan-400 truncate">{mbtBalance ? `${Number(mbtBalance).toLocaleString()} MBT` : '—'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 mb-4">Connect Metamask to link Web3 capabilities and earn MBT rewards.</p>
                <button onClick={connect} className="btn-primary text-xs py-2 w-full">Connect Wallet</button>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 flex justify-between items-center text-xs text-slate-500">
            <span>Minted NFT Banking Card:</span>
            <Link to="/nft-identity" className="text-cyan-400 font-bold hover:underline">View NFT</Link>
          </div>
        </div>
      </div>

      {/* Grid: Charts (Portfolio growth + Spending patterns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Growth line chart */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Asset Valuation Growth</span>
              <h4 className="text-lg font-bold text-white mt-0.5">Portfolio Analytics</h4>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">USD + Crypto</span>
            </div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#fff' }} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending area chart */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Spending Velocities</span>
              <h4 className="text-lg font-bold text-white mt-0.5">Weekly Outflow</h4>
            </div>
            <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">ATM + Transfers</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row: Recent Activity & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent transactions */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-bold text-white">Recent Banking Activity</h4>
            <Link to="/transactions" className="text-xs text-cyan-400 hover:underline">View Statement</Link>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx._id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${tx.sender ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {tx.sender ? 'OUT' : 'IN'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {tx.sender ? `To: ${tx.receiver}` : `From: ${tx.sender || 'SYSTEM Deposit'}`}
                      </div>
                      <div className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${tx.sender ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.sender ? '-' : '+'}{tx.amount} {tx.tokenType}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono capitalize">{tx.network} network</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No recent transaction logs.</div>
            )}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/40 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <FiCpu className="text-xl" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Security Monitor</span>
            </div>
            <h4 className="text-md font-bold text-white">Smart Anomaly Auditing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We monitor transaction velocities and wallet changes on-chain. Linking your Web3 address secures your account and yields MBT cashback bonuses.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500">Suggested Action:</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <FiCheckCircle className="text-cyan-400" /> Stake tokens to unlock high APY rewards.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
