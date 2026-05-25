import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import BlockchainParticle from '../components/BlockchainParticle';
import {
  Cpu,
  Map,
  Layers,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  TrendingUp,
  Users,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  const stats = [
    { label: "Total Properties Registered", count: "12,894", icon: Database, color: "text-cyber-cyan" },
    { label: "On-Chain Verified Records", count: "99.98%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Active Portal Registrants", count: "4,500+", icon: Users, color: "text-indigo-400" },
    { label: "Smart Contract Transactions", count: "89,451", icon: TrendingUp, color: "text-amber-400" },
  ];

  const features = [
    {
      title: "Smart Contracts Automation",
      desc: "Instant peer-to-peer property transfers without intermediary escrow delay or offline tampering risks.",
      icon: Cpu
    },
    {
      title: "GIS Sat Mapping & Polygons",
      desc: "Live coordinate boundaries plotted automatically in real time using official municipal survey layers.",
      icon: Map
    },
    {
      title: "Fractional NFT Asset Cards",
      desc: "Every plot of verified land maps directly to a unique non-fungible on-chain digital title deed token.",
      icon: Layers
    },
    {
      title: "AI Overlap Fraud Engine",
      desc: "Real-time verification flags duplicate deeds or suspicious boundary adjustments before verification.",
      icon: ShieldCheck
    },
    {
      title: "QR Certificate Verification",
      desc: "Verify legal land registry papers instantaneously anywhere by scanning cryptographic QR codes.",
      icon: QrCode
    },
    {
      title: "Consensus Node Security",
      desc: "Multi-party consensus ensures data integrity. No single agency or administrator can alter history.",
      icon: Lock
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 md:px-8 overflow-hidden bg-cyber-dark">
      {/* Background active particles */}
      <BlockchainParticle count={25} />

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center mt-6 md:mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          GOVERNMENT OF INDIA • BLOCKCHAIN LAND REGISTRY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-6"
        >
          Secure Land Registration <br />
          Using <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-indigo bg-clip-text text-transparent">Blockchain</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed mb-10"
        >
          Eliminate deed tampering, double registrations, and land grabbing. LandChain leverages decentralized smart contracts to deliver transparent, cryptographically secured property ownership.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center px-4"
        >
          <Link
            to={currentUser ? "/register-land" : "/login"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            Register Land
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/explorer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-cyber-cyan/30 bg-cyber-blue-light/30 text-gray-300 hover:text-white rounded-xl transition-all"
          >
            Explore Blockchain
          </Link>
        </motion.div>
      </div>

      {/* Animated Stats Cards Grid */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mb-24">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={idx} delay={idx * 0.1}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-cyber-dark border border-white/5 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-2xl font-bold tracking-tight font-mono">{stat.count}</span>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-snug">{stat.label}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-6xl w-full px-4 mb-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-display uppercase tracking-widest text-white mb-4">
            SYSTEM CAPABILITIES
          </h2>
          <div className="w-16 h-1 bg-cyber-cyan mx-auto rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={idx} delay={idx * 0.05} className="group">
                <div className="w-12 h-12 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/20 flex items-center justify-center mb-6 text-cyber-cyan transition-all duration-300 group-hover:bg-cyber-cyan/20 group-hover:scale-105 group-hover:border-cyber-cyan/40">
                  <Icon size={22} className="group-hover:rotate-6 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display uppercase tracking-wider">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
