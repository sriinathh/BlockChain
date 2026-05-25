import { ShieldCheck, Database, Award, Milestone } from 'lucide-react';

export const About = () => {
  return (
    <section className="space-y-12 py-6 max-w-5xl mx-auto px-4">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#0A1F44]">About VoteChain</h1>
        <p className="text-sm text-gray-500 mt-1">
          The official digital voting infrastructure for national election services.
        </p>
      </div>

      {/* Intro info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0A1F44]">Our Mandate</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Established under the Digital Governance Act, VoteChain serves as the secure, transparent, and decentralized election processing network. 
            By deploying cutting-edge cryptography and peer-to-peer node verification, the platform ensures that every ballot is cast by a verified citizen, counted accurately, and permanently sealed.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Unlike legacy centralized voting systems, VoteChain distributes transaction audits across multiple state, academic, and independent consensus bodies, eliminating single points of failure.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-[#0A1F44] flex items-center gap-2 border-b border-gray-100 pb-2">
            <Award className="w-5 h-5 text-[#00B4D8]" /> Core Guarantees
          </h3>
          <ul className="space-y-3 text-xs text-gray-600">
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-[#00B4D8] rounded-full mt-1.5 flex-shrink-0" />
              <span><strong>One Citizen, One Vote:</strong> Hardened Aadhaar & biometric facial signature tracking prevents voter impersonation.</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-[#00B4D8] rounded-full mt-1.5 flex-shrink-0" />
              <span><strong>Complete Confidentiality:</strong> Cryptographic hashes hide the link between voter identification details and cast choices.</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-[#00B4D8] rounded-full mt-1.5 flex-shrink-0" />
              <span><strong>End-to-End Verifiability:</strong> Every citizen receives a copyable transaction receipt to query their ballot's block entry.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Blockchain technology summary */}
      <div className="bg-[#0A1F44] text-white p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-[#00B4D8]" />
          <h3 className="text-lg font-bold">Cryptographic Ledger Infrastructure</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
          VoteChain operates on a permissioned Ethereum Virtual Machine (EVM) blockchain structure. Each cast ballot is validated by smart contracts executing consensus audits across decentralized validator nodes. Once mined, the block hashes become immutable—meaning history cannot be rewritten or modified by any centralized authority.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <ShieldCheck className="w-6 h-6 text-[#00B4D8] mx-auto mb-2" />
            <h4 className="font-bold text-xs">Solid-state Audit</h4>
            <p className="text-[10px] text-gray-400 mt-1">Verifiable block hash timeline link</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <Milestone className="w-6 h-6 text-[#00B4D8] mx-auto mb-2" />
            <h4 className="font-bold text-xs">Zero-Trust Keys</h4>
            <p className="text-[10px] text-gray-400 mt-1">Signed by citizen private keys</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <Database className="w-6 h-6 text-[#00B4D8] mx-auto mb-2" />
            <h4 className="font-bold text-xs">Distributed Nodes</h4>
            <p className="text-[10px] text-gray-400 mt-1">Synced consensus network checks</p>
          </div>
        </div>
      </div>
    </section>
  );
};
