import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiUser, FiMail, FiShield, FiUpload, FiCheckCircle } from 'react-icons/fi';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUploadKyc = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!file) return setError('Please choose a file');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('aadharImage', file);
      const res = await api.postForm('/user/upload-aadhar', fd);
      const data = await res.json();

      if (!res.ok) return setError(data.message || 'Upload failed');
      setSuccessMsg('KYC document uploaded and verified successfully.');
      setFile(null);
      loadProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <h2 className="text-xl font-bold text-white">KYC Identity Portal</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage credentials, link verification documents, and audit wallet bindings.</p>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bank-card p-6 border-slate-800 bg-slate-900/30 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5"><FiUser /> Profile Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase">Username</span>
                  <div className="font-semibold text-slate-200">{profile.username}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase">Full Name</span>
                  <div className="font-semibold text-slate-200">{profile.fullName || '—'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase">Email Address</span>
                  <div className="font-semibold text-slate-200 flex items-center gap-1"><FiMail /> {profile.email}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase">Account Role</span>
                  <div className="font-bold text-cyan-400 capitalize">{profile.role}</div>
                </div>
              </div>

              {/* Linked Wallets */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Linked Web3 Wallets</span>
                <div className="space-y-1.5 mt-2">
                  {profile.wallets && profile.wallets.length > 0 ? (
                    profile.wallets.map(w => (
                      <div key={w} className="p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-400 border border-slate-900 truncate">
                        {w}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">No Web3 wallets linked yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KYC Status upload */}
          <aside className="space-y-6">
            <div className="bank-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
              <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wider">KYC Status</h4>
              
              <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${
                profile.aadharVerified 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400'
              }`}>
                <FiShield className="text-3xl mb-2" />
                <div className="text-sm font-bold">{profile.aadharVerified ? 'KYC Verified' : 'KYC Pending'}</div>
                <div className="text-[10px] opacity-80 mt-1 leading-snug">
                  {profile.aadharVerified 
                    ? 'Your accounts qualify for high-limit withdrawals and smart contract minting.' 
                    : 'Upload your Aadhar verification document to enable checking/savings reserves.'}
                </div>
              </div>

              {!profile.aadharVerified && (
                <form onSubmit={handleUploadKyc} className="space-y-3 pt-2">
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 hover:border-cyan-500/30 rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900/30 transition-all">
                    <FiUpload className="text-xl text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-400">Choose Aadhar Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setFile(e.target.files[0])} 
                    />
                  </label>
                  {file && <div className="text-[10px] text-slate-400 truncate">Selected: {file.name}</div>}

                  {error && <div className="text-xs text-red-400">{error}</div>}
                  {successMsg && <div className="text-xs text-emerald-400 flex items-center gap-1"><FiCheckCircle /> {successMsg}</div>}

                  <button 
                    type="submit" 
                    className="w-full btn-primary text-xs py-2"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading Doc...' : 'Upload Aadhar'}
                  </button>
                </form>
              )}
            </div>
          </aside>

        </div>
      )}

    </div>
  );
}
