// Mock Data and Local Storage Simulator for LandChain Blockchain

const INITIAL_USERS = [
  {
    aadhaar: "1234-5678-9012",
    name: "Srinath Kumar",
    role: "User",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B",
    email: "srinath@landchain.gov.in",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    isVerified: true
  },
  {
    aadhaar: "0000-0000-0000",
    name: "Dr. Alok Verma",
    role: "Admin",
    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    email: "admin@landchain.gov.in",
    district: "New Delhi",
    state: "Delhi",
    isVerified: true
  }
];

const INITIAL_LANDS = [
  {
    id: "LAND-1092",
    surveyNumber: "204/3A",
    area: "2.4 Acres",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    gps: "12.9716° N, 79.1588° E",
    lat: 12.9716,
    lng: 79.1588,
    boundary: [
      [12.972, 79.158],
      [12.972, 79.160],
      [12.970, 79.160],
      [12.970, 79.158]
    ],
    ownerName: "Srinath Kumar",
    ownerWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B",
    ownerAadhaar: "1234-5678-9012",
    status: "Verified", // Verified, Pending, Rejected
    txHash: "0x28f74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7ffbd8ea",
    blockNumber: 128945,
    timestamp: "2026-05-10T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
    documentName: "Kanchipuram_Patta_204_3A.pdf",
    history: [
      {
        from: "Gen-Zero Contract",
        to: "Srinath Kumar",
        date: "2026-05-10",
        hash: "0x28f74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7ffbd8ea",
        type: "Genesis Registration"
      }
    ]
  },
  {
    id: "LAND-4491",
    surveyNumber: "88/1B",
    area: "1.2 Acres",
    district: "Pune",
    state: "Maharashtra",
    gps: "18.5204° N, 73.8567° E",
    lat: 18.5204,
    lng: 73.8567,
    boundary: [
      [18.521, 73.855],
      [18.521, 73.858],
      [18.519, 73.858],
      [18.519, 73.855]
    ],
    ownerName: "Priya Sharma",
    ownerWallet: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    ownerAadhaar: "8888-9999-0000",
    status: "Verified",
    txHash: "0x12c74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7f9999ab",
    blockNumber: 128912,
    timestamp: "2026-04-18T14:22:00Z",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    documentName: "Pune_SaleDeed_88_1B.pdf",
    history: [
      {
        from: "Gen-Zero Contract",
        to: "Priya Sharma",
        date: "2026-04-18",
        hash: "0x12c74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7f9999ab",
        type: "Genesis Registration"
      }
    ]
  },
  {
    id: "LAND-9902",
    surveyNumber: "45/A",
    area: "0.8 Acres",
    district: "Gurugram",
    state: "Haryana",
    gps: "28.4595° N, 77.0266° E",
    lat: 28.4595,
    lng: 77.0266,
    boundary: [
      [28.460, 77.025],
      [28.460, 77.028],
      [28.458, 77.028],
      [28.458, 77.025]
    ],
    ownerName: "Amit Patel",
    ownerWallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Assigned to Admin for sample
    ownerAadhaar: "0000-0000-0000",
    status: "Verified",
    txHash: "0xfa3e4e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7fa101cc",
    blockNumber: 128880,
    timestamp: "2026-03-30T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600",
    documentName: "Gurgaon_Registry_45_A.pdf",
    history: [
      {
        from: "Gen-Zero Contract",
        to: "Amit Patel",
        date: "2026-03-30",
        hash: "0xfa3e4e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7fa101cc",
        type: "Genesis Registration"
      }
    ]
  },
  {
    id: "LAND-7712",
    surveyNumber: "109/4",
    area: "3.5 Acres",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    gps: "12.9800° N, 79.1620° E",
    lat: 12.9800,
    lng: 79.1620,
    boundary: [
      [12.981, 79.161],
      [12.981, 79.163],
      [12.979, 79.163],
      [12.979, 79.161]
    ],
    ownerName: "Rajesh Kannan",
    ownerWallet: "0x2546BcD3b6a900fa2b585dd299e03d12FA4293AB",
    ownerAadhaar: "4567-8901-2345",
    status: "Pending", // Needs admin approval
    txHash: "0x67ef4e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7fbaee43",
    blockNumber: 128956,
    timestamp: "2026-05-24T18:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
    documentName: "Kanchipuram_TaxReceipt_109.pdf",
    history: [
      {
        from: "Pending Pool",
        to: "Rajesh Kannan",
        date: "2026-05-24",
        hash: "0x67ef4e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7fbaee43",
        type: "Land Verification Request"
      }
    ]
  }
];

