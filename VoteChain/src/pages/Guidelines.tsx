import { Shield, CheckSquare } from 'lucide-react';

export const Guidelines = () => {
  return (
    <section className="space-y-12 py-6 max-w-5xl mx-auto px-4">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#0A1F44]">Voting Guidelines & Protocol</h1>
        <p className="text-sm text-gray-500 mt-1">
          Detailed procedural specifications for casting a ballot on the decentralized ledger.
        </p>
      </div>

      {/* Step by step */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#0A1F44]">Verification & Voting Sequence</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Aadhaar Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your 12-digit national Aadhaar ID number. The system validates registration eligibility against active constituency databases.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-sm text-[#0A1F44]">OTP Security</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter the 4-digit SMS OTP passcode sent to your registered biometric mobile device to approve keypair authorization.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Face Identification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Perform a quick face scan to run AI anti-spoof matches against registered federal biometric database models.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">4</div>
            <h3 className="font-bold text-sm text-[#0A1F44]">Lock & Cast</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Select your candidate, review details, and sign the ballot transaction to permanently anchor it to block ledgers.
            </p>
          </div>
        </div>
      </div>

      {/* Rules callout box */}
      <div className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-200 space-y-4">
        <h3 className="font-bold text-[#0A1F44] flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" /> Administrative Regulations & Security Terms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <p className="flex gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Finality:</strong> Block transactions are immutable. Once signed by your private key, your vote choice cannot be updated or cancelled.</span>
            </p>
            <p className="flex gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Double-Voting Defense:</strong> The ledger validates citizen UTXO signatures. Tries to cast double-votes are logged as cyber threats.</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Biometric Verification:</strong> Real-time anti-spoof filters inspect frame depth. Tampered biometric files will invalidate login checks.</span>
            </p>
            <p className="flex gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Auditable Receipts:</strong> Download and copy your ballot's transaction receipt. Enter the ID on the explorer to confirm node inclusion.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
