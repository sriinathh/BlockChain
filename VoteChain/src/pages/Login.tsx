import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoteStore } from '../store/useVoteStore';
import { 
  ShieldCheck, User, Fingerprint, Lock, 
  KeyRound, AlertCircle, RefreshCw
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { 
    verifyAadhaar, verifyOTP, verifyFaceScan, 
    authStep, adminLogin
  } = useVoteStore();

  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Biometrics simulation states
  const [biometricScanLog, setBiometricScanLog] = useState('');

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (aadhaarInput.length !== 12 || isNaN(Number(aadhaarInput))) {
      setError('Aadhaar must be exactly 12 numeric digits.');
      return;
    }

    const res = verifyAadhaar(aadhaarInput);
    if (!res.success) {
      setError(res.error || 'Aadhaar validation failed.');
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpInput.length !== 4 || isNaN(Number(otpInput))) {
      setError('OTP passcode must be 4 digits.');
      return;
    }

    const res = verifyOTP(otpInput);
    if (!res.success) {
      setError(res.error || 'Incorrect OTP.');
    }
  };

  const handleFaceScan = async () => {
    setError('');
    setLoading(true);
    setBiometricScanLog('Waking camera device... Binding face-api tracker');
    
    setTimeout(() => {
      setBiometricScanLog('Scanning face grid points (128 landmark markers)...');
    }, 800);

    setTimeout(() => {
      setBiometricScanLog('Checking liveness depth metrics... Spoof threat 0.0%');
    }, 1500);

    const res = await verifyFaceScan();
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Face verification failed.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = adminLogin(adminPassword);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid Admin Credentials.');
    }
  };

  const autofillCitizen = (aadhaar: string) => {
    setAadhaarInput(aadhaar);
    setError('');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-stretch gap-8 min-h-[500px]">
      
      {/* Informational sidebar panel */}
      <div className="w-full md:w-5/12 bg-[#0A1F44] text-white p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00B4D8]">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Federal Security System</span>
          </div>
          <h2 className="text-xl font-bold">Secure Verification Node</h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Citizen authentication uses multi-factor verification linking Aadhaar validation registries with AI liveness face scanners. 
            Digital keys verify identity credentials without saving voter choices.
          </p>
        </div>

        {activeTab === 'citizen' && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-[#00B4D8]">Demo Voter Aadhaar Credentials</h3>
            <div className="space-y-2 text-[10px] text-gray-300 font-mono">
              <button 
                onClick={() => autofillCitizen('123456789012')}
                className="block text-left w-full hover:text-white transition-colors border-b border-white/5 pb-1"
              >
                &gt; Aarushi Sharma (Aadhaar: 123456789012)
              </button>
              <button 
                onClick={() => autofillCitizen('234567890123')}
                className="block text-left w-full hover:text-white transition-colors"
              >
                &gt; Devendra Varma (Aadhaar: 234567890123)
              </button>
            </div>
            <p className="text-[9px] text-gray-400">Default SMS OTP Code: 1234</p>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <h3 className="text-xs font-bold text-[#00B4D8]">Demo Coordinator Access</h3>
            <p className="text-[10px] text-gray-300 font-mono">Password: admin123</p>
          </div>
        )}
      </div>

      {/* Main Form container */}
      <div className="w-full md:w-7/12 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
        
        {/* Toggle headers tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setError('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all ${
              activeTab === 'citizen' ? 'bg-white text-primary border-t-2 border-primary' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Citizen Voting portal
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all ${
              activeTab === 'admin' ? 'bg-white text-primary border-t-2 border-primary' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Coordinator Portal
          </button>
        </div>

        {/* Content boxes */}
        <div className="p-8 flex-grow flex flex-col justify-center">
          
          {error && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'citizen' ? (
            <div className="space-y-6">
              
              {/* Step 1: Aadhaar Form */}
              {authStep === 'aadhaar' || authStep === 'none' ? (
                <form onSubmit={handleAadhaarSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0A1F44]">Citizen Identity Check</h3>
                    <p className="text-xs text-gray-500">Enter your 12-digit Aadhaar ID to authenticate.</p>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarInput}
                      onChange={(e) => setAadhaarInput(e.target.value)}
                      placeholder="e.g. 123456789012"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary text-sm font-semibold transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    Authenticate Aadhaar ID
                  </button>
                </form>
              ) : null}

              {/* Step 2: OTP Entry Form */}
              {authStep === 'otp' ? (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0A1F44]">OTP Security Passcode</h3>
                    <p className="text-xs text-gray-500">Enter the 4-digit code sent to your registered phone number.</p>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 4-digit OTP code"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary text-sm font-semibold text-center tracking-widest transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    Verify Passcode
                  </button>
                </form>
              ) : null}

              {/* Step 3: Biometric Face Scan Simulator */}
              {authStep === 'facescan' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#0A1F44]">AI Biometric Face Scan</h3>
                    <p className="text-xs text-gray-500">Perform facial matching verification checks.</p>
                  </div>

                  {/* Camera scan window simulation box */}
                  <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
                    {loading ? (
                      <div className="absolute inset-0 z-10">
                        {/* Scan Line animation */}
                        <div className="animate-scan-line" />
                        {/* Mock face layout shapes */}
                        <div className="absolute inset-1/4 border-2 border-[#00B4D8] border-dashed rounded-full flex items-center justify-center">
                          <Fingerprint className="w-16 h-16 text-[#00B4D8]/30 animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 space-y-3 z-10 p-6">
                        <Fingerprint className="w-12 h-12 text-[#00B4D8] mx-auto animate-pulse" />
                        <p className="text-xs">Camera device linked. Click verify to start scan verification.</p>
                      </div>
                    )}
                  </div>

                  {loading && (
                    <div className="font-mono text-[10px] text-gray-500 text-center animate-pulse">
                      &gt; {biometricScanLog}
                    </div>
                  )}

                  <button
                    onClick={handleFaceScan}
                    disabled={loading}
                    className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition flex justify-center items-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      'Activate Biometric Scanner'
                    )}
                  </button>
                </div>
              ) : null}

              {authStep === 'authorized' && (
                <div className="text-center p-6 space-y-4">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-lg text-[#0A1F44]">Session Authorized</h3>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="py-2 px-6 bg-[#0A1F44] text-white text-xs font-bold rounded-xl"
                  >
                    Go to Citizen Panel
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Admin Coordinator Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0A1F44]">Coordinator Credentials</h3>
                <p className="text-xs text-gray-500">Provide administrative access security password.</p>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary text-sm font-semibold transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A1F44] hover:bg-[#1C3A63] text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Log In to Command Center
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
};