const INITIAL_TRANSACTIONS = [
  {
    hash: "0x28f74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7ffbd8ea",
    blockNumber: 128945,
    from: "0x0000000000000000000000000000000000000000",
    to: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B",
    gasUsed: "42,109",
    gasPrice: "18 Gwei",
    fee: "0.00075 ETH",
    action: "Register Land (LAND-1092)",
    status: "Success",
    timestamp: "2026-05-10T10:30:00Z"
  },
  {
    hash: "0x12c74e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7f9999ab",
    blockNumber: 128912,
    from: "0x0000000000000000000000000000000000000000",
    to: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    gasUsed: "41,922",
    gasPrice: "15 Gwei",
    fee: "0.00062 ETH",
    action: "Register Land (LAND-4491)",
    status: "Success",
    timestamp: "2026-04-18T14:22:00Z"
  },
  {
    hash: "0xfa3e4e92a10be357e9301bf5da2c8b09ffbd8e3290dc7c963283281c7fa101cc",
    blockNumber: 128880,
    from: "0x0000000000000000000000000000000000000000",
    to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    gasUsed: "42,000",
    gasPrice: "21 Gwei",
    fee: "0.00088 ETH",
    action: "Register Land (LAND-9902)",
    status: "Success",
    timestamp: "2026-03-30T09:15:00Z"
  }
];

const INITIAL_BLOCKS = [
  {
    height: 128945,
    timestamp: "2026-05-10T10:30:00Z",
    txCount: 1,
    miner: "LandChain Authority Node 3",
    gasUsed: "42,109",
    gasLimit: "15,000,000"
  },
  {
    height: 128912,
    timestamp: "2026-04-18T14:22:00Z",
    txCount: 1,
    miner: "LandChain Authority Node 1",
    gasUsed: "41,922",
    gasLimit: "15,000,000"
  },
  {
    height: 128880,
    timestamp: "2026-03-30T09:15:00Z",
    txCount: 1,
    miner: "LandChain Authority Node 2",
    gasUsed: "42,000",
    gasLimit: "15,000,000"
  }
];

const INITIAL_FRAUD_REPORTS = [
  {
    id: "FRD-201",
    surveyNumber: "109/4",
    landId: "LAND-7712",
    type: "Duplicate Survey Number",
    riskScore: 88,
    description: "The survey boundary overlap detected with property adjacent. System found overlapping GPS coordinates by 12%.",
    evidence: "GPS boundary conflict with survey records in GIS Database",
    status: "Investigating",
    timestamp: "2026-05-24T18:50:00Z"
  },
  {
    id: "FRD-102",
    surveyNumber: "204/3A",
    landId: "LAND-1092",
    type: "Document Tampering Attempt",
    riskScore: 24,
    description: "An offline registry attempt detected using modified timestamp PDF metadata.",
    evidence: "PDF Hash mismatch with Registry Archive metadata",
    status: "Resolved",
    timestamp: "2026-05-11T12:00:00Z"
  }
];

