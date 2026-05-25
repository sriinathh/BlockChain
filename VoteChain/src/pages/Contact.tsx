import { Phone, Mail, HelpCircle, ShieldAlert } from 'lucide-react';

export const Contact = () => {
  return (
    <section className="space-y-12 py-6 max-w-5xl mx-auto px-4">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#0A1F44]">Support & Incident Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Reach the National Election Commission technical coordination desks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Support channels list */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#0A1F44]">Help Desk Channels</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            If you encounter verification failure, Aadhaar lookup match errors, or node sync timeout during ballot cast, reach out to our active technical operators.
          </p>

          <div className="space-y-4 text-xs text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Toll-Free Helpline</span>
                <span className="font-bold">1800-419-2026 (24/7 Active)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Technical Desk Email</span>
                <span className="font-bold font-mono">support@votechain.gov.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Electoral Coordinator Office</span>
                <span className="font-bold">Central Election Commission, Block-G, Secretariat Complex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security threat reports */}
        <div className="bg-red-50/50 p-8 rounded-2xl border border-red-100 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> Cyber Threat Audit Center
            </h2>
            <p className="text-xs text-red-800 leading-relaxed">
              To report system penetration indicators, suspicious transaction hashes, node validation overrides, or malicious vote coercion setups, submit an encrypted report directly to the security unit.
            </p>
            <p className="text-xs text-red-700 font-mono">
              Fingerprint signature hash: SHA256/sec_report_unit_98012e
            </p>
          </div>

          <button className="w-full mt-4 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-sm transition">
            File Secure Cyber Incident Report
          </button>
        </div>

      </div>
    </section>
  );
};
