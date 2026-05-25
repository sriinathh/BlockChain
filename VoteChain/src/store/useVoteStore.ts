import { create } from 'zustand';

export interface Transaction {
  txHash: string;
  voterHash: string;
  candidateId: string;
  constituency: string;
  timestamp: number;
  signature: string;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string; // Lucide icon identifier
  constituency: string;
  voteCount: number;
}

export interface Citizen {
  id: string;
  name: string;
  aadhaar: string;
  constituency: string;
  walletAddress: string;
  hasVoted: boolean;
  ballotHash: string | null;
  faceDataHash: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: number;
  alertType: 'Duplicate Ballot' | 'SQL Injection Trace' | 'Multi-Session Node Conflict' | 'Consensus Override';
  voterId: string;
  constituency: string;
  severity: 'low' | 'medium' | 'high';
  status: 'Intercepted' | 'Quarantined';
}

export interface LogMessage {
  id: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface VoteState {
  // System State
  electionState: 'not_started' | 'active' | 'completed';
  electionTitle: string;
  startDate: string;
  endDate: string;
  constituencies: string[];
  candidates: Candidate[];
  citizens: Citizen[];
  blockchain: Block[];
  logs: LogMessage[];
  threats: ThreatAlert[];
  
  // Active User session states
  currentUser: Citizen | null;
  isAdmin: boolean;
  authStep: 'aadhaar' | 'otp' | 'facescan' | 'authorized' | 'none';
  sessionToken: string | null;

  // Smart Contract States
  contractAddress: string;
  gasCounter: number;
  activeNodesCount: number;
  blockDifficultyTarget: string;

  // Actions
  verifyAadhaar: (aadhaarNum: string) => { success: boolean; error?: string };
  verifyOTP: (otpCode: string) => { success: boolean; error?: string };
  verifyFaceScan: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  adminLogin: (password: string) => { success: boolean; error?: string };
  
  castSecureVote: (candidateId: string) => Promise<{ success: boolean; txHash?: string }>;
  addNewCandidate: (name: string, party: string, symbol: string, constituency: string) => void;
  addNewConstituency: (name: string) => void;
  createElectionConfig: (title: string, start: string, end: string) => void;
  toggleElectionState: (state: 'not_started' | 'active' | 'completed') => void;
  
  simulateIntrusionAttack: (type: 'double_vote' | 'merkle_alter') => { success: boolean; message: string };
  resetSystemState: () => void;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  clearLogs: () => void;
}

// Cryptographic hash generators
const sha256 = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const absHash = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = "a2f901bdc890a823efb9821cb9a8f2780ebd46bc9fa2810a9c8d76e2f4a1329c";
  return (absHash + salt).substring(0, 64);
};

const INITIAL_CITIZENS: Citizen[] = [
  { id: '1', name: 'Aarushi Sharma', aadhaar: '123456789012', constituency: 'District A', walletAddress: '0x9E780E2144bFecb9d031a28efb908bd1d03A89f0', hasVoted: false, ballotHash: null, faceDataHash: 'face_sharma_98a72' },
  { id: '2', name: 'Devendra Varma', aadhaar: '234567890123', constituency: 'District B', walletAddress: '0x1C4A5173bCD76E2f4a3E28e1c63b65fa3a48e7e1', hasVoted: false, ballotHash: null, faceDataHash: 'face_varma_38b21' },
  { id: '3', name: 'Ishita Sen', aadhaar: '345678901234', constituency: 'District A', walletAddress: '0x4e6F7bC50aDDEc82E394decf3bA78e2B491295bf', hasVoted: false, ballotHash: null, faceDataHash: 'face_sen_45a19' },
  { id: '4', name: 'Kabir Mehta', aadhaar: '456789012345', constituency: 'District C', walletAddress: '0xBD89c31A2fC44E89de9024f2bE4e18d617e92Bcf', hasVoted: false, ballotHash: null, faceDataHash: 'face_mehta_19e28' },
  { id: '5', name: 'Nisha Pillai', aadhaar: '567890123456', constituency: 'District B', walletAddress: '0x3F6E2aC98de7d5Bcfc41829eBDE8b171D7ea92cf', hasVoted: false, ballotHash: null, faceDataHash: 'face_pillai_27a92' },
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Dr. Aarav Patel', party: 'Democratic Citizens Party', symbol: 'Sun', constituency: 'District A', voteCount: 0 },
  { id: '2', name: 'Meera Krishnan', party: 'National Progress Alliance', symbol: 'Sparkles', constituency: 'District B', voteCount: 0 },
  { id: '3', name: 'Vikram Singh', party: 'Green Liberty Coalition', symbol: 'Leaf', constituency: 'District A', voteCount: 0 },
  { id: '4', name: 'Sanya Iyer', party: 'Digital Vanguard Party', symbol: 'Cpu', constituency: 'District B', voteCount: 0 },
];

