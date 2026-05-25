import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import AnimatedButton from '../components/AnimatedButton';
import Loader from '../components/Loader';

export default function Send(){
  const { sendTransaction } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      setSending(true);
      await sendTransaction({ to, value: amount });
    }catch(err){
      console.error(err);
    }finally{setSending(false)}
  };

  return (
    <div className="card p-6 rounded-xl max-w-xl">
      <h3 className="text-lg font-semibold">Send Crypto</h3>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="form-input" placeholder="Receiver address" value={to} onChange={e=>setTo(e.target.value)} />
        <input className="form-input" placeholder="Amount (ETH)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <div className="flex items-center justify-between">
          <div className="text-sm muted">Gas fee estimate: <span className="font-semibold">0.00021 ETH</span></div>
          <AnimatedButton className="btn-primary" onClick={onSubmit}>{sending? <Loader/> : 'Send'}</AnimatedButton>
        </div>
      </form>
    </div>
  );
}
