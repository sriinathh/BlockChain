import React from 'react';
import { motion } from 'framer-motion';

export default function TransactionCard({tx}){
  const hasMotion = motion && typeof motion.div === 'function';
  if (hasMotion) {
    return (
      <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} whileHover={{ y: -4 }} transition={{duration:0.18}} className="p-4 glass-card rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm">{(tx.hash||'').slice(0,10)}...</div>
            <div className="text-xs text-slate-400">{tx.from} → {tx.to}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{tx.amount} ETH</div>
            <div className="text-xs text-slate-400">{tx.time}</div>
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="p-4 glass-card rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm">{(tx.hash||'').slice(0,10)}...</div>
          <div className="text-xs text-slate-400">{tx.from} → {tx.to}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{tx.amount} ETH</div>
          <div className="text-xs text-slate-400">{tx.time}</div>
        </div>
      </div>
    </div>
  );
}
