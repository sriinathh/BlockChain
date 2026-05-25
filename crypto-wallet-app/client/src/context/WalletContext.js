import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { BrowserProvider, formatEther, parseEther } from 'ethers';
import { toast } from 'react-toastify';
import * as api from '../services/api';

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Define all functions BEFORE useEffect so they're available to be called
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setBalance(null);
    setNetwork(null);
    localStorage.removeItem('wallet:autoReconnect');
    toast.info('Wallet disconnected');
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');
      setConnecting(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const p = new BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      const bal = await p.getBalance(addr);
      const net = await p.getNetwork();
      setProvider(p);
      setSigner(s);
      setAddress(addr);
      setBalance(formatEther(bal));
      setNetwork(net);
      localStorage.setItem('wallet:autoReconnect','true');
      // If user is authenticated, save wallet on backend
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          api.setAuthToken(token);
          await api.walletConnect(addr);
        }
      } catch (err) {
        console.warn('Could not save wallet to backend', err?.message || err);
      }
      toast.success('Wallet connected');
      return { addr, bal };
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Connection failed');
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success('Copied address');
  };

  const fetchBalance = async (addr = address) => {
    if (!provider || !addr) return;
    try {
      const bal = await provider.getBalance(addr);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error(err);
    }
  };

  const sendTransaction = async ({ to, value, gasLimit }) => {
    if (!signer) throw new Error('No signer');
    const tx = {
      to,
      value: typeof value === 'string' ? parseEther(String(value)) : value,
      gasLimit
    };
    const res = await signer.sendTransaction(tx);
    toast.info('Transaction sent');
    return res;
  };

  // Now useEffect can safely call connectWallet
  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
        return;
      }
      setAddress(accounts[0]);
      try {
        if (provider) {
          const bal = await provider.getBalance(accounts[0]);
          setBalance(formatEther(bal));
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleChainChanged = async () => {
      try {
        if (provider) {
          const net = await provider.getNetwork();
          setNetwork(net);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    const _auto = localStorage.getItem('wallet:autoReconnect');
    if (_auto === 'true') connectWallet().catch(()=>{});

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ provider, signer, address, balance, network, connectWallet, disconnectWallet, fetchBalance, copyAddress, sendTransaction, connecting }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
