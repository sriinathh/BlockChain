import React from 'react';
import Navbar from '../components/Navbar';
import { Shield } from 'lucide-react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-white relative">
      {/* Background Cybernetic Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyber-indigo/5 rounded-full filter blur-[150px] pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-grow z-10">
        {children}
      </main>

      <footer className="z-10 border-t border-white/5 py-12 bg-cyber-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyber-indigo flex items-center justify-center border border-cyber-cyan/20">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-display tracking-widest font-bold text-sm">
              LAND<span className="text-cyber-cyan">CHAIN</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
            National Decentralized Blockchain Registry System. Secured by multi-node authority validator nodes. Optimized for fraud prevention, real-time GIS validation, and cryptographic title security.
          </p>
          <div className="text-[10px] text-gray-600 font-mono mt-4">
            © 2026 LANDCHAIN GOVT REGISTRY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
