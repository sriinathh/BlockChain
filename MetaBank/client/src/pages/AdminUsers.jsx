import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed');
      setUsers(data.users || []);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleVerify = async (u) => {
    try {
      const res = await api.post('/admin/verify-aadhar', { userId: u._id, verified: !u.aadharVerified });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed');
      fetchUsers();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Admin - Users</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-3">
        {users.map(u => (
          <div key={u._id} className="bank-card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{u.fullName || u.username} ({u.email})</div>
              <div className="text-sm text-[var(--muted)]">Aadhar: {u.aadharNumber || '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm">Verified: {u.aadharVerified ? 'Yes' : 'No'}</div>
              <button onClick={() => toggleVerify(u)} className="btn-outline">Toggle Verify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
