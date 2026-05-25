import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { landAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import QRCodeGen from '../components/QRCodeGen';
import {
  MapPin,
  ArrowRight,
  Download,
  Info,
  X,
  History,
  ShieldCheck
} from 'lucide-react';

const MyLands = () => {
  const { currentUser } = useAuth();
  const { walletAddress } = useWallet();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [myLands, setMyLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyLands = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const response = await landAPI.getAll({ owner: currentUser.wallet });
        if (response.success) {
          setMyLands(response.lands);
        }
      } catch (error) {
        console.error('Failed to load properties:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyLands();
  }, [currentUser]);

  const handleDownloadCert = (land) => {
    addToast('Certificate Generated', `Deed token PDF generated for Survey ${land.surveyNumber}`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
            MY PROPERTIES
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
            ON-CHAIN DEED ASSETS ASSOCIATED WITH ADHAR KEY
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin mx-auto mb-3" />
          LOADING REGISTERED PARCELS...
        </div>
      ) : myLands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myLands.map((land) => (
            <GlassCard key={land._id} className="flex flex-col justify-between h-[390px] overflow-hidden p-0">
              
              {/* Image & Status Tag */}
              <div className="relative h-44 w-full bg-cyber-dark">
                <img
                  src={land.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600"}
                  alt="Property"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-blue via-transparent to-transparent" />
                
                {/* Status tag */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wide uppercase border ${
                    land.status === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : land.status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {land.status}
                  </span>
                </div>

                {/* Plot Title overlay */}
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-lg font-bold font-display text-white drop-shadow-md">
                    Survey {land.surveyNumber}
                  </h3>
                  <span className="text-[10px] text-cyber-cyan font-mono tracking-wider">
                    DEED ID: {land.id || land._id.substring(18)}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="p-5 flex-grow flex flex-col gap-2.5 font-mono text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-cyber-cyan" />
                  <span>{land.district}, {land.state}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>PLOT AREA:</span>
                  <span className="text-white font-bold">{land.area}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-white/5 pt-2 mt-1">
                  <span>LEDGER HASH:</span>
                  <span className="text-[10px] text-gray-500 truncate select-all">{land.txHash}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-cyber-dark/40 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[10px] font-mono tracking-wider font-bold">
                <button
                  onClick={() => setSelectedLand(land)}
                  className="py-2.5 border border-white/5 hover:border-cyber-cyan/35 bg-cyber-blue-light/20 text-cyber-cyan hover:text-white rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Info size={10} /> DETAILS
                </button>
                <button
                  onClick={() => navigate('/transfer-ownership', { state: { prefilledLandId: land._id } })}
                  className="py-2.5 border border-white/5 hover:border-cyber-cyan/35 bg-cyber-blue-light/20 text-gray-300 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <ArrowRight size={10} /> TRANSFER
                </button>
                <button
                  onClick={() => handleDownloadCert(land)}
                  className="py-2.5 border border-white/5 hover:border-cyber-cyan/35 bg-cyber-blue-light/20 text-gray-300 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Download size={10} /> CERT
                </button>
              </div>

            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-16 text-center text-gray-500">
          <p>No owned properties registered under your Aadhaar account.</p>
          <button
            onClick={() => navigate('/register-land')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white text-xs font-bold uppercase rounded-xl transition-all"
          >
            Create Land Registry Request
          </button>
        </GlassCard>
      )}

      {/* DETAIL VIEW DRAWER */}
      {selectedLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-cyber-dark/80 backdrop-blur-md">
          <div className="w-full max-w-lg h-full bg-cyber-dark border-l border-white/10 p-6 overflow-y-auto flex flex-col justify-between animate-slideLeft shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedLand(null)}
              className="absolute top-5 right-5 p-2 bg-cyber-blue-light/50 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              {/* Header Info */}
              <div className="mb-6">
                <span className="text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold">
                  LEDGER METRIC SHEET
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-1">
                  Survey Plot {selectedLand.surveyNumber}
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">MINT KEY: {selectedLand.id || selectedLand._id}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs text-gray-400 border-b border-white/5 pb-6 mb-6">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Land Area</span>
                  <span className="text-white font-bold text-sm block mt-0.5">{selectedLand.area}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">GPS Location</span>
                  <span className="text-white block mt-0.5 truncate">{selectedLand.gps}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-gray-500 uppercase block">Audit Authority</span>
                  <span className="text-white block mt-0.5">{selectedLand.district} Municipal</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-gray-500 uppercase block">Verification Check</span>
                  <span className={`font-bold block mt-0.5 ${
                    selectedLand.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {selectedLand.status} Status
                  </span>
                </div>
              </div>

              {/* QR Code and Verification link */}
              <div className="flex flex-col md:flex-row gap-6 items-center bg-cyber-blue-light/20 border border-white/5 p-4 rounded-2xl mb-6">
                <QRCodeGen value={`https://amoy.polygonscan.com/tx/${selectedLand.txHash}`} size={120} />
                <div className="flex-grow text-xs leading-relaxed text-gray-400">
                  <span className="font-bold text-white block mb-1">Decentralized Title Verification</span>
                  <p className="text-[11px]">
                    This QR certificate contains a direct pointer to the Polygon blockchain explorer transaction index. Scan it to verify signature authenticity.
                  </p>
                </div>
              </div>

              {/* History Timeline */}
              <div className="flex flex-col gap-3 mb-6">
                <span className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                  <History size={14} /> Ownership Chronology
                </span>
                <div className="border-l border-white/10 pl-4 py-1 flex flex-col gap-4 font-mono text-xs">
                  {selectedLand.history && selectedLand.history.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyber-cyan" />
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white uppercase text-[10px]">{hist.type}</span>
                        <span className="text-[10px] text-gray-500">{hist.date ? new Date(hist.date).toLocaleDateString() : 'Just now'}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        From: <span className="text-gray-300 font-semibold">{hist.from}</span> <br />
                        To: <span className="text-gray-300 font-semibold">{hist.to}</span>
                      </p>
                      <span className="text-[9px] text-gray-600 truncate block mt-0.5 max-w-[280px]">
                        TX: {hist.txHash || hist.hash}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={() => handleDownloadCert(selectedLand)}
                className="flex-1 py-3 bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/35 text-cyber-cyan font-bold uppercase text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> PRINT CERTIFICATE
              </button>
              <button
                onClick={() => setSelectedLand(null)}
                className="px-6 py-3 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-colors text-xs font-bold uppercase"
              >
                CLOSE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyLands;
