import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TransactionCard from '../components/TransactionCard';
import AnimatedButton from '../components/AnimatedButton';
import { useWallet } from '../context/WalletContext';
import * as api from '../services/api';

export default function Transactions(){
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(async (p = 1) => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await api.getTransactions(address, p, pageSize);
      if (res && res.transactions) {
        // append if loading later pages
        setTransactions(prev => (p === 1 ? res.transactions : prev.concat(res.transactions)));
        setTotal(res.total || 0);
        setPage(res.page || p);
      }
    } catch (e) { console.warn('Failed to load transactions', e); }
    finally { setLoading(false); }
  }, [address, pageSize]);

  useEffect(() => {
    if (!address) return;
    // reset and load first page
    setTransactions([]);
    setPage(1);
    setTotal(0);
    let mounted = true;
    (async () => { if (mounted) await loadPage(1); })();
    return () => { mounted = false; };
  }, [address, loadPage]);

  const listVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <input className="form-input w-64" placeholder="Search tx hash or address" />
      </div>
      <div className="grid gap-3">
        {address ? (
          loading ? <div className="muted">Loading transactions...</div> : (
            transactions.length ? (
              <motion.div initial="hidden" animate="show" variants={listVariants} className="space-y-2">
                {transactions.map(tx => (
                  <motion.div key={tx._id||tx.txHash||tx.hash} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:0.18}}>
                    <TransactionCard tx={{hash: tx.txHash||tx.hash||'', from: tx.sender||tx.from||'', to: tx.receiver||tx.to||'', amount: tx.amount||tx.value||'0', time: tx.timestamp? new Date(tx.timestamp).toLocaleString() : '—'}} />
                  </motion.div>
                ))}
              </motion.div>
            ) : <div className="muted">No transactions found</div>
          )
        ) : (
          <div className="muted">Connect your wallet to view transactions</div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          <AnimatedButton className="" onClick={() => {
            const next = page + 1;
            if (transactions.length < total) loadPage(next);
          }} disabled={transactions.length >= total}>{transactions.length>=total? 'All loaded' : 'Load more'}</AnimatedButton>
          <AnimatedButton onClick={() => { if (transactions.length){
            // export visible transactions CSV
            const rows = transactions.map(t => ({hash: t.txHash||t.hash||'', from: t.sender||t.from||'', to: t.receiver||t.to||'', amount: t.amount||t.value||'', time: t.timestamp||''}));
            const csv = [Object.keys(rows[0]).join(',')].concat(rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))).join('\n');
            const blob = new Blob([csv], {type:'text/csv'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click(); URL.revokeObjectURL(url);
          }}}>Export CSV</AnimatedButton>
        </div>
      </div>
    </div>
  );
}
