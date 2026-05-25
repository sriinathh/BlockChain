import { Link } from 'react-router-dom';
import { useVoteStore } from '../store/useVoteStore';
import { 
  Shield, Database, Cpu, UserCheck, 
  ArrowRight, Key, Globe, Eye, Server
} from 'lucide-react';

export const Home = () => {
  const { citizens, blockchain, currentUser } = useVoteStore();

  const totalCitizens = citizens.length;
  const castVotes = citizens.filter(c => c.hasVoted).length;
  const turnoutPercent = totalCitizens > 0 ? Math.round((castVotes / totalCitizens) * 100) : 0;

  return (
    <section className="space-y-20 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 pt-6">
        {/* Left Call to Action */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-primary">
            <Shield className="w-3.5 h-3.5 text-[#00B4D8]" />
            National Election Commission Official Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A1F44] tracking-tight leading-tight">
            Secure National Digital <br />
            <span className="text-[#00B4D8]">Voting Platform</span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
            VoteChain delivers military-grade blockchain infrastructure for voting at a national scale. 
            Leveraging Aadhaar identity validation, AI anti-spoof biometric checks, and immutable smart contracts, your ballot is cryptographically sealed and permanently audited.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to={currentUser ? "/dashboard" : "/login"}
              className="px-6 py-3 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5"
            >
              {currentUser ? 'Enter Citizen Panel' : 'Vote Now'} 
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explorer"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#0A1F44] border border-gray-300 text-sm font-semibold rounded-xl transition"
            >
              Verify Election Tally
            </Link>
          </div>
        </div>

        {/* Right Animated voting visualization */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-bold text-gray-400">Consensus Validator Pipeline</span>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Simulated Cryptographic Pipeline visual block */}
            <div className="space-y-4 font-mono text-[10px] text-gray-600">
              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-gray-200 flex justify-between items-center">
                <span>&gt; Voter ID Signature verified</span>
                <span className="text-emerald-600 font-bold">100% Matches</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-gray-200 flex justify-between items-center">
                <span>&gt; SHA256 ballot hash payload generated</span>
                <span className="text-blue-600">0x8a92...bf0d</span>
              </div>
              <div className="p-3 bg-[#F8F9FA] rounded-lg border border-gray-200 flex justify-between items-center">
                <span>&gt; distributed consensus broadcast</span>
                <span className="text-amber-600">5/5 Nodes Active</span>
              </div>
            </div>

            {/* Block height summary */}
            <div className="p-4 bg-[#0A1F44] text-white rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Latest Block Mined</span>
                <span className="text-lg font-bold font-mono text-[#00B4D8]">Block #{blockchain.length - 1}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block font-semibold uppercase">Tx Hash Seal</span>
                <span className="text-xs font-mono truncate max-w-[120px] block">
                  {blockchain[blockchain.length - 1]?.hash.substring(0, 16)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. National Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1.5">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Registered Voters</span>
          <span className="text-3xl font-extrabold text-[#0A1F44]">{totalCitizens} Citizens</span>
          <span className="text-[10px] text-emerald-600 font-bold block">100% Aadhaar Verified</span>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1.5">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Total Districts</span>
          <span className="text-3xl font-extrabold text-[#0A1F44]">3 Constituencies</span>
          <span className="text-[10px] text-gray-400 block">Registered districts tally</span>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1.5">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Mined Blocks</span>
          <span className="text-3xl font-extrabold text-[#0A1F44]">#{blockchain.length - 1} Blocks</span>
          <span className="text-[10px] text-blue-600 font-mono block">Zero chain gaps</span>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1.5">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Electoral Turnout</span>
          <span className="text-3xl font-extrabold text-[#0A1F44]">{turnoutPercent}% Cast</span>
          <span className="text-[10px] text-gray-400 block">Calculated live index</span>
        </div>
      </div>

      {/* 3. Key Features */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#0A1F44]">Digital Ballot Security Specs</h2>
          <p className="text-xs text-gray-500">
            Advanced cryptographic and identity verification layers protecting national sovereign voting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-[#00B4D8]" />
            </div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Blockchain Cryptography</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every cast ballot represents a hashed transaction processed via distributed nodes. Once mined, votes are immutable and protected from tampering.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#00B4D8]" />
            </div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Biometric Facial Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Voter sessions authenticate identity match scoring using neural network camera face scans. Spoof attempt checkers drop unauthorized logins.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-[#00B4D8]" />
            </div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Aadhaar Multi-Factor Link</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Identity profiles resolve using the citizen registry database. Every ballot is linked to one verified Aadhaar ID to block double-voting.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Election Workflow */}
      <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-gray-200 space-y-8">
        <h2 className="text-xl font-bold text-[#0A1F44] text-center">Citizen Voter Process</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-white flex items-center justify-center font-bold text-xs mx-auto">1</div>
            <h4 className="font-bold text-xs text-[#0A1F44]">Verify Aadhaar</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[160px] mx-auto">
              Citizen authenticates Aadhaar and verifies eligibility parameters.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-white flex items-center justify-center font-bold text-xs mx-auto">2</div>
            <h4 className="font-bold text-xs text-[#0A1F44]">Verify Biometrics</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[160px] mx-auto">
              Approve SMS OTP checks and perform facial ID matches.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-white flex items-center justify-center font-bold text-xs mx-auto">3</div>
            <h4 className="font-bold text-xs text-[#0A1F44]">Cast Ballot</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[160px] mx-auto">
              Select candidate choice in the secure ballot booth.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-white flex items-center justify-center font-bold text-xs mx-auto">4</div>
            <h4 className="font-bold text-xs text-[#0A1F44]">Auditing Check</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[160px] mx-auto">
              Download QR receipt and query the block on explorer.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-gray-200 pt-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-[10px] font-bold">
            MILITARY-GRADE SECURITY
          </div>
          <h2 className="text-3xl font-extrabold text-[#0A1F44]">Decentralized Electoral Auditing</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            VoteChain operates on a zero-trust model. Smart contracts deployed across EVM node nodes ensure ballot calculations are distributed. Under decentralized governance, no single authority has the power to tamper with the databases.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Consensus node algorithms match transaction histories dynamically. If an adversary attempts to inject tampered ledger data, neighboring peer checks reject the block index automatically.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
            <Key className="w-5 h-5 text-[#00B4D8]" />
            <h4 className="font-bold text-xs text-[#0A1F44]">Asymmetric Keys</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Voter signature hashes are encrypted with unique private keypairs.
            </p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
            <Globe className="w-5 h-5 text-[#00B4D8]" />
            <h4 className="font-bold text-xs text-[#0A1F44]">Consensus Audit</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Nodes sync block hashes continuously to verify chain height integrity.
            </p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
            <Eye className="w-5 h-5 text-[#00B4D8]" />
            <h4 className="font-bold text-xs text-[#0A1F44]">Zero Knowledge Traces</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Voter identifiers map to anonymized hashes protecting secrecy.
            </p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-2">
            <Server className="w-5 h-5 text-[#00B4D8]" />
            <h4 className="font-bold text-xs text-[#0A1F44]">P2P Validator Nodes</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Consensus node verification runs across distributed security structures.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
