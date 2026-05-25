import React from 'react';
import { motion } from 'framer-motion';

const items = [
  { quarter: 'Q1', title: 'Wallet System' },
  { quarter: 'Q2', title: 'Staking & Loans' },
  { quarter: 'Q3', title: 'AI Banking' },
  { quarter: 'Q4', title: 'DAO Governance' }
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Product Roadmap</h2>
        <p className="text-[var(--muted)] mt-2">Planned milestones towards enterprise-grade banking features.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <motion.div key={idx} whileHover={{ y: -6 }} className="bank-card text-center p-6">
              <div className="text-sm text-[var(--muted)]">{it.quarter}</div>
              <div className="font-semibold text-[var(--text-900)] mt-2">{it.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
