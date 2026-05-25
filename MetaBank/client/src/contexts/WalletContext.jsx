import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [mbtBalance, setMbtBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [ethUsd, setEthUsd] = useState(null);

  useEffect(() => {
    const onMbt = (e) => setMbtBalance(e.detail);
    const onEthPrice = (e) => setEthUsd(e.detail);
    window.addEventListener('mbtBalance', onMbt);
    window.addEventListener('ethPrice', onEthPrice);
    return () => {
      window.removeEventListener('mbtBalance', onMbt);
      window.removeEventListener('ethPrice', onEthPrice);
    };
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      p.getSigner && p.getSigner().then(() => {} ).catch(()=>{});
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) throw new Error('No Ethereum provider');
    const p = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = await p.getSigner();
    const addr = await signer.getAddress();

    try {
      // Request nonce from backend
      const nonceRes = await fetch(`/api/auth/nonce?address=${addr}`);
      const nonceData = await nonceRes.json();
      if (!nonceRes.ok) throw new Error(nonceData.message || 'Failed to get nonce');
      const message = `Login nonce:${nonceData.nonce}`;
      const signature = await signer.signMessage(message);

      // Verify signature with backend
      const verifyRes = await fetch(`/api/auth/verify-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, signature })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message || 'Wallet verification failed');
      // Save token
      if (verifyData.token) localStorage.setItem('authToken', verifyData.token);

    } catch (e) {
      console.warn('Wallet auth failed, falling back to basic connect', e);
    }

    setAccount(addr);
    // Try provider balance; if RPC is rate-limited, fallback to server endpoint
    try {
      const bal = await p.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.warn('Provider balance failed, falling back to server /api/wallet/balance', err);
      try {
        const res = await fetch(`/api/wallet/balance/${addr}`);
        const data = await res.json();
        if (res.ok && data.balance) {
          setBalance(data.balance);
        } else if (data.balance) {
          setBalance(data.balance);
        } else {
          setBalance(null);
        }
      } catch (e2) {
        console.warn('Server balance fallback failed', e2);
        setBalance(null);
      }
    }
    // set provider and network
    setProvider(p);
    try {
      const net = await p.getNetwork();
      setNetwork(net?.name || net?.chainId || 'unknown');
    } catch (e) {
      setNetwork('unknown');
    }

    // fetch MBT ERC-20 balance if MBT address provided
    const mbtAddress = process.env.REACT_APP_MBT_ADDRESS;
    if (mbtAddress) fetchTokenBalance(mbtAddress, p, addr).catch((e) => console.warn(e));

    // fetch ETH price for USD total display
    fetchEthPrice().catch(() => {});
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
  };

  const value = { account, balance, connect, disconnect, provider };
  // expose additional values
  const enhanced = { ...value, mbtBalance, network, ethUsd };
  return <WalletContext.Provider value={enhanced}>{children}</WalletContext.Provider>;
}

async function fetchTokenBalance(tokenAddress, providerInstance, walletAddr) {
  try {
    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    const contract = new ethers.Contract(tokenAddress, abi, providerInstance);
    const raw = await contract.balanceOf(walletAddr);
    const decimals = await contract.decimals().catch(() => 18);
    const formatted = Number(ethers.formatUnits(raw, decimals));
    // update via React state - locate the provider to set state
    // since this helper is outside component scope, temporarily set via window event
    const ev = new CustomEvent('mbtBalance', { detail: formatted });
    window.dispatchEvent(ev);
    return formatted;
  } catch (e) {
    console.warn('fetchTokenBalance error', e);
    return null;
  }
}

async function fetchEthPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    const price = data?.ethereum?.usd || null;
    const ev = new CustomEvent('ethPrice', { detail: price });
    window.dispatchEvent(ev);
    return price;
  } catch (e) {
    console.warn('fetchEthPrice error', e);
    return null;
  }
}

export default WalletContext;
