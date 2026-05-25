import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiEthereum } from 'react-icons/si';

const MotionLink = motion(Link);

export default function Hero() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="text-4xl md:text-5xl font-extrabold leading-tight h1">
            Smarter Banking Powered by AI & Blockchain
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-[var(--muted)] max-w-2xl">
            Modern banking meets blockchain — secure accounts, intelligent financial insights, and seamless transfers powered by AI.
          </motion.p>

          <div className="mt-8 flex items-center gap-4">
            <MotionLink to="/signup" whileHover={{ scale: 1.02 }} className="btn-primary">Open Account</MotionLink>
            <MotionLink to="/dashboard" whileHover={{ scale: 1.02 }} className="btn-outline">Launch Banking</MotionLink>
            <MotionLink to="/wallet" whileHover={{ scale: 1.02 }} className="btn-outline">Connect Wallet</MotionLink>
          </div>

          <div className="mt-8 flex gap-4 items-center">
            <div className="bank-card bank-card-sm flex items-center gap-3">
              <SiEthereum className="text-2xl text-[var(--cyan)]" />
              <div>
                <div className="text-sm text-[var(--muted)]">Total Value Locked</div>
                <div className="font-semibold text-[var(--text-900)]">$1.2B</div>
              </div>
            </div>
            <div className="bank-card bank-card-sm">
              <div className="text-sm text-[var(--muted)]">Active Wallets</div>
              <div className="font-semibold text-[var(--text-900)]">128K+</div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="w-full rounded-2xl p-6 bank-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--muted)]">Checking Account</div>
                <div className="text-lg font-semibold text-[var(--text-900)]">•••• •••• •••• 4242</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--muted)]">Current Balance</div>
                <div className="text-lg font-semibold text-[var(--primary)]">$12,420.50</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-[var(--bg-100)] rounded-md border" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs text-[var(--muted)]">Savings</div>
                <div className="font-semibold text-[var(--text-900)]">$8,300.00</div>
              </div>
              <div className="p-3 bg-[var(--bg-100)] rounded-md border" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs text-[var(--muted)]">Investments</div>
                <div className="font-semibold text-[var(--text-900)]">$4,120.50</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ x: 40 }} animate={{ x: -10 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }} className="absolute -right-8 -top-8 w-40 h-24 rounded-2xl bg-[var(--primary-light)] opacity-10" />
        </div>
      </div>
    </section>
  );
}
