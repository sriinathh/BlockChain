import React from 'react';

export default function AIInsightCard({ title, desc }) {
  return (
    <div className="bank-card p-4">
      <div className="font-semibold text-[var(--text-900)]">{title}</div>
      <div className="text-sm text-[var(--muted)] mt-2">{desc}</div>
    </div>
  );
}
