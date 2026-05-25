import React from 'react';
import AnimatedButton from '../components/AnimatedButton';

export default function Landing(){
  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Modern Crypto Wallet
            <span className="ml-2 text-violet-400">Dashboard</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">Connect your wallet, view balances, send crypto, and monitor transactions with smooth animations and a modern UI.</p>
          <div className="mt-6 flex gap-3">
            <AnimatedButton className="bg-violet-600">Get Started</AnimatedButton>
            <AnimatedButton className="bg-white/5">Learn More</AnimatedButton>
          </div>
        </div>
        {/* illustration removed per request */}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold">Secure Storage</h3>
          <p className="text-sm text-slate-400 mt-2">Your keys stay with your wallet provider.</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold">Fast Transactions</h3>
          <p className="text-sm text-slate-400 mt-2">Send and receive crypto with minimal friction.</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-slate-400 mt-2">Charts and reports for tracking portfolio performance.</p>
        </div>
      </section>
    </div>
  );
}
