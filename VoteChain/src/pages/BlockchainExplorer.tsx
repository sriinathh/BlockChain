import { useState } from 'react';
import { useVoteStore } from '../store/useVoteStore';
import type { Transaction } from '../store/useVoteStore';
import { 
  Database, Clock, HardDrive, 
  Search, ShieldCheck, HelpCircle, FileText, AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BlockchainExplorer = () => {
  const { blockchain, candidates, contractAddress, gasCounter, activeNodesCount } = useVoteStore();
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(blockchain.length - 1);
  const [searchTxHash, setSearchTxHash] = useState('');
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    tx?: Transaction;
    blockIndex?: number;
    searched: boolean;
  }>({ found: false, searched: false });

  // Index protection on reset
  const activeIndex = selectedBlockIndex >= blockchain.length ? blockchain.length - 1 : selectedBlockIndex;
  const selectedBlock = blockchain[activeIndex] || blockchain[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTxHash.trim()) return;

    let foundTx: Transaction | undefined;
    let foundBlockIndex = -1;

    for (const block of blockchain) {
      const tx = block.transactions.find(t => t.txHash === searchTxHash.trim());
      if (tx) {
        foundTx = tx;
        foundBlockIndex = block.index;
        break;
      }
    }

    if (foundTx) {
      setSearchResult({
        found: true,
        tx: foundTx,
        blockIndex: foundBlockIndex,
        searched: true
      });
      setSelectedBlockIndex(foundBlockIndex);
    } else {
      setSearchResult({
        found: false,
        searched: true
      });
    }
  };

  const getCandidateName = (id: string) => {
    const candidate = candidates.find(c => c.id === id);
    return candidate ? `${candidate.name} (${candidate.party})` : 'Unknown Candidate';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-[#00B4D8]" />
            <h1 className="text-3xl font-extrabold text-[#0A1F44]">Federal Blockchain Auditor</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Query the smart contract state variables, verify block heights, and verify ballot transaction signatures.
          </p>
        </div>
        
        {/* Smart Contract Info badge */}
        <div className="text-xs font-mono bg-white border border-gray-200 p-2.5 rounded-lg text-right">
          <span className="text-gray-400 block text-[9px] font-sans">Active Contract Address</span>
          <span className="text-primary font-bold">{contractAddress}</span>
        </div>
      </div>

      {/* Contract stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-gray-400 text-[10px] block font-semibold uppercase">Total Cumulative Gas</span>
          <span className="text-xl font-bold text-[#0A1F44] font-mono">{gasCounter.toLocaleString()} gas</span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-gray-400 text-[10px] block font-semibold uppercase">Decentralized Validators</span>
          <span className="text-xl font-bold text-[#0A1F44] font-mono">{activeNodesCount} Active Nodes</span>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-gray-400 text-[10px] block font-semibold uppercase">Block Target Nonce difficulty</span>
          <span className="text-xl font-bold text-emerald-600 font-mono">"00" Hash Target</span>
        </div>
      </div>

      {/* Verification Audit search tool */}
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <h2 className="text-base font-bold text-[#0A1F44] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verify Ballot Integrity
          </h2>
          <p className="text-xs text-gray-500">
            Paste a copy of your Ballot ID / TxHash signature receipt to confirm consensus verification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTxHash}
                onChange={(e) => setSearchTxHash(e.target.value)}
                placeholder="Enter Transaction Hash (TxHash)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary text-xs font-semibold font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition flex-shrink-0"
            >
              Verify Ballot
            </button>
          </div>
        </form>

        {/* Verification Alert result */}
        {searchResult.searched && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-gray-100 pt-6"
          >
            {searchResult.found && searchResult.tx ? (
              <div className="p-5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm">Ballot Audit Completed: VALID & IMMUTABLE</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-500 block font-sans">Ledger Block Height</span>
                    <span className="font-bold text-primary">#{searchResult.blockIndex}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-sans">Constituency Origin</span>
                    <span className="font-bold text-primary">{searchResult.tx.constituency}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-sans">Ballot Tally Choice</span>
                    <span className="font-bold text-secondary font-sans">{getCandidateName(searchResult.tx.candidateId)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-sans">Mined At</span>
                    <span className="font-bold text-primary font-sans">{new Date(searchResult.tx.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs border-t border-emerald-100 pt-3 font-mono space-y-2">
                  <div>
                    <span className="text-gray-500 block font-sans">Voter Signature proof</span>
                    <span className="text-emerald-700 break-all select-all font-bold">{searchResult.tx.signature}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-sans">Consensus Hash Seal</span>
                    <span className="text-[#0A1F44] break-all select-all font-bold">{searchResult.tx.txHash}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm">Ballot Audit Failed: Hash Not Mined</h3>
                  <p className="text-xs text-red-700 mt-1">
                    The entered transaction hash was not found on the active ledger. Make sure the ballot has been successfully cast.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Main timeline explorer splits */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Blocks chain timeline list */}
        <div className="w-full lg:w-2/5 space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-secondary" /> Blocks Chain timeline ({blockchain.length})
          </h2>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {blockchain.slice().reverse().map((block) => {
              const isActive = selectedBlock?.index === block.index;
              return (
                <div
                  key={block.index}
                  onClick={() => setSelectedBlockIndex(block.index)}
                  className={`p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                    isActive ? 'border-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold font-mono text-secondary">Block Height: #{block.index}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">Hash Seal:</span>
                      <span className="text-primary truncate max-w-[180px]">{block.hash}</span>
                    </div>
                    <div className="flex justify-between font-sans">
                      <span className="text-gray-400">Ballots Tally count:</span>
                      <span className="font-bold text-primary">
                        {block.index === 0 ? 'Genesis (Hardcoded)' : `${block.transactions.length} vote cast`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Block details audits */}
        <div className="w-full lg:w-3/5">
          {selectedBlock ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
              
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-[#0A1F44]">Block Tally Details</h3>
                  <p className="text-xs text-gray-400">Index height: #{selectedBlock.index}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-gray-400 block uppercase font-semibold text-[9px]">Proof Nonce</span>
                  <span className="font-mono font-bold text-accent">{selectedBlock.nonce}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-[9px] text-gray-400 block font-sans uppercase">Current Block Hash</span>
                  <span className="text-primary font-bold break-all">{selectedBlock.hash}</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-[9px] text-gray-400 block font-sans uppercase">Previous Block Hash</span>
                  <span className="text-secondary break-all">{selectedBlock.previousHash}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#0A1F44] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-secondary" /> Mined Transactions list
                </h4>
                
                {selectedBlock.transactions.length === 0 ? (
                  <div className="p-6 bg-[#F8F9FA] rounded-xl text-center text-xs text-gray-400 border border-gray-200">
                    <span className="font-bold block text-primary mb-1">Genesis Block Zero</span>
                    <span>No votes. Hardcoded genesis state to boot network.</span>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-xs">
                    {selectedBlock.transactions.map((tx, idx) => (
                      <div key={idx} className="p-4 bg-blue-50/20 border border-blue-100 rounded-xl space-y-3">
                        <div className="flex justify-between border-b border-blue-50 pb-2">
                          <span className="text-[10px] text-secondary font-sans font-bold">TRANSACTION #{idx + 1}</span>
                          <span className="text-[9px] text-gray-400 font-sans">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-400 block font-sans text-[9px]">Voter ID Hash (Anonymized)</span>
                            <span className="text-primary truncate block">{tx.voterHash}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-sans text-[9px]">Constituency District</span>
                            <span className="text-primary font-sans block">{tx.constituency}</span>
                          </div>
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-gray-400 block font-sans text-[9px]">Ballot choiceRecorded</span>
                            <span className="text-secondary font-sans block font-bold">{getCandidateName(tx.candidateId)}</span>
                          </div>
                        </div>

                        <div className="border-t border-blue-50 pt-2 font-mono">
                          <span className="text-gray-400 block font-sans text-[9px]">Validator POS Signature</span>
                          <span className="text-accent break-all">{tx.signature}</span>
                        </div>

                        <div className="pt-1">
                          <span className="text-gray-400 block font-sans text-[9px]">Transaction Hash Payload</span>
                          <span className="text-primary break-all select-all font-bold">{tx.txHash}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <HelpCircle className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-xs">Select a block index to audit transactions list.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
