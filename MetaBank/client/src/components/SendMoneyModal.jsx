import React, { useState } from 'react';

export default function SendMoneyModal({ open, onClose, onSend }) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 overlay-subtle" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="bank-card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-900)]">Send Money</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-[var(--muted)]">Recipient (account or wallet)</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)]">Amount (USD)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)]">Note</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 justify-end">
            <button onClick={onClose} className="btn-outline">Cancel</button>
            <button onClick={() => { onSend({ to, amount, note }); onClose(); }} className="btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
