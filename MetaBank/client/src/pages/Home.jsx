import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiCpu, FiUserCheck, FiDatabase } from 'react-icons/fi';
import { RiExchangeLine, RiSecurePaymentLine } from 'react-icons/ri';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Floating particles background placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(6,182,212,0.08)_0px,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(at_100%_100%,rgba(2,132,199,0.08)_0px,transparent_50%)] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-900 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 text-xl border border-cyan-500/25">
            M
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">MetaBank</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Open Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Futuristic Decentralized Finance is Here
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
            The Decentralized <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">Enterprise Bank</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl">
            MetaBank bridges traditional fiat banking with secure Web3 blockchain systems, AI fraud anomaly audits, and real-time smart contract interest.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base">
              Get Started <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-outline flex items-center gap-2 text-base border-slate-800">
              Web3 Sign In
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:ml-auto"
        >
          {/* Neon Glow Card */}
          <div className="bank-card w-full max-w-md p-8 bg-slate-900/40 relative z-10 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Enterprise Ledger</div>
                <div className="text-lg font-bold text-white">SYSTEM ONLINE</div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Staking Pool Yield (APY)</div>
                  <div className="text-2xl font-bold text-cyan-400">5.00%</div>
                </div>
                <RiSecurePaymentLine className="text-3xl text-cyan-400 opacity-80" />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Traditional Cash balance</div>
                  <div className="text-2xl font-bold text-white">$12,420.50</div>
                </div>
                <FiTrendingUp className="text-3xl text-sky-400 opacity-80" />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">AI Fraud Check Status</div>
                  <div className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SECURED</div>
                </div>
                <FiShield className="text-3xl text-emerald-400 opacity-80" />
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Core Features Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Full-Stack Blockchain Ecosystem</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience traditional savings combined with Web3 protocols. Built on security, trust, and advanced speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-2xl border border-cyan-500/20 mb-4">
              <FiShield />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Fraud Monitoring</h3>
            <p className="text-slate-400 text-sm">
              Real-time anomaly checks on withdrawals and cash transfers. High-risk actions are automatically held for officer review.
            </p>
          </div>

          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-sky-500/10 flex items-center justify-center text-sky-400 text-2xl border border-sky-500/20 mb-4">
              <RiSecurePaymentLine />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Decentralized Staking</h3>
            <p className="text-slate-400 text-sm">
              Stake your MBT reward tokens directly into the smart contract and claim real-time rewards dynamically.
            </p>
          </div>

          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl border border-indigo-500/20 mb-4">
              <FiCpu />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Loan Underwriting</h3>
            <p className="text-slate-400 text-sm">
              Borrow MBT immediately. Our credit scoring algorithm checks profile data and balances to issue automated loan decisions.
            </p>
          </div>

          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl border border-purple-500/20 mb-4">
              <FiUserCheck />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">NFT Membership Cards</h3>
            <p className="text-slate-400 text-sm">
              Mint custom ERC721 banking cards directly to your wallet. Elite members unlock fee reductions and staking yields.
            </p>
          </div>

          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl border border-emerald-500/20 mb-4">
              <RiExchangeLine />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Exchange</h3>
            <p className="text-slate-400 text-sm">
              Swap cash or ETH directly to MBT. Integrated smart contract reserves execute instant settlement with zero slippage.
            </p>
          </div>

          <div className="bank-card p-6 bg-slate-900/30">
            <div className="w-12 h-12 rounded bg-pink-500/10 flex items-center justify-center text-pink-400 text-2xl border border-pink-500/20 mb-4">
              <FiDatabase />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Explorer & Audit Logs</h3>
            <p className="text-slate-400 text-sm">
              Verify transactions via the built-in blockchain explorer. Download full transaction statement PDFs or export CSV passbooks.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
