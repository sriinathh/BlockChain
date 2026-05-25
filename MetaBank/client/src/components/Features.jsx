import React from 'react';
import FeatureCard from './FeatureCard';
import { SiEthereum, SiZap } from 'react-icons/si';
import { FiCpu, FiSmartphone } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const features = [
  { icon: <SiEthereum />, title: 'Web3 Wallet', desc: 'Secure wallets with one-click connect.' },
  { icon: <FiCpu />, title: 'AI Banking', desc: 'Personalized finance powered by on-chain AI.' },
  { icon: <SiZap />, title: 'DeFi Staking', desc: 'Stake tokens and earn algorithmic yields.' },
  { icon: <FiUser />, title: 'NFT Identity', desc: 'On-chain identity for secure access.' },
  { icon: <FiSmartphone />, title: 'QR Payments', desc: 'Fast on-chain QR payments.' },
  { icon: <SiEthereum />, title: 'Smart Loans', desc: 'AI-underwritten loans and flexible terms.' },
  { icon: <SiEthereum />, title: 'DAO Governance', desc: 'Community-led protocol decisions.' },
  { icon: <SiEthereum />, title: 'Analytics', desc: 'Real-time blockchain insights.' }
];

export default function Features() {
  return (
    <section id="features" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Trusted Banking Features</h2>
          <p className="text-[var(--muted)] mt-2">Core banking features with secure Web3 integrations — accounts, transfers, lending and insights.</p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" whileInView="show" viewport={{ once: true }}>
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
              <FeatureCard icon={f.icon} title={f.title} desc={f.desc} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
