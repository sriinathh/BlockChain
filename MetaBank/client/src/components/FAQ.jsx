import React, { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  { q: 'What is this platform?', a: 'This is an AI-powered decentralized banking ecosystem combining wallets, DeFi, NFTs and governance.' },
  { q: 'How does staking work?', a: 'Users stake MBT tokens to earn rewards and participate in governance.' },
  { q: 'Is MetaMask required?', a: 'You can use MetaMask or WalletConnect; hardware wallets are supported.' },
  { q: 'How secure is the platform?', a: 'Security is enforced with on-chain audits, AI monitoring and industry best practices.' },
  { q: 'What is MBT token?', a: 'MBT is the native governance and utility token for the platform.' }
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} className="bank-card p-4" onClick={() => setOpen(open === i ? null : i)} whileHover={{ scale: 1.01 }}>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-[var(--text-900)]">{f.q}</div>
                <div className="text-[var(--muted)]">{open === i ? '−' : '+'}</div>
              </div>
              {open === i && <div className="mt-3 text-[var(--muted)]">{f.a}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
