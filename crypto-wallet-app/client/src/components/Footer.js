import React from 'react';

export default function Footer(){
  return (
    <footer className="w-full mt-8 p-6 text-sm text-slate-400">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>© {new Date().getFullYear()} Crypto Wallet App</div>
        <div>Crypto Wallet· React · Tailwind · Ethers</div>
      </div>
    </footer>
  );
}
