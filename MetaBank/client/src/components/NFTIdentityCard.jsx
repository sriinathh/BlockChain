import React from 'react';

export default function NFTIdentityCard() {
  return (
    <div className="bank-card p-4 text-center">
      <div className="text-sm text-[var(--muted)]">NFT Identity</div>
      <div className="mt-3 p-6 rounded-xl bg-[var(--bg-50)] border" style={{ borderColor: 'var(--border)' }}>Holographic NFT Preview</div>
      <div className="mt-3 text-sm text-[var(--muted)]">Verified Wallet: <span className="font-semibold text-[var(--text-900)]">Yes</span></div>
    </div>
  );
}
