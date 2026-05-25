import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { FiCopy, FiSend, FiLayers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { ethers } from 'ethers';

export default function Wallet() {
  const { account, balance, mbtBalance, connect, provider } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState('ETH');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert('Address copied to clipboard');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setTxHash('');
    if (!account) return setError('Wallet not connected');
    if (!ethers.isAddress(recipient)) return setError('Invalid recipient address');
    if (isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');

    setLoading(true);
    try {
      const signer = await provider.getSigner();

      if (tokenType === 'ETH') {
        // Send ETH transaction
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount)
        });
        setTxHash(tx.hash);
        
        // Log transaction to backend
        await fetch('/api/bank/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          body: JSON.stringify({
            from: account,
            to: recipient,
            amount: Number(amount),
            tokenType: 'ETH',
            txHash: tx.hash
          })
        });
      } else {
        // Send MBT Token transaction
        const mbtAddress = process.env.REACT_APP_MBT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Default Hardhat local address if not configured
        const abi = ['function transfer(address to, uint256 amount) returns (bool)'];
        const contract = new ethers.Contract(mbtAddress, abi, signer);
        const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18));
        setTxHash(tx.hash);

        // Log transaction to backend
        await fetch('/api/bank/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          body: JSON.stringify({
            from: account,
            to: recipient,
            amount: Number(amount),
            tokenType: 'MBT',
            txHash: tx.hash
          })
        });
      }
      setAmount('');
      setRecipient('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Transaction execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Wallet Connection & Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Web3 Account Connection</h3>
          
          {!account ? (
            <div className="text-center py-10">
              <FiLayers className="text-5xl text-slate-600 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Wallet Disconnected</h4>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Connect MetaMask or another compatible Web3 provider to interact with decentralized staking, loan repayment, and reward tokens.
              </p>
              <button onClick={connect} className="btn-primary text-sm px-6 py-2.5">
                Connect MetaMask
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Linked Address</div>
                  <div className="text-sm font-mono text-cyan-400 truncate max-w-[300px]">{account}</div>
                </div>
                <button 
                  onClick={copyAddress} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  <FiCopy /> Copy
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Ether Balance</div>
                    <div className="text-2xl font-bold text-white mt-1">{balance ? `${Number(balance).toFixed(5)} ETH` : '—'}</div>
                  </div>
                  <FiTrendingUp className="text-3xl text-emerald-400 opacity-60" />
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Reward Balance</div>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">{mbtBalance ? `${Number(mbtBalance).toLocaleString()} MBT` : '—'}</div>
                  </div>
                  <FiTrendingUp className="text-3xl text-cyan-400 opacity-60" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Send Crypto Form */}
        {account && (
          <div className="bank-card p-6 border-slate-800 bg-slate-900/30">
            <div className="flex items-center gap-2 mb-6">
              <FiSend className="text-cyan-400" />
              <h4 className="text-md font-bold text-white">Send Crypto Assets</h4>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Recipient Wallet Address</label>
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    value={recipient} 
                    onChange={(e) => setRecipient(e.target.value)} 
                    className="glass-input text-xs font-mono" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Asset Type</label>
                  <select 
                    value={tokenType} 
                    onChange={(e) => setTokenType(e.target.value)} 
                    className="glass-input text-xs font-bold"
                  >
                    <option value="ETH">ETH (Native)</option>
                    <option value="MBT">MBT (Reward Token)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Amount</label>
                <input 
                  type="number" 
                  step="any" 
                  placeholder="0.01" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="glass-input" 
                  required 
                />
              </div>

              {error && <div className="text-xs text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}
              {txHash && (
                <div className="text-xs text-emerald-400 border border-emerald-500/10 bg-emerald-500/5 p-3 rounded-lg break-all">
                  <div className="font-bold flex items-center gap-1.5 mb-1"><FiCheckCircle /> Transaction Broadcasted!</div>
                  Hash: <span className="font-mono text-slate-300">{txHash}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full btn-primary py-3 text-xs uppercase font-bold tracking-wider"
                disabled={loading}
              >
                {loading ? 'Executing Transaction...' : 'Transfer Asset'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Receive Crypto Panel */}
      <aside className="space-y-6">
        {account && (
          <div className="bank-card p-6 border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center text-center">
            <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4 w-full text-left">Receive Funds</h4>
            <div className="p-3 bg-white rounded-xl border border-slate-800 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <QRCode value={account} size={160} />
            </div>
            <div className="text-xs text-slate-400 max-w-[200px] mb-2 leading-relaxed">
              Scan QR code to receive Ether or MetaTokens directly to your linked wallet.
            </div>
            <div className="text-[10px] text-slate-500 font-mono break-all bg-slate-950 p-2 rounded w-full border border-slate-900 select-all">
              {account}
            </div>
          </div>
        )}
      </aside>

    </div>
  );
}
