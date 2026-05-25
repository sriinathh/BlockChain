import { useState } from 'react';
import { useVoteStore } from '../store/useVoteStore';
import { 
  ShieldCheck, Vote, 
  Copy, Check, AlertTriangle, Lock, 
  CheckCircle, Shield, QrCode 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export const CitizenDashboard = () => {
  const { currentUser, candidates, castSecureVote, blockchain, electionState } = useVoteStore();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [castStep, setCastStep] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center space-y-6">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-primary">Identity Not Verified</h2>
        <p className="text-xs text-gray-500">
          Access to the citizen voting booth requires active multi-factor biometric authentication. Please login first.
        </p>
        <Link
          to="/login"
          className="inline-block w-full py-2.5 px-4 bg-primary hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          Authenticate Citizen Identity
        </Link>
      </div>
    );
  }

  // Find candidate choice and voting block receipt
  const voterBlock = blockchain.find(b => 
    b.transactions.some(t => t.txHash === currentUser.ballotHash)
  );
  const voterTx = voterBlock?.transactions.find(t => t.txHash === currentUser.ballotHash);
  const choiceCandidate = candidates.find(c => c.id === voterTx?.candidateId);

  // Filter candidates mapped to citizen's district
  const localCandidates = candidates.filter(c => c.constituency === currentUser.constituency);

  const handleVoteSubmit = async () => {
    if (!selectedCandidateId) return;
    setShowConfirmModal(false);
    setIsCasting(true);
    setCastStep(0);

    // Cryptographic step progressions
    setTimeout(() => setCastStep(1), 1200); // Sign with keys
    setTimeout(() => setCastStep(2), 2400); // Broadcast nodes
    setTimeout(() => setCastStep(3), 3800); // Calculate block proof
    
    setTimeout(async () => {
      await castSecureVote(selectedCandidateId);
      setIsCasting(false);
      setCastStep(0);
      setSelectedCandidateId(null);
    }, 5500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Dashboard headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A1F44]">Citizen Voting Panel</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Sovereign digital identity session secured under wallet: <span className="font-mono text-secondary font-bold">{currentUser.walletAddress}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-emerald-600">Verification Match: Biometrics Validated</span>
        </div>
      </div>

      {/* Citizen profile info grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#0A1F44] border-b border-gray-100 pb-2">Voter Profile Details</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">FullName:</span>
              <span className="font-bold text-primary">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Aadhaar ID Tally:</span>
              <span className="font-mono text-primary">XXXX-XXXX-{currentUser.aadhaar.substring(8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Constituency:</span>
              <span className="font-bold text-primary">{currentUser.constituency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Biometrics match:</span>
              <span className="text-[#00B4D8] font-bold">AI verified (face-api)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-400">Voting Status:</span>
              <span className={`font-bold ${currentUser.hasVoted ? 'text-emerald-600' : 'text-yellow-600 animate-pulse'}`}>
                {currentUser.hasVoted ? 'Ballot Cast' : 'Awaiting Ballot'}
              </span>
            </div>
          </div>
        </div>

        {/* Voting Portal or Receipt panel */}
        <div className="col-span-1 md:col-span-2">
          
          {currentUser.hasVoted ? (
            /* Secure Digital Receipt details */
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 p-6">
              
              {/* Receipt text details */}
              <div className="flex-grow space-y-4">
                <h3 className="font-bold text-sm text-[#0A1F44] flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Cryptographic Vote Sealed
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-400 block font-sans">Block Height</span>
                    <span className="font-bold text-primary">#{voterBlock?.index}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-sans">Verification Nonce</span>
                    <span className="font-bold text-primary">{voterBlock?.nonce}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-gray-400 block font-sans">Vote Cast Choice Tally</span>
                    <span className="font-bold text-secondary font-sans">
                      {choiceCandidate ? `${choiceCandidate.name} (${choiceCandidate.party})` : 'System Mined Tally'}
                    </span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500 font-semibold font-sans">Transaction Hash Seal</span>
                      <button
                        onClick={() => handleCopy(currentUser.ballotHash || '')}
                        className="text-[#00B4D8] hover:text-[#0A1F44] text-[10px] flex items-center gap-1 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <span className="text-[10px] break-all">{currentUser.ballotHash}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3 text-xs font-sans">
                  <Link
                    to="/explorer"
                    className="py-2 px-4 border border-gray-300 text-primary font-bold rounded-lg hover:bg-gray-50 transition"
                  >
                    Query Blockchain
                  </Link>
                  <Link
                    to="/results"
                    className="py-2 px-4 bg-[#0A1F44] hover:bg-[#1C3A63] text-white font-bold rounded-lg transition"
                  >
                    View Live Tallies
                  </Link>
                </div>
              </div>

              {/* QR Code widget */}
              <div className="w-full md:w-44 flex-shrink-0 bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <QrCode className="w-24 h-24 text-primary" />
                </div>
                <span className="text-[9px] font-mono text-gray-400">QR Audit Code</span>
                <span className="text-[9px] text-[#00B4D8] font-bold">SHA256 authenticated</span>
              </div>

            </div>
          ) : (
            /* Voting Booth booth selection grid */
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#0A1F44] flex items-center gap-1.5">
                  <Vote className="w-5 h-5 text-accent" /> Active Ballot Register ({currentUser.constituency})
                </h3>
                <p className="text-[10px] text-gray-500">
                  Your choice is cryptographically secured. Select one candidate to lock your vote.
                </p>
              </div>

              {electionState !== 'active' ? (
                <div className="p-6 bg-yellow-50 text-yellow-800 rounded-xl text-center text-xs space-y-2 border border-yellow-100">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto" />
                  <h4 className="font-bold">Electoral Ballot is Closed</h4>
                  <p>The coordinator has either not activated the timeline or closed ballot boxes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Candidates lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {localCandidates.map(candidate => {
                      const isSelected = selectedCandidateId === candidate.id;
                      return (
                        <div
                          key={candidate.id}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-50/50 border-primary ring-1 ring-primary' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide block">{candidate.party}</span>
                              <h4 className="font-bold text-xs text-[#0A1F44] mt-0.5">{candidate.name}</h4>
                            </div>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-primary bg-primary text-white text-[8px] font-bold' : 'border-gray-300'
                            }`}>
                              {isSelected && '✓'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      disabled={!selectedCandidateId}
                      onClick={() => setShowConfirmModal(true)}
                      className={`py-2 px-6 text-xs font-bold rounded-xl shadow-sm transition ${
                        selectedCandidateId 
                          ? 'bg-primary hover:bg-[#1C3A63] text-white cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Cast Ballot Choice
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-sm w-full p-6 space-y-5">
            <h3 className="font-bold text-base text-[#0A1F44] flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-amber-600" /> Confirm Electoral Choice
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              You are casting your digital vote for the selected candidate. This action publishes a transaction hash to the smart contract ledger and is immutable.
            </p>
            <div className="flex gap-3 text-xs pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-primary font-bold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVoteSubmit}
                className="flex-1 py-2 px-4 bg-primary hover:bg-[#1C3A63] text-white font-bold rounded-lg transition"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mining cryptograhic Pipeline loader */}
      <AnimatePresence>
        {isCasting && (
          <div className="fixed inset-0 bg-[#0A1F44]/95 flex flex-col items-center justify-center p-4 z-50 text-white select-none">
            <div className="max-w-md w-full space-y-8 text-center">
              
              <div className="relative h-20 flex justify-center items-center">
                <div className="flex gap-12 justify-between items-center w-full max-w-xs relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${castStep >= 0 ? 'bg-[#00B4D8] border-[#00B4D8] text-primary' : 'border-gray-600 text-gray-500'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${castStep >= 1 ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-600 text-gray-500'}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${castStep >= 2 ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-600 text-gray-500'}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-40 mx-auto h-[2px] bg-slate-800 -z-0 flex">
                  <div className={`h-full bg-[#00B4D8] transition-all duration-[1200ms] ${castStep >= 1 ? 'w-1/2' : 'w-0'}`} />
                  <div className={`h-full bg-emerald-500 transition-all duration-[1400ms] ${castStep >= 2 ? 'w-1/2' : 'w-0'}`} />
                </div>
              </div>

              <div className="space-y-3 font-sans">
                {castStep === 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#00B4D8]">Encrypting Ballot Payload</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Localized public EVM key encryption...</p>
                  </div>
                )}
                {castStep === 1 && (
                  <div>
                    <h3 className="text-lg font-bold text-indigo-400">Signing with Wallet Keypair</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Generating POS signature blocks...</p>
                  </div>
                )}
                {castStep === 2 && (
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">Validating Distributed Consensus</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Verifying identity status registries...</p>
                  </div>
                )}
                {castStep === 3 && (
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400">Mining On-Chain Block Tally</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-1 animate-pulse">Computing hash nonce criteria...</p>
                  </div>
                )}
              </div>

              {/* Logs */}
              <div className="p-4 rounded-xl terminal-body border border-slate-800 text-left text-[9px] max-h-28 overflow-y-auto space-y-1 scrollbar-thin">
                <div>&gt; Initializing EVM transaction broker...</div>
                {castStep >= 0 && <div>&gt; Encryption block generated. Public key: 0x9E20...F8d</div>}
                {castStep >= 1 && <div className="text-indigo-400">&gt; Signature locked. Wallet: {currentUser.walletAddress.substring(0, 16)}...</div>}
                {castStep >= 2 && <div className="text-emerald-400">&gt; Distributed peers resolved registration check.</div>}
                {castStep >= 3 && <div className="text-yellow-400 animate-pulse">&gt; Calculating Proof of Work blocks nonce criteria...</div>}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
