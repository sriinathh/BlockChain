import React from 'react';

export default function TransactionList({ txs = [] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">Recent Transactions</div>
        <div className="text-sm text-[var(--muted)]">Download</div>
      </div>

      <div className="mt-3 space-y-2">
        {txs.map((t, i) => (
          <div key={i} className="bank-card p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--text-900)]">{t.title}</div>
              <div className="text-sm text-[var(--muted)]">{t.to} • {t.date}</div>
            </div>
            <div className={`text-sm ${t.status === 'success' ? 'text-emerald-500' : 'text-[var(--gold)]'}`}>{t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
