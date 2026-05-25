import React from 'react';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bank-card p-4 flex items-center gap-4">
      <div className="text-2xl text-[var(--cyan)]">{icon}</div>
      <div>
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <div className="font-semibold text-lg text-[var(--text-900)]">{value}</div>
      </div>
    </div>
  );
}
