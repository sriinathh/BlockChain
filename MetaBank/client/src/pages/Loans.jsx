import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useWallet } from '../contexts/WalletContext';
import { FiTrendingUp, FiCheckCircle, FiCpu, FiAlertTriangle, FiPlus } from 'react-icons/fi';
import { RiSecurePaymentLine } from 'react-icons/ri';

export default function Loans() {
  const { account } = useWallet();
  const [amount, setAmount] = useState('');
  const [loans, setLoans] = useState([]);
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  const loadData = async () => {
    try {
      const res = await api.get('/loan/history');
      if (res.ok) {
        const data = await res.json();
        setLoans(data.loans || []);
      }
      
      const accRes = await api.get('/api/bank/accounts');
      if (accRes.ok) {
        const data = await accRes.json();
        setAccounts(data.accounts || []);
        if (data.accounts && data.accounts[0]) {
          setSelectedAccount(data.accounts[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setCreditScore(null);
    if (isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');

    setLoading(true);
    try {
      const res = await api.post('/loan/apply', {
        userId: localStorage.getItem('userId'),
        wallet: account || 'traditional_fiat',
        amount: Number(amount)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Loan request failed');

      if (data.score) setCreditScore(data.score);
      setSuccessMsg(`Your application for $${amount} has been successfully submitted for AI credit underwriting.`);
      setAmount('');
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async (loanId, totalDue) => {
    setError('');
    setSuccessMsg('');
    if (!selectedAccount) return setError('Select checking account for payment source');

    setLoading(true);
    try {
      const res = await api.post('/loan/repay', {
        loanId,
        amount: Number(totalDue),
        accountId: selectedAccount
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Repayment failed');

      setSuccessMsg(`Successfully repaid loan of $${totalDue}.`);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Apply Loan & Active list */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Application details */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <FiCpu className="text-3xl text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold text-white">AI Loan Underwriter</h3>
              <p className="text-xs text-slate-500">Traditional bank officers review flags while AI scores credit risk.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Average Interest Rate</div>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1">8.00%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Repayment Terms</div>
              <div className="text-xl font-bold text-white mt-2 flex items-center gap-1.5"><RiSecurePaymentLine /> 90 Days</div>
            </div>
          </div>
        </div>

        {/* Apply form */}
        <div className="bank-card p-6 border-slate-800 bg-slate-900/30">
          <h4 className="text-sm font-bold text-white mb-4">Request Staking Underwriting</h4>
          
          <form onSubmit={handleApply} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase">Loan Borrow Amount (USD)</label>
              <input 
                type="number" 
                placeholder="5000" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="glass-input" 
                required 
              />
            </div>

            {error && <div className="text-xs text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}
            
            {creditScore !== null && (
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="text-slate-500">AI Credit Risk Score:</div>
                  <div className={`text-md font-bold mt-0.5 ${creditScore > 0.6 ? 'text-emerald-400' : 'text-yellow-500'}`}>
                    {(creditScore * 100).toFixed(0)}% Good Standing
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Offered Interest:</div>
                  <div className="text-md font-bold text-white mt-0.5">{creditScore > 0.6 ? '5%' : '12%'} APY</div>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="text-xs text-emerald-400 border border-emerald-500/10 bg-emerald-500/5 p-3 rounded-lg flex items-center gap-1.5 font-semibold">
                <FiCheckCircle /> {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn-primary py-3 text-xs uppercase font-bold tracking-wider"
              disabled={loading}
            >
              {loading ? 'Evaluating Risk Profile...' : 'Confirm Loan Request'}
            </button>
          </form>
        </div>
      </div>

      {/* active loans panel */}
      <aside className="space-y-6">
        <div className="bank-card p-6 border-slate-800 bg-slate-900/40">
          <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Pending/Active Loans</h4>
          
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Repayment Account</label>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)} 
              className="glass-input text-xs font-bold mb-4"
            >
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id} className="text-slate-950">
                  {acc.type.toUpperCase()}: ${acc.balance}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto pr-1">
            {loans.length > 0 ? (
              loans.map(loan => {
                const totalDue = loan.amount * (1 + loan.interestRate / 100);
                return (
                  <div key={loan._id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">${loan.amount.toLocaleString()}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        loan.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        loan.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        loan.status === 'paid' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <div>Rate: {loan.interestRate}% APY</div>
                      <div>Due date: {new Date(loan.dueDate).toLocaleDateString()}</div>
                      {loan.status === 'approved' && (
                        <div className="text-slate-300 font-semibold mt-1">Repayment due: ${totalDue.toFixed(2)}</div>
                      )}
                    </div>
                    {loan.status === 'approved' && (
                      <button 
                        onClick={() => handleRepay(loan._id, totalDue)}
                        className="w-full mt-2 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold transition-all"
                        disabled={loading}
                      >
                        Repay Loan
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No underwriting applications found.</div>
            )}
          </div>
        </div>
      </aside>

    </div>
  );
}
