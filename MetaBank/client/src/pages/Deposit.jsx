import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiArrowDownLeft, FiCheckCircle } from 'react-icons/fi';

export default function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

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

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!selectedAccount) return setError('Please select an account');
    if (isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');

    setLoading(true);
    try {
      const res = await api.post('/bank/traditional/deposit', {
        accountId: selectedAccount,
        amount: Number(amount)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Deposit failed');

      setSuccessMsg(`Successfully deposited $${Number(amount).toFixed(2)}.`);
      setAmount('');
      loadAccounts(); // Reload balance
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white">Deposit Reserves</h2>
        <p className="text-sm text-slate-400 mt-1">Load cash balances into your checking or savings accounts.</p>
      </div>

      <div className="bank-card p-6 md:p-8 bg-slate-900/40 border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <FiArrowDownLeft className="text-emerald-400 text-xl" />
          <h3 className="text-md font-bold text-white">Fiat Cash Placement</h3>
        </div>

        <form onSubmit={handleDeposit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold uppercase">Target Account</label>
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
            <label className="text-xs text-slate-400 font-semibold uppercase">Deposit Amount (USD)</label>
            <input 
              type="number" 
              step="any" 
              placeholder="500.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="glass-input" 
              required 
            />
          </div>

          {error && <div className="text-xs text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}
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
            {loading ? 'Processing Placement...' : 'Confirm Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
}
