import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

export default function Settings(){
  const { disconnectWallet } = useWallet();
  const [dark, setDark] = useState(true);

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Wallet Settings</h2>
      <div className="card p-4 rounded-xl flex items-center justify-between">
        <div>
          <div className="font-semibold">Dark Mode</div>
          <div className="muted text-sm">Toggle theme</div>
        </div>
        <div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)} />
            <span className="muted">{dark? 'On' : 'Off'}</span>
          </label>
        </div>
      </div>
      <div className="card p-4 rounded-xl">
        <button className="px-4 py-2 bg-rose-600 rounded-md text-white" onClick={disconnectWallet}>Logout</button>
      </div>
    </div>
  );
}
