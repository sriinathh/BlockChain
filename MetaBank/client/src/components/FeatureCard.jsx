import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} className="bank-card hover:shadow-card transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-2xl text-[var(--primary)]">{icon}</div>
        <div>
          <div className="font-semibold text-[var(--text-900)]">{title}</div>
          <div className="text-sm text-[var(--muted)] mt-1">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}