const GENESIS_BLOCK: Block = {
  index: 0,
  timestamp: 1779951600000, // May 2026
  transactions: [],
  previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
  hash: "0000bf98c56e3ef8109d311fa8bb241c098df65c8ea10e42d76f8bd64821a8d0",
  nonce: 489
};

const INITIAL_LOGS = [
  { id: '1', timestamp: Date.now(), type: 'info' as const, message: 'Federal Digital Governance node link online.' },
  { id: '2', timestamp: Date.now() + 20, type: 'success' as const, message: 'VoterRegistry.sol (0x9E20...F98d) compiled and bound to local consensus.' },
  { id: '3', timestamp: Date.now() + 40, type: 'success' as const, message: 'ElectionManager.sol & Voting.sol contracts deployed successfully.' }
];

export const useVoteStore = create<VoteState>((set, get) => ({
  // Core System parameters
  electionState: 'active',
  electionTitle: 'National Digital Assembly Election 2026',
  startDate: '2026-05-25T08:00',
  endDate: '2026-05-28T20:00',
  constituencies: ['District A', 'District B', 'District C'],
  candidates: INITIAL_CANDIDATES,
  citizens: INITIAL_CITIZENS,
  blockchain: [GENESIS_BLOCK],
  logs: INITIAL_LOGS,
  threats: [],

  // User session state variables
  currentUser: null,
  isAdmin: false,
  authStep: 'none',
  sessionToken: null,

  // Blockchain properties
  contractAddress: '0x9E20bF31c3bDe9024f2bE4e18d617e92Bcf98F8d',
  gasCounter: 1489020,
  activeNodesCount: 5,
  blockDifficultyTarget: '00',

  addLog: (message, type = 'info') => {
    set(state => ({
      logs: [
        ...state.logs,
        { id: Math.random().toString(), timestamp: Date.now(), type, message }
      ].slice(-100)
    }));
  },

  clearLogs: () => set({ logs: [] }),

  // Citizen Authentication Pipeline
  verifyAadhaar: (aadhaarNum) => {
    const matched = get().citizens.find(c => c.aadhaar === aadhaarNum);
    if (!matched) {
      get().addLog(`Auth Alert: Identity search failed for Aadhaar ${aadhaarNum}`, 'error');
      return { success: false, error: 'Aadhaar ID not found in Federal Citizen Registry.' };
    }
    
    // Progress authorization state
    set({ 
      currentUser: matched,
      authStep: 'otp'
    });
    get().addLog(`Auth Service: Identity verified for ${matched.name}. SMS OTP broadcasted.`, 'info');
    return { success: true };
  },

  verifyOTP: (otpCode) => {
    const { currentUser } = get();
    if (!currentUser) return { success: false, error: 'Session expired.' };

    if (otpCode !== '1234') {
      get().addLog(`Auth Alert: Incorrect OTP passcode entered for ${currentUser.name}`, 'warning');
      return { success: false, error: 'Incorrect OTP authentication code.' };
    }

    set({ authStep: 'facescan' });
    get().addLog(`Auth Service: OTP matched. Fingerprint & Face recognition locks loaded.`, 'success');
    return { success: true };
  },

  verifyFaceScan: async () => {
    const { currentUser } = get();
    if (!currentUser) return { success: false, error: 'Session expired.' };

    // Simulate model load and verification latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    set({ 
      authStep: 'authorized',
      sessionToken: `JWT_SESSION_${sha256(currentUser.id + Date.now()).substring(0, 24)}`
    });

    get().addLog(`Biometrics Service: AI matching verification score 99.4%. Spoof threat 0.0%`, 'success');
    get().addLog(`Auth Service: Digital ballot box key bound to wallet ${currentUser.walletAddress}`, 'info');

    return { success: true };
  },

  logout: () => {
    const user = get().currentUser;
    if (user) {
      get().addLog(`Session logged out: ${user.name}`, 'info');
    } else if (get().isAdmin) {
      get().addLog(`Coordinator session logged out.`, 'info');
    }
    set({
      currentUser: null,
      isAdmin: false,
      authStep: 'none',
      sessionToken: null
    });
  },

  adminLogin: (password) => {
    if (password === 'admin123') {
      set({ 
        isAdmin: true, 
        currentUser: null,
        sessionToken: `JWT_ADMIN_SESSION_${Date.now()}`
      });
      get().addLog(`Coordinator session activated. Keypair authorizations approved.`, 'warning');
      return { success: true };
    }
    return { success: false, error: 'Invalid coordinator administrative password.' };
  },

  // Secure Cryptographic Vote Casting
  castSecureVote: async (candidateId) => {
    const { currentUser, citizens, blockchain, electionState } = get();
    if (electionState !== 'active' || !currentUser) {
      return { success: false };
    }

    const citizenIndex = citizens.findIndex(c => c.id === currentUser.id);
    if (citizenIndex === -1 || citizens[citizenIndex].hasVoted) {
      get().addLog(`Threat detected: Block cast rejected. Double-vote trace identified for ${currentUser.id}`, 'error');
      return { success: false };
    }

    const citizen = citizens[citizenIndex];
    const timestamp = Date.now();
    const voterHash = sha256(citizen.aadhaar);
    const txHash = sha256(voterHash + candidateId + timestamp);
    const signature = `SIG_POS_${sha256(citizen.walletAddress + txHash).substring(0, 16).toUpperCase()}`;

    const newTx: Transaction = {
      txHash,
      voterHash,
      candidateId,
      constituency: citizen.constituency,
      timestamp,
      signature
    };

    get().addLog(`Tx Broker: Broadcasted transaction to 5 validator nodes...`, 'info');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mine Block (Proof of work target loop)
    const prevBlock = blockchain[blockchain.length - 1];
    const previousHash = prevBlock.hash;
    const index = blockchain.length;
    let nonce = 0;
    let hash = "";
    
    // Simulate mining nonce loop
    while (nonce < 1500) {
      nonce += Math.floor(Math.random() * 5) + 1;
      hash = sha256(index + previousHash + nonce + JSON.stringify(newTx));
      if (hash.startsWith(get().blockDifficultyTarget)) {
        break;
      }
    }
    if (!hash.startsWith(get().blockDifficultyTarget)) {
      hash = get().blockDifficultyTarget + hash.substring(get().blockDifficultyTarget.length);
    }

    const newBlock: Block = {
      index,
      timestamp,
      transactions: [newTx],
      previousHash,
      hash,
      nonce
    };

    // Update system counts
    const updatedCitizens = [...citizens];
    updatedCitizens[citizenIndex] = {
      ...citizen,
      hasVoted: true,
      ballotHash: txHash
    };

    const updatedCandidates = get().candidates.map(c => 
      c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
    );

    const simulatedGas = 62000 + Math.floor(Math.random() * 8000);

    set(state => ({
      citizens: updatedCitizens,
      blockchain: [...state.blockchain, newBlock],
      candidates: updatedCandidates,
      currentUser: updatedCitizens[citizenIndex],
      gasCounter: state.gasCounter + simulatedGas
    }));

    get().addLog(`Consensus Node: Block #${index} validated. Hash: ${hash.substring(0, 24)}...`, 'success');
    get().addLog(`Ledger Ledger: Smart contract locked vote choice in constituency ${citizen.constituency}. Gas: ${simulatedGas}`, 'success');

    return { success: true, txHash };
  },

  // Setup options
  addNewCandidate: (name, party, symbol, constituency) => {
    const newCand: Candidate = {
      id: (get().candidates.length + 1).toString(),
      name,
      party,
      symbol,
      constituency,
      voteCount: 0
    };
    set(state => ({
      candidates: [...state.candidates, newCand]
    }));
    get().addLog(`Admin Console: Candidate ${name} registered for ${party} in ${constituency}`, 'info');
  },

  addNewConstituency: (name) => {
    if (get().constituencies.includes(name)) return;
    set(state => ({
      constituencies: [...state.constituencies, name]
    }));
    get().addLog(`Admin Console: constituency ${name} setup successfully.`, 'info');
  },

  createElectionConfig: (title, start, end) => {
    set({
      electionTitle: title,
      startDate: start,
      endDate: end
    });
    get().addLog(`Admin Console: Election parameters configured. Title: ${title}`, 'warning');
  },

  toggleElectionState: (state) => {
    set({ electionState: state });
    get().addLog(`Admin Console: Election lifecycle state updated to ${state.toUpperCase()}`, 'warning');
  },

  // Cyber attack threat simulations
  simulateIntrusionAttack: (type) => {
    const timestamp = Date.now();
    const id = Math.random().toString();

    if (type === 'double_vote') {
      const votedVoter = get().citizens.find(c => c.hasVoted);
      const name = votedVoter ? votedVoter.name : 'Voter V-101';
      const voterId = votedVoter ? votedVoter.id : 'V-101';

      get().addLog(`INTRUSION ALERT: Consensus Node 3 caught transaction with matching ID hash signature.`, 'error');
      get().addLog(`Defense Audit: UTXO ledger history confirms vote already cast for citizen.`, 'error');
      get().addLog(`Intrusion Rejected: Vote blocked. Threat quarantined.`, 'success');

      const alert: ThreatAlert = {
        id,
        timestamp,
        alertType: 'Duplicate Ballot',
        voterId,
        constituency: votedVoter ? votedVoter.constituency : 'District A',
        severity: 'high',
        status: 'Intercepted'
      };

      set(state => ({
        threats: [...state.threats, alert]
      }));

      return {
        success: true,
        message: `Consensus defense quarantined double-vote attempt by ${name}.`
      };
    } else {
      // Merkle Root alteration
      get().addLog(`INTRUSION ALERT: Altered hash sequence detected on Consensus Node #4.`, 'error');
      get().addLog(`Defense Audit: Node #4 hash compared against peer consensus hashes. Verification failed.`, 'error');
      get().addLog(`Recovery Action: Syncing blockchain history from nodes 1-3. Node #4 self-healed.`, 'success');

      const alert: ThreatAlert = {
        id,
        timestamp,
        alertType: 'Consensus Override',
        voterId: 'NODE-04',
        constituency: 'Network Node',
        severity: 'high',
        status: 'Quarantined'
      };

      set(state => ({
        threats: [...state.threats, alert]
      }));

      return {
        success: true,
        message: `Ledger tampered sequence detected. Consensus peers automatically resolved block hash indices.`
      };
    }
  },

  resetSystemState: () => {
    set({
      candidates: INITIAL_CANDIDATES.map(c => ({ ...c, voteCount: 0 })),
      citizens: INITIAL_CITIZENS.map(c => ({ ...c, hasVoted: false, ballotHash: null })),
      blockchain: [GENESIS_BLOCK],
      logs: INITIAL_LOGS,
      threats: [],
      currentUser: null,
      isAdmin: false,
      authStep: 'none',
      sessionToken: null,
      gasCounter: 1489020
    });
  },
}));
