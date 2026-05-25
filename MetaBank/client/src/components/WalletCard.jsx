import React from 'react';
import { FiCopy } from 'react-icons/fi';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useWallet } from '../contexts/WalletContext';

export default function WalletCard() {
  const { account, balance, mbtBalance } = useWallet();
  const addr = account || '0x4b3...F3a9';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(addr);
      alert('Address copied');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="bank-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[var(--muted)]">Wallet</div>
          <div className="font-semibold text-[var(--text-900)]">{addr}</div>
        </div>
        <button onClick={copy} className="btn-outline"><FiCopy /></button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-[var(--bg-100)] rounded-md border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-sm text-[var(--muted)]">ETH</div>
          <div className="font-semibold text-[var(--text-900)]">{balance ? `${Number(balance).toFixed(4)} ETH` : '—'}</div>
        </div>
        <div className="p-3 bg-[var(--bg-100)] rounded-md border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-sm text-[var(--muted)]">MBT</div>
          <div className="font-semibold text-[var(--text-900)]">{mbtBalance ? `${Number(mbtBalance).toLocaleString()} MBT` : '—'}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-[var(--bg-50)] border" style={{ borderColor: 'var(--border)' }}>
            {typeof window !== 'undefined' ? (
              <QRCode value={addr} size={80} bgColor={'#ffffff'} fgColor={getComputedStyle(document.documentElement).getPropertyValue('--enterprise-accent').trim() || '#005BAC'} />
            ) : (
              <QRCode value={addr} size={80} bgColor={'#ffffff'} fgColor={'#005BAC'} />
            )}
          </div>
        <div className="flex-1 space-y-2">
          <button className="btn-primary w-full">Send</button>
          <button className="btn-outline w-full">Receive</button>
        </div>
      </div>
    </div>
  );
}
