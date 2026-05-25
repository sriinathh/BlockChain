import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  { text: 'This platform made DeFi approachable and secure.', name: 'Alice' },
  { text: 'AI assistant helped optimize my staking strategy.', name: 'Bob' },
  { text: 'Beautiful UI and fast transactions.', name: 'Carol' }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Trusted by customers</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="bank-card p-6">
              <div className="text-lg text-[var(--text-900)]">“{r.text}”</div>
              <div className="text-sm text-[var(--muted)] mt-4">— {r.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
