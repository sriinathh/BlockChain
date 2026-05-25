import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiShield } from 'react-icons/fi';

export default function AISection() {
  return (
    <section id="ai" className="py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">AI Banking & Security</h2>
          <p className="text-[var(--muted)] mt-2">Intelligent financial recommendations, automated fraud detection, and underwriting to protect customer assets.</p>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <motion.div whileHover={{ x: 6 }} className="bank-card p-4">
              <div className="font-semibold text-[var(--text-900)]">AI Chat Support</div>
              <div className="text-sm text-[var(--muted)] mt-1">Assist customers with account actions, insights and transaction queries.</div>
            </motion.div>

            <motion.div whileHover={{ x: -6 }} className="bank-card p-4">
              <div className="font-semibold text-[var(--text-900)]">Fraud Detection</div>
              <div className="text-sm text-[var(--muted)] mt-1">Real-time anomaly detection and risk scoring to protect accounts and transfers.</div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ scale: 0.98 }} whileInView={{ scale: 1 }} className="bank-card p-6">
          <div className="text-sm text-[var(--muted)]">AI Assistant</div>
          <div className="mt-4 bg-[var(--bg-100)] rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm text-[var(--text-900)]">Agent: How can I help you optimize your savings this month?</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
