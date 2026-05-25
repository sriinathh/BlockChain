import React from 'react';

export default function DashboardCard({ title, value, children }) {
  return (
    <div className="bank-card bank-card-sm p-4">
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <div className="text-2xl font-bold mt-2 text-[var(--text-900)]">{value}</div>
      {children}
    </div>
  );
}
