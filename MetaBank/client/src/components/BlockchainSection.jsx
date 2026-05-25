import React from 'react';
import { SiEthereum, SiPolygon, SiSolana, SiBinance } from 'react-icons/si';
import { motion } from 'framer-motion';

const chains = [
  { icon: <SiEthereum />, name: 'Ethereum' },
  { icon: <SiPolygon />, name: 'Polygon' },
  { icon: <SiSolana />, name: 'Solana' },
  { icon: <SiBinance />, name: 'BNB Chain' }
];

export default function BlockchainSection() {
  return (
    <section id="chains" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Supported Networks</h2>
        <p className="text-[var(--muted)] mt-2">Enterprise-ready multi-network support for secure transfers and settlements.</p>

        <div className="mt-6 flex flex-wrap gap-4">
          {chains.map((c, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="bank-card flex items-center gap-3 px-4 py-3">
              <div className="text-2xl text-[var(--primary)]">{c.icon}</div>
              <div className="font-semibold text-[var(--text-900)]">{c.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
