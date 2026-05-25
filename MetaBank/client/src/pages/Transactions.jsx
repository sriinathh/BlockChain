import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';

const sampleTx = [
  { title: 'Payment to Alice', amount: '-$120.00', to: 'Alice', date: '2026-05-01', status: 'success' },
  { title: 'Coffee Shop', amount: '-$5.50', to: 'Cafe', date: '2026-05-02', status: 'success' },
  { title: 'Salary', amount: '+$4,200.00', to: 'Employer', date: '2026-04-28', status: 'success' }
];

export default function Transactions() {
  const [query, setQuery] = useState('');
  const filtered = sampleTx.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.toLowerCase?.includes?.(query));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions" className="p-2 border rounded" />
      </div>
      <p className="text-[var(--muted)] mt-2">Download statements, filter by category and export CSV.</p>
      <div className="mt-6">
        <TransactionList txs={filtered} />
      </div>
    </div>
  );
}
