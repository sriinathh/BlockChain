import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

export default function CTASection() {
  return (
    <section id="cta" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bank-card p-8 text-center">
            <h2 className="text-3xl font-bold">Ready to open an account?</h2>
          <p className="text-[var(--muted)] mt-2">Start with a secure checking account, connect your wallet, and explore AI insights.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <MotionLink to="/signup" whileHover={{ scale: 1.03 }} className="btn-primary">Open Account</MotionLink>
              <MotionLink to="/dashboard" whileHover={{ scale: 1.03 }} className="btn-outline">Launch Banking</MotionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
