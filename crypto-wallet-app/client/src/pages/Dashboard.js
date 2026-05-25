import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WalletCard from '../components/WalletCard';
import CryptoChart from '../components/CryptoChart';
import { useWallet } from '../context/WalletContext';
import TransactionCard from '../components/TransactionCard';
import * as api from '../services/api';

export default function Dashboard(){
  const { address, balance, network, fetchBalance } = useWallet();
  const [loadingTx, setLoadingTx] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [recentTotal, setRecentTotal] = useState(0);
  const [showReceive, setShowReceive] = useState(false);
  const [chartPrices, setChartPrices] = useState(null);

  // Fetch ETH price from CoinGecko
  const [ethPrice, setEthPrice] = useState(null);
  const [ethDelta, setEthDelta] = useState(null);

  useEffect(() => {
    if (!address) return;
    let mounted = true;
    const load = async () => {
      setLoadingTx(true);
      try {
        // refresh balance from provider
        await fetchBalance(address);
        // fetch first page (limit 5) of transactions from backend
        const res = await api.getTransactions(address, 1, 5);
        if (mounted && res && res.transactions) {
          setTransactions(res.transactions);
          setRecentTotal(res.total || res.transactions.length || 0);
        }
      } catch (err) {
        console.warn('Dashboard data load failed', err?.message || err);
      } finally {
        if (mounted) setLoadingTx(false);
      }

      // fetch ETH price + 7d chart
      try {
        const p = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const pj = await p.json();
        if (pj && pj.ethereum && pj.ethereum.usd) setEthPrice(pj.ethereum.usd);

        const chart = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7');
        const chj = await chart.json();
        if (chj && Array.isArray(chj.prices) && chj.prices.length > 1) {
          const first = chj.prices[0][1];
          const last = chj.prices[chj.prices.length-1][1];
          const delta = ((last - first) / first) * 100;
          setEthDelta(delta);
          setChartPrices(chj.prices.map(p => p[1]));
        }
      } catch (e) {
        console.warn('Failed to fetch ETH data', e?.message || e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [address, fetchBalance]);

  // live polling: price every 30s, 7d delta every 5min
  useEffect(() => {
    if (!address) return;
    let mounted = true;
    const pollPrice = async () => {
      try {
        const p = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const pj = await p.json();
        if (mounted && pj && pj.ethereum && pj.ethereum.usd) setEthPrice(pj.ethereum.usd);
      } catch (e) { /* silent */ }
    };
    const pollChart = async () => {
      try {
        const chart = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7');
        const chj = await chart.json();
        if (mounted && chj && Array.isArray(chj.prices) && chj.prices.length > 1) {
          const first = chj.prices[0][1];
          const last = chj.prices[chj.prices.length-1][1];
          const delta = ((last - first) / first) * 100;
          setEthDelta(delta);
          setChartPrices(chj.prices.map(p => p[1]));
        }
      } catch (e) { /* silent */ }
    };
    // immediate
    pollPrice();
    const priceInterval = setInterval(pollPrice, 30 * 1000);
    const chartInterval = setInterval(pollChart, 5 * 60 * 1000);
    // initial chart
    pollChart();
    return () => { mounted = false; clearInterval(priceInterval); clearInterval(chartInterval); };
  }, [address]);

  const portfolioValue = balance ? (Number(balance) * Number(ethPrice)) : 0;
  const pctClass = ethDelta === null ? 'text-slate-400' : (ethDelta >= 0 ? 'text-green-400' : 'text-rose-400');

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <div className="muted">Portfolio & activity</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={() => setShowReceive(true)}>{address ? 'Receive' : 'Receive'}</button>
          <button className="btn-primary" onClick={() => window.open('https://app.uniswap.org/#/swap', '_blank')}>Buy</button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }} className="card p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm muted">Portfolio Value</div>
                <div className="text-2xl font-bold">${portfolioValue ? Number(portfolioValue).toLocaleString(undefined,{maximumFractionDigits:2}) : '0.00'}</div>
              </div>
              <div className="text-sm muted">7d<br/><div className={`font-semibold ${pctClass}`}>{ethDelta===null? '—' : `${ethDelta>=0?'+':''}${Number(ethDelta).toFixed(2)}%`}</div></div>
            </div>
          </motion.div>
          <CryptoChart prices={chartPrices} ethPrice={ethPrice} ethDelta={ethDelta} />
        </div>
        <div>
          <WalletCard />
          <div className="mt-4 flex gap-2">
            <button className="btn-secondary" onClick={() => setShowReceive(true)}>Receive</button>
            <button className="btn-primary" onClick={() => window.open('https://app.uniswap.org', '_blank')}>Buy</button>
            <button className="btn-ghost" onClick={async ()=>{ await fetchBalance(address); }}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="feature-card">Network<br/><div className="mt-2 font-semibold">{network? network.name : 'unknown'}</div></div>
        <div className="feature-card">Address<br/><div className="mt-2 font-semibold">{address? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected'}</div></div>
        <div className="feature-card">ETH Balance<br/><div className="mt-2 font-semibold">{balance? Number(balance).toFixed(5) : '--'}</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="feature-card">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Recent Transactions</div>
            <div className="text-xs muted">{address ? (loadingTx ? 'Loading...' : `${recentTotal} shown`) : 'Connect wallet'}</div>
          </div>
          <div className="space-y-2">
            {address ? (
              loadingTx ? <div className="muted">Loading transactions...</div> : (
                transactions.length ? transactions.map(tx => <TransactionCard key={tx._id||tx.txHash||tx.hash} tx={{hash: tx.txHash||tx.hash||'', from: tx.sender||tx.from||'', to: tx.receiver||tx.to||'', amount: tx.amount||tx.value||'0', time: tx.timestamp? new Date(tx.timestamp).toLocaleString() : '—'}} />) : <div className="muted">No recent transactions</div>
              )
            ) : (
              <div className="muted">Connect your wallet to see transactions</div>
            )}
          </div>
        </div>
        <div className="feature-card">Profile</div>
      </div>

      {showReceive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={()=>setShowReceive(false)}>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-semibold mb-2">Receive ETH</h3>
            <div className="mb-3">Scan or copy your address</div>
            {address ? (
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded"><img alt="qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`} /></div>
                <div>
                  <div className="font-mono text-sm break-all">{address}</div>
                  <div className="mt-2"><button className="btn-primary" onClick={()=>{navigator.clipboard.writeText(address);}}>Copy address</button></div>
                </div>
              </div>
            ) : (
              <div className="muted">Connect a wallet to receive funds</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
