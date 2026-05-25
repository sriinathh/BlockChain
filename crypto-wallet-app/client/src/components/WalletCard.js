import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { FiCopy } from 'react-icons/fi';
import SafeIcon from './SafeIcon';

export default function WalletCard(){
  const { address, balance, copyAddress } = useWallet();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copyAddress && copyAddress();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className="card p-4 rounded-xl w-full">
      <div className="flex items-center gap-4">
        <div className="profile-avatar mr-3" />
        <div className="flex-1">
          <div className="text-sm muted">Wallet</div>
          <div className="text-lg font-semibold">{address? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs muted">Balance</div>
          <div className="text-xl font-bold">{balance? Number(balance).toFixed(5) : '--'} ETH</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {address && (
          <div className="bg-white p-2 rounded">
            <QRCode value={address} size={72} bgColor="white" fgColor="#6b5ce9" />
          </div>
        )}
        {!address && (
          <div className="w-20 h-20 rounded bg-white/3 flex items-center justify-center text-xs muted">QR</div>
        )}
        <button className="ml-auto btn-primary" onClick={handleCopy}><SafeIcon Icon={FiCopy} size={16} /> {copied? 'Copied' : ''}</button>
      </div>
    </motion.div>
  );
}
