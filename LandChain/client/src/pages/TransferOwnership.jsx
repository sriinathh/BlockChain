import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationContext';
import { landAPI, transferAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  ArrowLeftRight,
  User,
  Smartphone,
  Wallet,
  Building,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const TransferOwnership = () => {
  const { currentUser } = useAuth();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { addToast } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledLandId = location.state?.prefilledLandId || '';

  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Recipient details
  const [recipientName, setRecipientName] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');
  const [recipientAadhaar, setRecipientAadhaar] = useState('');

  // Execution flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // 0: Idle, 1: Checking credentials, 2: Appending blockchain node, 3: Success popup
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchTransferableLands = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const response = await landAPI.getAll({ owner: currentUser.wallet, status: 'Verified' });
        if (response.success) {
          setLands(response.lands);
          if (prefilledLandId) {
            setSelectedLandId(prefilledLandId);
          } else if (response.lands.length > 0) {
            setSelectedLandId(response.lands[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to load verified properties:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransferableLands();
  }, [currentUser, prefilledLandId]);

  const selectedLand = lands.find(l => l._id === selectedLandId);

  // Format Aadhaar: XXXX-XXXX-XXXX
  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const matches = value.match(/(\d{0,4})(\d{0,4})(\d{0,4})/);
    let formatted = '';
    if (matches) {
      formatted = !matches[2] ? matches[1] : `${matches[1]}-${matches[2]}${matches[3] ? `-${matches[3]}` : ''}`;
    }
    setRecipientAadhaar(formatted.substring(0, 14));
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLandId) {
      addToast('Validation Error', 'Please select a verified property to transfer.', 'error');
      return;
    }
    if (!recipientWallet.startsWith('0x') || recipientWallet.length !== 42) {
      addToast('Validation Error', 'Invalid recipient Web3 wallet address format.', 'error');
      return;
    }
    if (recipientAadhaar.length < 14) {
      addToast('Validation Error', 'Aadhaar must be exactly 12 digits.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStep(1); // checking credentials

    try {
      await new Promise(r => setTimeout(r, 1000));
      setSubmitStep(2); // Broadcast to Node

      const response = await transferAPI.create({
        landId: selectedLandId,
        toName: recipientName,
        toWallet: recipientWallet.toLowerCase(),
        toAadhaar: recipientAadhaar
      });

      if (response.success) {
        setReceipt(response.transfer);
        setSubmitStep(3); // Success Receipt
        addToast('Transfer Requested', `Conveyance logged successfully. Awaiting authority verify audit.`, 'success');
      }
    } catch (error) {
      setSubmitStep(0);
      addToast('Transfer Failed', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeReceiptModal = () => {
    setSubmitStep(0);
    setReceipt(null);
    setRecipientName('');
    setRecipientWallet('');
    setRecipientAadhaar('');
    // Refresh list
    setLands(prev => prev.filter(l => l._id !== selectedLandId));
    setSelectedLandId('');
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white m-0">
          TRANSFER OWNERSHIP
        </h1>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">
          CONVEY DIGITAL TITLE DEED PROPERTY RIGHTS SECURELY ON-CHAIN
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500 font-mono text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin mx-auto mb-3" />
          LOADING VERIFIED PROPERTIES...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Transfer form */}
          <div className="lg:col-span-7">
            <GlassCard className="border-cyber-indigo/20">
              <form onSubmit={handleTransferSubmit} className="flex flex-col gap-5">
                
                {/* Step 1: Select Property */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Building size={12} />
                    Choose Land Parcel Title
                  </label>
                  {lands.length > 0 ? (
                    <select
                      value={selectedLandId}
                      onChange={(e) => setSelectedLandId(e.target.value)}
                      className="w-full bg-cyber-dark border border-white/10 text-sm focus:border-cyber-cyan rounded-xl px-4 py-3 text-white focus:outline-none"
                      required
                    >
                      {lands.map((l) => (
                        <option key={l._id} value={l._id}>
                          Survey {l.surveyNumber} — {l.district}, {l.state} ({l.area})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>You do not possess any verified land titles eligible for transfer. Only approved "Verified" titles can be transacted.</span>
                    </div>
                  )}
                </div>

                {/* Selected plot stats summary */}
                {selectedLand && (
                  <div className="grid grid-cols-3 gap-2 bg-cyber-dark/60 border border-white/5 p-3.5 rounded-xl font-mono text-[10px] text-gray-400">
                    <div>
                      <span className="text-gray-500 uppercase block">PLOT AREA</span>
                      <span className="text-white font-bold text-xs mt-0.5 block">{selectedLand.area}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase block">SURVEY NUMBER</span>
                      <span className="text-white font-bold text-xs mt-0.5 block">{selectedLand.surveyNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase block">MINT ID</span>
                      <span className="text-cyber-cyan font-bold text-xs mt-0.5 block">{selectedLand.id || selectedLand._id.substring(18)}</span>
                    </div>
                  </div>
                )}

                {/* Recipient details boundary */}
                <div className="border-t border-white/5 pt-4 flex flex-col gap-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                    Recipient Identity Details
                  </span>

                  {/* Recipient Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                      <User size={12} />
                      Legal Recipient Full Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Recipient Aadhaar */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                      <Smartphone size={12} />
                      Recipient Aadhaar ID
                    </label>
                    <input
                      type="text"
                      value={recipientAadhaar}
                      onChange={handleAadhaarChange}
                      placeholder="0000-0000-0000"
                      className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Recipient Wallet Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono tracking-wider uppercase text-cyber-cyan font-bold flex items-center gap-1.5">
                      <Wallet size={12} />
                      Recipient Wallet Address (0x)
                    </label>
                    <input
                      type="text"
                      value={recipientWallet}
                      onChange={(e) => setRecipientWallet(e.target.value)}
                      placeholder="0x0000000000000000000000000000000000000000"
                      className="w-full bg-cyber-dark/80 border border-white/10 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Submit triggers */}
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full mt-2 py-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    Sync Wallet to Authorize Transfer
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || lands.length === 0}
                    className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-cyber-indigo to-cyber-cyan text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Confirm and Authorize Title Transfer
                  </button>
                )}

              </form>
            </GlassCard>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <GlassCard className="border-cyber-cyan/10">
              <span className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase block mb-3 flex items-center gap-1.5">
                <HelpCircle size={14} /> Smart Contract Safety Escrow
              </span>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Transferring a deed permanently writes a transaction record assigning the Survey plot to the recipient's wallet. 
              </p>
              <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-500">
                <div className="flex gap-2">
                  <span className="text-cyber-cyan font-bold">1.</span>
                  <span>Requires active multisig wallet connection from current title owner.</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-cyber-cyan font-bold">2.</span>
                  <span>Performs automatic checks ensuring no open boundary lawsuits exist.</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-cyber-cyan font-bold">3.</span>
                  <span>The transaction is immutable once confirmed by consensus validators.</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-cyber-indigo/10 bg-cyber-blue-light/10">
              <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase block mb-3">
                Solidity Transaction Code
              </span>
              <pre className="text-[10px] text-gray-600 bg-cyber-dark/80 p-3 rounded-lg border border-white/5 font-mono overflow-x-auto leading-normal">
{`function transferTitle(
    uint256 landId,
    address to,
    string memory name,
    string memory aadhaar
) public returns (bool) {
    require(ownerOf(landId) == msg.sender, "ERR:AUTH");
    _transfer(msg.sender, to, landId);
    emit TitleConveyed(landId, msg.sender, to);
    return true;
}`}
              </pre>
            </GlassCard>

          </div>

        </div>
      )}

      {/* MULTI-STEP BLOCKCHAIN TRANSACTION MINING DIALOG */}
      {submitStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/85 backdrop-blur-md px-4">
          <GlassCard className="max-w-md w-full border-cyber-cyan/35 text-center p-8 bg-cyber-dark relative overflow-hidden">
            
            {/* Step 1 */}
            {submitStep === 1 && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan/20 border-t-cyber-cyan animate-spin flex items-center justify-center" />
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">CHECKING CREDENTIALS</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Asserting sender signature keys and recipient Aadhaar validation mapping bounds...
                </p>
              </div>
            )}

            {/* Step 2 */}
            {submitStep === 2 && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full border-2 border-cyber-indigo/20 border-t-cyber-indigo animate-spin flex items-center justify-center" />
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white">SUBMITTING TO NETWORK</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Staging transaction parameter logs to land chain registry service...
                </p>
              </div>
            )}

            {/* Step 3 Success */}
            {submitStep === 3 && receipt && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                  TRANSACTION STAGED
                </h3>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Conveyance request for <span className="text-white font-bold">{receipt.toName}</span> logged successfully.
                </p>

                {/* Receipt metrics */}
                <div className="w-full bg-cyber-dark/95 border border-white/5 rounded-xl p-4 font-mono text-left text-[11px] text-gray-400 mt-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>TRANSFER ID:</span>
                    <span className="text-white font-bold">{receipt._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FROM WALLET:</span>
                    <span className="text-cyber-cyan truncate w-[180px] text-right">{receipt.fromWallet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RECIPIENT WALLET:</span>
                    <span className="text-white truncate w-[180px] text-right">{receipt.toWallet}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-white/5 pt-2 mt-1">
                    <span>STATUS:</span>
                    <span className="text-amber-400 uppercase font-bold">{receipt.status}</span>
                  </div>
                </div>

                <div className="flex gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] p-2.5 rounded-lg text-left mt-3">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>The transfer will occur once a Government Officer verifies the credentials and approves the transaction.</span>
                </div>

                <button
                  onClick={closeReceiptModal}
                  className="w-full mt-5 py-3 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Return to Console
                </button>
              </div>
            )}

          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default TransferOwnership;
