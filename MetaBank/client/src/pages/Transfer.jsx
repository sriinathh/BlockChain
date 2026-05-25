import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiSend, FiCheckCircle, FiAlertTriangle, FiPlus } from 'react-icons/fi';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [error, setError] = useState('');
  const [rewardMbt, setRewardMbt] = useState(0);

  const loadAccounts = async () => {
    try {
      const res = await api.get('/api/bank/accounts');
      if (res.ok) {
        const data = await res.json();
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
    loadAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setWarningMsg('');
    setRewardMbt(0);

    if (!selectedAccount) return setError('Please select an account');
    if (!recipientNumber) return setError('Please enter recipient account number');
    if (isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');

    setLoading(true);
    try {
      const res = await api.post('/bank/traditional/transfer', {
        fromAccountId: selectedAccount,
        toAccountNumber: recipientNumber,
        amount: Number(amount)
      });
      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Transfer failed');
      }

      if (data.ok === false && data.message.includes('flagged')) {
        setWarningMsg('WARNING: Transfer held under review. AI Anomaly detection flagged this transaction for exceeding $10,000. It is pending Bank Officer approval.');
      } else {
        setSuccessMsg(`Successfully transferred $${Number(amount).toFixed(2)} to account ${recipientNumber}.`);
        if (data.rewardMbt) {
          setRewardMbt(data.rewardMbt);
        }
      }
      
      setAmount('');
      setRecipientNumber('');
      loadAccounts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white">Secure Transfers</h2>
        <p className="text-sm text-slate-400 mt-1">Send cash transfers to other MetaBank members instantly.</p>
      </div>

      <div className="bank-card p-6 md:p-8 bg-slate-900/40 border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <FiSend className="text-cyan-400 text-xl" />
          <h3 className="text-md font-bold text-white">Ledger Transfer</h3>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Source Account</label>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)} 
              className="glass-input text-sm font-bold"
            >
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id} className="text-slate-900">
                  {acc.type.toUpperCase()} ({acc.accountNumber}) — Balance: ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Recipient Account Number</label>
            <input 
              type="text" 
              placeholder="MB-CK-123456" 
              value={recipientNumber} 
              onChange={(e) => setRecipientNumber(e.target.value)} 
              className="glass-input text-xs font-mono" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Transfer Amount (USD)</label>
            <input 
              type="number" 
              step="any" 
              placeholder="100.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="glass-input" 
              required 
            />
            {Number(amount) > 0 && (
              <div className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 mt-1">
                <FiPlus /> You will earn {(Number(amount) * 0.005).toFixed(2)} MBT cashback reward tokens!
              </div>
            )}
          </div>

          {error && <div className="text-xs text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}
          {warningMsg && (
            <div className="text-xs text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 p-3 rounded-lg flex items-start gap-2 leading-relaxed">
              <FiAlertTriangle className="text-lg flex-shrink-0" />
              <span>{warningMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="space-y-2">
              <div className="text-xs text-emerald-400 border border-emerald-500/10 bg-emerald-500/5 p-3 rounded-lg flex items-center gap-1.5 font-semibold">
                <FiCheckCircle /> {successMsg}
              </div>
              {rewardMbt > 0 && (
                <div className="text-xs text-cyan-400 border border-cyan-500/10 bg-cyan-500/5 p-3 rounded-lg flex items-center gap-1.5 font-semibold">
                  <FiCheckCircle /> Credited {rewardMbt.toFixed(2)} MBT rewards to your profile!
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full btn-primary py-3 text-xs uppercase font-bold tracking-wider"
            disabled={loading}
          >
            {loading ? 'Processing Transfer...' : 'Execute Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
