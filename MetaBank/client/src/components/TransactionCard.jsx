import React from 'react';

export default function TransactionCard({ tx }) {
  return (
    <div className="bank-card p-3 flex items-center justify-between">
      <div>
        <div className="font-semibold text-[var(--text-900)]">{tx.amount} {tx.token}</div>
        <div className="text-sm text-[var(--muted)]">{tx.to} • {tx.date}</div>
      </div>
      <div className={`text-sm ${tx.status === 'success' ? 'text-emerald-500' : 'text-[var(--gold)]'}`}>{tx.status}</div>
    </div>
  );
}
