import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import { ocrImage } from '../utils/ocr';
import { FiUser, FiMail, FiLock, FiCreditCard, FiCamera, FiUpload, FiCheckCircle, FiAlertCircle, FiCpu } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', aadharNumber: '' });
  const [file, setFile] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [error, setError] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [ocrMatch, setOcrMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      if (file) fd.append('aadharImage', file);
      if (ocrText) fd.append('aadharOcr', ocrText);

      const res = await fetch('/api/auth/register', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Registration failed');
      
      localStorage.setItem('authToken', data.token);
      if (data.user && data.user.aadharVerified === false) {
        alert('KYC verification is pending manual review. Account created successfully.');
      }
      navigate('/dashboard');
    } catch (err) { 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  const runOcr = async (file) => {
    setOcrLoading(true);
    try {
      setOcrText('');
      setOcrMatch(null);
      const text = await ocrImage(file);
      const digits = (text || '').replace(/\D/g, '');
      setOcrText(digits);
      if (form.aadharNumber) {
        setOcrMatch(digits.includes(form.aadharNumber.replace(/\D/g, '')));
      }
    } catch (e) {
      console.error('OCR error', e);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(6,182,212,0.06)_0px,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(at_100%_100%,rgba(2,132,199,0.06)_0px,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-2xl space-y-6 my-10">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-cyan-500/10 items-center justify-center font-bold text-cyan-400 text-2xl border border-cyan-500/25 mb-4">
            M
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Establish your digital KYC identity at MetaBank.</p>
        </div>

        <div className="bank-card p-6 md:p-8 bg-slate-900/40 border-slate-800">
          <form onSubmit={submit} className="space-y-6">
            
            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiUser /></span>
                  <input name="fullName" placeholder="John Doe" value={form.fullName} onChange={onChange} className="glass-input pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiUser /></span>
                  <input name="username" placeholder="johndoe" value={form.username} onChange={onChange} className="glass-input pl-10" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiMail /></span>
                  <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={onChange} className="glass-input pl-10" required autoComplete="email" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiLock /></span>
                  <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} className="glass-input pl-10" required autoComplete="new-password" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase">Aadhar ID Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiCreditCard /></span>
                <input name="aadharNumber" placeholder="12-digit number" value={form.aadharNumber} onChange={onChange} className="glass-input pl-10" required />
              </div>
            </div>

            {/* Document upload / camera integration */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">KYC Document Scanner</h4>
                  <p className="text-xs text-slate-500">Provide an Aadhar photo to verify your ledger eligibility.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setUseCamera(false)} 
                    className={`px-3 py-1.5 rounded text-xs font-semibold border ${!useCamera ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'border-slate-800 text-slate-400'}`}
                  >
                    Upload File
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setUseCamera(true)} 
                    className={`px-3 py-1.5 rounded text-xs font-semibold border ${useCamera ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'border-slate-800 text-slate-400'}`}
                  >
                    Webcam
                  </button>
                </div>
              </div>

              {!useCamera ? (
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-cyan-500/30 rounded-xl cursor-pointer bg-slate-900/10 hover:bg-slate-900/30 transition-all">
                    <FiUpload className="text-2xl text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400">Choose image file</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => { 
                        if (e.target.files[0]) {
                          setFile(e.target.files[0]); 
                          runOcr(e.target.files[0]); 
                        }
                      }} 
                    />
                  </label>
                  {file && (
                    <div className="text-xs text-slate-400 max-w-xs space-y-1">
                      <div>File: <span className="font-semibold text-slate-200">{file.name}</span></div>
                      <div>Size: <span className="font-semibold">{(file.size / 1024).toFixed(0)} KB</span></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <CameraCapture onCapture={(blob) => { 
                      const f = new File([blob], `aadhar-${Date.now()}.jpg`, { type: 'image/jpeg' }); 
                      setFile(f); 
                      runOcr(f); 
                    }} />
                  </div>
                  {file && (
                    <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <FiCheckCircle /> Webcam photo captured and ready.
                    </div>
                  )}
                </div>
              )}

              {/* OCR scanner processing box */}
              {(ocrLoading || ocrText) && (
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <FiCpu className={`text-xl ${ocrLoading ? 'text-cyan-400 animate-spin' : 'text-emerald-400'}`} />
                    <div>
                      <div className="text-xs text-slate-400">AI OCR Scanner</div>
                      <div className="text-xs font-semibold text-slate-200">
                        {ocrLoading ? 'Scanning digits...' : `Extracted: ${ocrText.substring(0, 8)}...`}
                      </div>
                    </div>
                  </div>
                  {!ocrLoading && ocrMatch !== null && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${ocrMatch ? 'text-emerald-400' : 'text-yellow-500'}`}>
                      {ocrMatch ? (
                        <><FiCheckCircle /> Match</>
                      ) : (
                        <><FiAlertCircle /> No matching digits</>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <div className="text-sm text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">{error}</div>}

            <button 
              type="submit" 
              className="w-full btn-primary py-3 text-sm font-bold uppercase tracking-wider"
              disabled={loading || ocrLoading}
            >
              {loading ? 'Creating KYC Account...' : 'Submit Verification & Register'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
