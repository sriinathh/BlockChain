import React from 'react';
import { motion } from 'framer-motion';

function Stat({ label, value }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="bank-card text-center">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="text-2xl font-bold mt-2 text-[var(--text-900)]">{value}</div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat label="Total Transactions" value="12.4M" />
          <Stat label="Active Wallets" value="128K+" />
          <Stat label="TVL" value="$1.2B" />
          <Stat label="AI Security Rate" value="99.98%" />
        </div>
      </div>
    </section>
  );
}
