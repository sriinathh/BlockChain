import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { landAPI } from '../services/api';
import MapPicker from '../components/MapPicker';
import GlassCard from '../components/GlassCard';
import {
  FileText,
  MapPin,
  Upload,
  User,
  Hash,
  Scale,
  Wallet,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const LandRegistration = () => {
  const { currentUser } = useAuth();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { addToast } = useNotifications();

  // Form states
  const [ownerName, setOwnerName] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('12.9716');
  const [lng, setLng] = useState('79.1588');
  
  // Document states
  const [dragActive, setDragActive] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);

  // Tx flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // 0: Idle, 1: Hashing deed docs, 2: Smart Contract execution, 3: Success popup
  const [newLandReceipt, setNewLandReceipt] = useState(null);

  // Auto-fill owner name and district from currentUser profile
  useEffect(() => {
    if (currentUser) {
      setOwnerName(currentUser.name);
      setDistrict(currentUser.district);
      setState(currentUser.state);
    }
  }, [currentUser]);

  const handleSelectCoords = (latitude, longitude) => {
    setLat(latitude);
    setLng(longitude);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadedFile = (file) => {
    setDocumentFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocumentPreview(reader.result);
    };
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      setDocumentPreview('pdf-icon');
    }
    addToast('Document Staged', `${file.name} uploaded successfully.`, 'info');
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      addToast('Wallet Sync Required', 'Connect your ledger wallet key before signing block transactions.', 'warning');
      return;
    }
    if (!documentFile) {
      addToast('Deed Missing', 'Please upload a legal mutation or registry deed document.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStep(1); // Stage 1: File Hashing & IPFS upload trigger

    try {
      // Compile into Multipart Form Data
      const formData = new FormData();
      formData.append('surveyNumber', surveyNumber);
      formData.append('area', area);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('gps', `${parseFloat(lat).toFixed(4)}° N, ${parseFloat(lng).toFixed(4)}° E`);
      formData.append('deedDoc', documentFile);

      // Build GeoJSON coordinates array: [[lng, lat]]
      const longitude = parseFloat(lng);
      const latitude = parseFloat(lat);
      const polygonCoords = [
        [longitude, latitude],
        [longitude + 0.002, latitude],
        [longitude + 0.002, latitude - 0.002],
        [longitude, latitude - 0.002],
        [longitude, latitude]
      ];
      formData.append('coordinates', JSON.stringify(polygonCoords));

      await new Promise(r => setTimeout(r, 1000));
      setSubmitStep(2); // Stage 2: Ethers signing and validation

      const response = await landAPI.register(formData);
      if (response.success) {
        setNewLandReceipt(response.land);
        setSubmitStep(3); // Success
        addToast('Block Confirmed', `Smart Contract successfully deployed. Request logged under ID: ${response.land.id}`, 'success');
      }
    } catch (error) {
      setSubmitStep(0);
      addToast('Registration Failed', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeReceiptModal = () => {
    setSubmitStep(0);
    setNewLandReceipt(null);
    // Reset form
    setSurveyNumber('');
    setArea('');
    setDocumentFile(null);
    setDocumentPreview(null);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
          GENESIS LAND REGISTRATION
        </h1>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
          SUBMIT PROPERTY TITLE TO CONSENSUS AUDITORS FOR BLOCKCHAIN MINTING
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Registration Form (Glass Panel) */}
        <div className="lg:col-span-7">
          <GlassCard className="border-cyber-indigo/20">
            <form onSubmit={handleSubmitRegistration} className="flex flex-col gap-5">
              
              {/* Owner Info & Wallet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <User size={12} />
                    Title Owner Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-cyber-dark/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Wallet size={12} />
                    Cryptographic Address
                  </label>
                  <input
                    type="text"
                    value={isConnected ? walletAddress : 'SYNC WALLET KEY'}
                    className={`w-full bg-cyber-dark/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono truncate focus:outline-none ${
                      isConnected ? 'text-gray-300' : 'text-rose-400 font-semibold'
                    }`}
                    disabled
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Hash size={12} />
                    Survey Plot Number
                  </label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    placeholder="e.g. 204/3A"
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Scale size={12} />
                    Land Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 2.4"
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <MapPin size={12} />
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kanchipuram"
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <MapPin size={12} />
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Tamil Nadu"
                    className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Coordinates fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-bold">Latitude Coordinates</span>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-cyber-dark/60 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-bold">Longitude Coordinates</span>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-cyber-dark/60 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Drag and Drop Document Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                  <FileText size={12} />
                  Legal Title Deed Documents (PDF / Images)
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`w-full min-h-[140px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${
                    dragActive ? 'border-cyber-cyan bg-cyber-cyan/10' : 'border-white/10 hover:border-white/20 bg-cyber-dark/40'
                  }`}
                >
                  <input
                    type="file"
                    id="deed-upload-input"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  
                  {documentFile ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/35 flex items-center justify-center text-cyber-cyan">
                        <FileText size={22} />
                      </div>
                      <span className="text-xs text-white font-mono font-semibold max-w-[200px] truncate">
                        {documentFile.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {(documentFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ) : (
                    <label htmlFor="deed-upload-input" className="cursor-pointer flex flex-col items-center gap-2 text-center hover:opacity-85">
                      <div className="w-10 h-10 rounded-xl bg-cyber-blue-light border border-white/5 flex items-center justify-center text-gray-400">
                        <Upload size={18} />
                      </div>
                      <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Drag & drop files here</span>
                      <span className="text-[10px] text-gray-500">Supported formats: PDF, PNG, JPG</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Trigger */}
              {!isConnected ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full py-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all text-xs"
                >
                  Sync Wallet Key to Approve Minting
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform active:scale-98"
                >
                  Sign and Submit to Blockchain
                </button>
              )}

            </form>
          </GlassCard>
        </div>

        {/* GIS Map Selector & Preview (Glass Panel) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <GlassCard className="p-4 border-cyber-cyan/10">
            <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase block mb-3">
              Locate Land Boundary Coordinates
            </span>
            <MapPicker lat={lat} lng={lng} onSelectCoords={handleSelectCoords} />
            <p className="text-[10px] text-gray-500 leading-normal mt-2.5">
              💡 Drag the marker or click anywhere on the Map to dynamically capture GPS coordinate parameters into the registration form.
            </p>
          </GlassCard>

          {/* Blockchain Gas Fees Preview Card */}
          <GlassCard className="border-cyber-indigo/10 bg-cyber-blue-light/20">
            <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase block mb-4">
              Gas Fee & Hash Preview
            </span>
            <div className="flex flex-col gap-2.5 font-mono text-xs text-gray-400">
              <div className="flex justify-between">
                <span>ESTIMATED GAS USED:</span>
                <span className="text-white font-semibold">43,000 units</span>
              </div>
              <div className="flex justify-between">
                <span>GAS PRICE LEVEL:</span>
                <span className="text-white font-semibold">19 Gwei</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span>TX FEE CONVERSION:</span>
                <span className="text-cyber-cyan font-bold">0.00081 ETH</span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span>TARGET SMART CONTRACT:</span>
                <span className="text-[10px] text-gray-500 break-all select-all">
                  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* MULTI-STEP BLOCKCHAIN TRANSACTION MINING DIALOG */}
      {submitStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/85 backdrop-blur-md px-4">
          <GlassCard className="max-w-md w-full border-cyber-cyan/35 text-center p-8 bg-cyber-dark relative overflow-hidden">
            
            {/* Hashing Step */}
            {submitStep === 1 && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin flex items-center justify-center" />
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">DEED FILE CRYPTOGRAPHY</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Pinning title document deeds directly to decentralized IPFS storage. Encrypting hashes...
                </p>
              </div>
            )}

            {/* Smart Contract Deploying Step */}
            {submitStep === 2 && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full border-2 border-cyber-indigo/20 border-t-cyber-indigo animate-spin flex items-center justify-center" />
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">MINING ON-CHAIN TRANSACTION</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Broadcasting gas fee parameters to Polygon Amoy consensus nodes. Executing Solidity title mint code...
                </p>
              </div>
            )}

            {/* Success Receipt Popup */}
            {submitStep === 3 && newLandReceipt && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                  TRANSACTION CONFIRMED
                </h3>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Survey land deed <span className="text-white font-bold">{newLandReceipt.surveyNumber}</span> has been written directly to Polygon ledger.
                </p>

                {/* Receipt metrics */}
                <div className="w-full bg-cyber-dark/95 border border-white/5 rounded-xl p-4 font-mono text-left text-[11px] text-gray-400 mt-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>MINT ID:</span>
                    <span className="text-white font-bold">{newLandReceipt.id || newLandReceipt._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BLOCK HASH:</span>
                    <span className="text-cyber-cyan truncate w-[200px] text-right">{newLandReceipt.txHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AREA RECORD:</span>
                    <span className="text-white">{newLandReceipt.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REGISTRY TIME:</span>
                    <span>Just now</span>
                  </div>
                </div>

                <div className="flex gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] p-2.5 rounded-lg text-left mt-3">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>The title status will show as "Pending" until an administrator verifies the document checksum matches ground registry deeds.</span>
                </div>

                <button
                  onClick={closeReceiptModal}
                  className="w-full mt-5 py-3 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default LandRegistration;