// Helper to initialize local storage
export const initStorage = () => {
  if (!localStorage.getItem("landchain_initialized")) {
    localStorage.setItem("landchain_users", JSON.stringify(INITIAL_USERS));
    localStorage.setItem("landchain_lands", JSON.stringify(INITIAL_LANDS));
    localStorage.setItem("landchain_txs", JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem("landchain_blocks", JSON.stringify(INITIAL_BLOCKS));
    localStorage.setItem("landchain_fraud", JSON.stringify(INITIAL_FRAUD_REPORTS));
    localStorage.setItem("landchain_initialized", "true");
  }
};

// Data retrieval methods
export const getStoredUsers = () => {
  initStorage();
  return JSON.parse(localStorage.getItem("landchain_users"));
};

export const getStoredLands = () => {
  initStorage();
  return JSON.parse(localStorage.getItem("landchain_lands"));
};

export const getStoredTransactions = () => {
  initStorage();
  return JSON.parse(localStorage.getItem("landchain_txs"));
};

export const getStoredBlocks = () => {
  initStorage();
  return JSON.parse(localStorage.getItem("landchain_blocks"));
};

export const getStoredFraudReports = () => {
  initStorage();
  return JSON.parse(localStorage.getItem("landchain_fraud"));
};

// Data Mutation Simulation (Blockchain Transactions)
export const registerNewLand = (landData) => {
  const lands = getStoredLands();
  const txs = getStoredTransactions();
  const blocks = getStoredBlocks();

  const newId = `LAND-${Math.floor(1000 + Math.random() * 9000)}`;
  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
  const blockHeight = blocks[0] ? blocks[0].height + Math.floor(1 + Math.random() * 10) : 130000;
  const currentTimestamp = new Date().toISOString();

  // Create boundary polygon around GPS coords if not supplied
  const lat = parseFloat(landData.lat) || 12.9716;
  const lng = parseFloat(landData.lng) || 79.1588;
  const boundary = landData.boundary || [
    [lat + 0.001, lng - 0.001],
    [lat + 0.001, lng + 0.001],
    [lat - 0.001, lng + 0.001],
    [lat - 0.001, lng - 0.001]
  ];

  const newLand = {
    id: newId,
    surveyNumber: landData.surveyNumber,
    area: `${landData.area} Acres`,
    district: landData.district,
    state: landData.state,
    gps: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
    lat,
    lng,
    boundary,
    ownerName: landData.ownerName,
    ownerWallet: landData.ownerWallet,
    ownerAadhaar: landData.ownerAadhaar,
    status: "Pending", // Needs Admin approval
    txHash,
    blockNumber: blockHeight,
    timestamp: currentTimestamp,
    imageUrl: landData.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
    documentName: landData.documentName || "Scanned_Deed.pdf",
    history: [
      {
        from: "Pending Pool",
        to: landData.ownerName,
        date: currentTimestamp.split("T")[0],
        hash: txHash,
        type: "Land Verification Request"
      }
    ]
  };

  lands.unshift(newLand);
  localStorage.setItem("landchain_lands", JSON.stringify(lands));

  // Add simulated pending block / transaction
  const newTx = {
    hash: txHash,
    blockNumber: blockHeight,
    from: "0x0000000000000000000000000000000000000000",
    to: landData.ownerWallet,
    gasUsed: "43,000",
    gasPrice: "19 Gwei",
    fee: "0.00081 ETH",
    action: `Register Land (${newId})`,
    status: "Success",
    timestamp: currentTimestamp
  };
  txs.unshift(newTx);
  localStorage.setItem("landchain_txs", JSON.stringify(txs));

  // Add block
  const newBlock = {
    height: blockHeight,
    timestamp: currentTimestamp,
    txCount: 1,
    miner: `LandChain Authority Node ${Math.floor(1 + Math.random() * 3)}`,
    gasUsed: "43,000",
    gasLimit: "15,000,000"
  };
  blocks.unshift(newBlock);
  localStorage.setItem("landchain_blocks", JSON.stringify(blocks));

  // If duplicate survey or suspicious coordinates, trigger a fraud report
  const isDuplicate = lands.some(l => l.id !== newId && l.surveyNumber === landData.surveyNumber && l.district === landData.district);
  if (isDuplicate || landData.area > 500) {
    const fraudReports = getStoredFraudReports();
    const newFraud = {
      id: `FRD-${Math.floor(200 + Math.random() * 300)}`,
      surveyNumber: landData.surveyNumber,
      landId: newId,
      type: isDuplicate ? "Duplicate Survey Number" : "Suspicious Land Dimensions",
      riskScore: isDuplicate ? 95 : 65,
      description: isDuplicate 
        ? "System detected multiple registration requests pointing to identical Survey Numbers in this municipal boundary."
        : "Registry request area dimensions exceed local zoning guidelines flag.",
      evidence: "Registry data overlap mismatch check.",
      status: "Investigating",
      timestamp: currentTimestamp
    };
    fraudReports.unshift(newFraud);
    localStorage.setItem("landchain_fraud", JSON.stringify(fraudReports));
  }

  return newLand;
};

// Transfer Ownership Simulation
export const transferLandOwnership = (landId, newOwnerName, newOwnerWallet, newOwnerAadhaar) => {
  const lands = getStoredLands();
  const txs = getStoredTransactions();
  const blocks = getStoredBlocks();

  const landIndex = lands.findIndex(l => l.id === landId);
  if (landIndex === -1) return null;

  const land = lands[landIndex];
  const oldOwnerName = land.ownerName;
  const oldOwnerWallet = land.ownerWallet;

  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
  const blockHeight = blocks[0] ? blocks[0].height + Math.floor(1 + Math.random() * 10) : 130000;
  const currentTimestamp = new Date().toISOString();

  // Update land owner
  land.ownerName = newOwnerName;
  land.ownerWallet = newOwnerWallet;
  land.ownerAadhaar = newOwnerAadhaar;
  land.txHash = txHash;
  land.blockNumber = blockHeight;
  land.timestamp = currentTimestamp;
  
  // Add to land history
  land.history.unshift({
    from: oldOwnerName,
    to: newOwnerName,
    date: currentTimestamp.split("T")[0],
    hash: txHash,
    type: "Transfer Ownership"
  });

  lands[landIndex] = land;
  localStorage.setItem("landchain_lands", JSON.stringify(lands));

  // Create tx log
  const newTx = {
    hash: txHash,
    blockNumber: blockHeight,
    from: oldOwnerWallet,
    to: newOwnerWallet,
    gasUsed: "54,200",
    gasPrice: "24 Gwei",
    fee: "0.00130 ETH",
    action: `Transfer Land (${landId})`,
    status: "Success",
    timestamp: currentTimestamp
  };
  txs.unshift(newTx);
  localStorage.setItem("landchain_txs", JSON.stringify(txs));

  // Add block
  const newBlock = {
    height: blockHeight,
    timestamp: currentTimestamp,
    txCount: 1,
    miner: `LandChain Authority Node ${Math.floor(1 + Math.random() * 3)}`,
    gasUsed: "54,200",
    gasLimit: "15,000,000"
  };
  blocks.unshift(newBlock);
  localStorage.setItem("landchain_blocks", JSON.stringify(blocks));

  return land;
};

// Approve / Reject Land Registration Simulation
export const updateLandStatus = (landId, status) => {
  const lands = getStoredLands();
  const landIndex = lands.findIndex(l => l.id === landId);
  if (landIndex === -1) return null;

  lands[landIndex].status = status;
  
  // Update land history
  const currentTimestamp = new Date().toISOString();
  lands[landIndex].history.unshift({
    from: "Authority Node Admin",
    to: lands[landIndex].ownerName,
    date: currentTimestamp.split("T")[0],
    hash: lands[landIndex].txHash,
    type: `Land Status: ${status}`
  });

  localStorage.setItem("landchain_lands", JSON.stringify(lands));
  return lands[landIndex];
};

// Add simulated user
export const registerMockUser = (userData) => {
  const users = getStoredUsers();
  const newUser = {
    aadhaar: userData.aadhaar,
    name: userData.name,
    role: "User",
    wallet: userData.wallet,
    email: userData.email || `${userData.name.toLowerCase().replace(" ", "")}@landchain.gov.in`,
    district: userData.district || "Kanchipuram",
    state: userData.state || "Tamil Nadu",
    isVerified: true
  };
  users.push(newUser);
  localStorage.setItem("landchain_users", JSON.stringify(users));
  return newUser;
};
