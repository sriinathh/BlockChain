import { BrowserProvider, JsonRpcProvider, Wallet } from "ethers";

/**
 * Get Web3 Provider instance.
 * Falls back to Local RPC if MetaMask is not detected.
 */
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  
  // Server-side / Node fallback
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  return new JsonRpcProvider(rpcUrl);
};

/**
 * Get Web3 Signer.
 */
export const getSigner = async () => {
  const provider = getProvider();
  
  if (provider instanceof BrowserProvider) {
    return await provider.getSigner();
  }
  
  // JSON-RPC fallback signer
  if (process.env.PRIVATE_KEY) {
    return new Wallet(process.env.PRIVATE_KEY, provider);
  }
  
  throw new Error("No private key or web3 signer detected.");
};
