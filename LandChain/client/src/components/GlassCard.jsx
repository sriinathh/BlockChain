import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverGlow = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverGlow ? {
        y: -4,
        boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)",
        borderColor: "rgba(6, 182, 212, 0.35)",
      } : {}}
      className={`glass-panel p-6 rounded-2xl transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-20" />
      {children}
    </motion.div>
  );
};

export default GlassCard;
