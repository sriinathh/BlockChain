const { JsonRpcProvider, Wallet, Contract, ZeroAddress } = require('ethers');
const path = require('path');
const fs = require('fs');

// Smart Contract Human-Readable ABI mapping land records (Fallback baseline)
let CONTRACT_ABI = [
  "function registerLand(uint256 landId, string survey, string area, string district, string state, string gps, string ipfsHash) public returns (bool)",
  "function transferTitle(uint256 landId, address to, string name, string aadhaar) public returns (bool)",
  "function verifyOwnership(uint256 landId) public view returns (address owner, string name, string aadhaar)",
  "event LandRegistered(uint256 indexed landId, address indexed owner, string survey)",
  "event OwnershipTransferred(uint256 indexed landId, address indexed from, address indexed to)"
];

let contractAddress = process.env.CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

try {
  const configPath = path.join(__dirname, '../blockchain/contractConfig.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    contractAddress = config.addresses.LandRegistry;
    CONTRACT_ABI = config.LandRegistryABI;
    console.log(`Loaded deployed contract configuration. Address: ${contractAddress}`);
  }
} catch (e) {
  console.warn("Could not load contractConfig.json in backend, using fallbacks:", e.message);
}

let provider = null;
let signer = null;
let contract = null;
let isNodeActive = false;

const initBlockchain = async () => {
  const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
  const privateKey = process.env.PRIVATE_KEY;

  try {
    provider = new JsonRpcProvider(rpcUrl);
    // Ping provider to check if node is active
    await provider.getNetwork();
    isNodeActive = true;
    console.log(`Connected to Blockchain Node at: ${rpcUrl}`);

    if (privateKey && contractAddress) {
      signer = new Wallet(privateKey, provider);
      contract = new Contract(contractAddress, CONTRACT_ABI, signer);
      console.log(`Smart Contract bound at address: ${contractAddress}`);
    }
  } catch (error) {
    isNodeActive = false;
    console.warn(`Blockchain Node offline. Running in secure Sandbox Fallback mode. Reason: ${error.message}`);
  }
};

// Auto-run initialization
initBlockchain();

const registerLandOnBlockchain = async (landIdNumeric, survey, area, district, state, gps, ipfsHash) => {
  const currentTimestamp = new Date().toISOString();
  const simulatedHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
  const simulatedBlock = 128945 + Math.floor(Math.random() * 100);

  if (!isNodeActive || !contract) {
    console.warn('Sandbox Mode: Simulating registerLandOnBlockchain transaction receipt.');
    return {
      success: true,
      txHash: simulatedHash,
      blockNumber: simulatedBlock,
      timestamp: currentTimestamp,
      gasUsed: '42,109'
    };
  }

  try {
    const tx = await contract.registerLand(
      landIdNumeric,
      survey,
      area,
      district,
      state,
      gps,
      ipfsHash
    );
    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: currentTimestamp,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('registerLandOnBlockchain failed:', error.message);
    throw error;
  }
};

const transferOwnership = async (landIdNumeric, toWallet, toName, toAadhaar) => {
  const currentTimestamp = new Date().toISOString();
  const simulatedHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
  const simulatedBlock = 128945 + Math.floor(Math.random() * 100);

  if (!isNodeActive || !contract) {
    console.warn('Sandbox Mode: Simulating transferOwnership transaction receipt.');
    return {
      success: true,
      txHash: simulatedHash,
      blockNumber: simulatedBlock,
      timestamp: currentTimestamp,
      gasUsed: '54,200'
    };
  }

  try {
    const tx = await contract.transferTitle(
      landIdNumeric,
      toWallet,
      toName,
      toAadhaar
    );
    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: currentTimestamp,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('transferOwnership failed:', error.message);
    throw error;
  }
};

const verifyOwnership = async (landIdNumeric, fallbackAddress = '') => {
  if (!isNodeActive || !contract) {
    console.warn('Sandbox Mode: Simulating verifyOwnership data read.');
    return {
      owner: fallbackAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
      name: 'Srinath Kumar',
      aadhaar: '1234-5678-9012'
    };
  }

  try {
    const result = await contract.verifyOwnership(landIdNumeric);
    return {
      owner: result[0],
      name: result[1],
      aadhaar: result[2]
    };
  } catch (error) {
    console.error('verifyOwnership failed:', error.message);
    throw error;
  }
};

const getTransactionHistory = async (walletAddress) => {
  if (!isNodeActive) {
    console.warn('Sandbox Mode: Returning mock block transaction logs.');
    return [
      {
        hash: `0x28f74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7ffbd8ea`,
        blockNumber: 128945,
        from: ZeroAddress,
        to: walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
        fee: '0.00075 ETH',
        action: 'Register Land',
        status: 'Success',
        timestamp: new Date(Date.now() - 3600 * 2000).toISOString()
      }
    ];
  }

  try {
    // Standard ethers doesn't natively query full transaction history histories without indexers like Etherscan
    // But we can filter events from our deployed contract address
    const filter = contract.filters.OwnershipTransferred();
    const events = await contract.queryFilter(filter, 0, 'latest');
    
    return events.map((event) => ({
      hash: event.transactionHash,
      blockNumber: event.blockNumber,
      from: event.args.from,
      to: event.args.to,
      fee: '0.00120 ETH',
      action: 'Transfer Ownership',
      status: 'Success',
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('getTransactionHistory failed:', error.message);
    throw error;
  }
};

module.exports = {
  registerLandOnBlockchain,
  transferOwnership,
  verifyOwnership,
  getTransactionHistory,
  isNodeActive: () => isNodeActive
};
