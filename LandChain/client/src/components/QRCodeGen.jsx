import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';

const QRCodeGen = ({ value, size = 160 }) => {
  // Use public QR Code generator API with customizable cyan color styling to match our theme
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=06b6d4&bgcolor=0a0f1d&data=${encodeURIComponent(value)}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-cyber-dark/80 rounded-2xl border border-cyber-cyan/20">
      <div className="relative group p-2 bg-cyber-dark rounded-xl">
        {/* Border glow */}
        <div className="absolute inset-0 bg-cyber-cyan/15 rounded-xl filter blur-md scale-95 group-hover:scale-105 transition-all duration-300 pointer-events-none" />
        <img
          src={qrUrl}
          alt="Blockchain Certificate QR"
          width={size}
          height={size}
          className="relative z-10 rounded-lg border border-cyber-cyan/10"
          loading="lazy"
        />
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-cyber-cyan/80 font-mono tracking-wider uppercase font-semibold">
        <ShieldCheck size={14} className="animate-pulse" />
        SECURE METRIC VERIFIED
      </div>
    </div>
  );
};

export default QRCodeGen;
