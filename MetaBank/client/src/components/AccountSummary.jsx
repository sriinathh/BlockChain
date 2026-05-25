import React from 'react';

export default function AccountSummary({ accounts = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {accounts.map((acc, i) => (
        <div key={i} className="bank-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--muted)]">{acc.type}</div>
              <div className="font-semibold text-[var(--text-900)] mt-1">{acc.number}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--muted)]">Balance</div>
              <div className="text-lg font-bold text-[var(--primary)]">{acc.balance}</div>
            </div>
          </div>
          {acc.footer && <div className="mt-3 text-sm text-[var(--muted)]">{acc.footer}</div>}
        </div>
      ))}
    </div>
  );
}
