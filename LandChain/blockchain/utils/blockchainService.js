import { Contract } from "ethers";
import { getProvider, getSigner } from "./provider.js";
import { registryAddress, registryABI } from "./contractABI.js";

/**
 * Connect to user's Metamask wallet.
 */
export const connectWallet = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  
  try {
    const provider = getProvider();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    return {
      address: accounts[0],
      signer
    };
  } catch (error) {
    console.error("connectWallet failed:", error.message);
    throw error;
  }
};

/**
 * Get instantiated LandRegistry contract binding with signer.
 */
export const getRegistryContract = async () => {
  const signer = await getSigner();
  return new Contract(registryAddress, registryABI, signer);
};

/**
 * Register Land title on blockchain.
 */
export const registerLand = async (survey, area, district, state, gps, ipfsHash) => {
  try {
    const contract = await getRegistryContract();
    
    // Estimate Gas
    const gasEstimate = await contract.registerLand.estimateGas(
      survey,
      "Citizen Owner",
      district,
      state,
      area,
      gps,
      ipfsHash
    );

    const tx = await contract.registerLand(
      survey,
      "Citizen Owner",
      district,
      state,
      area,
      gps,
      ipfsHash,
      { gasLimit: (gasEstimate * 120n) / 100n } // Add 20% margin
    );
    
    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error("registerLand failed:", error.message);
    throw error;
  }
};

/**
 * Convey ownership title to another wallet.
 */
export const transferOwnership = async (landIdNumeric, toWallet, toName) => {
  try {
    const contract = await getRegistryContract();
    
    const gasEstimate = await contract.transferOwnership.estimateGas(
      landIdNumeric,
      toWallet,
      toName
    );

    const tx = await contract.transferOwnership(
      landIdNumeric,
      toWallet,
      toName,
      { gasLimit: (gasEstimate * 120n) / 100n }
    );
    
    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error("transferOwnership failed:", error.message);
    throw error;
  }
};

/**
 * Fetch detailed metrics for a property directly from the ledger.
 */
export const fetchLandData = async (landIdNumeric) => {
  try {
    const contract = await getRegistryContract();
    const result = await contract.getLandDetails(landIdNumeric);
    
    return {
      landId: result.landId.toString(),
      surveyNumber: result.surveyNumber,
      ownerName: result.ownerName,
      ownerWallet: result.ownerWallet,
      district: result.district,
      state: result.state,
      landArea: result.landArea,
      gpsCoordinates: result.gpsCoordinates,
      ipfsHash: result.ipfsHash,
      registrationDate: new Date(Number(result.registrationDate) * 1000).toISOString(),
      verificationStatus: ["Pending", "Verified", "Rejected"][result.verificationStatus],
      currentOwner: result.currentOwner,
      nftTokenId: result.nftTokenId.toString()
    };
  } catch (error) {
    console.error("fetchLandData failed:", error.message);
    throw error;
  }
};
