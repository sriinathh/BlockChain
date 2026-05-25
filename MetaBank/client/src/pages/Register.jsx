import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import { ocrImage } from '../utils/ocr';

export default function Register() {
  const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', aadharNumber: '' });
  const [file, setFile] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [error, setError] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [ocrMatch, setOcrMatch] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
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
        // still allow login but show notice
        alert('Aadhar uploaded but needs verification. Your account is created.');
      }
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
  };

  const runOcr = async (file) => {
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Open Account</h2>
      <form onSubmit={submit} className="grid gap-4 bg-[var(--card-bg)] p-6 bank-card">
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={onChange} className="p-2 border rounded" />
        <input name="username" placeholder="Username" value={form.username} onChange={onChange} className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} className="p-2 border rounded" />
        <input name="aadharNumber" placeholder="Aadhar number" value={form.aadharNumber} onChange={onChange} className="p-2 border rounded" />
        <div>
          <label className="text-sm text-[var(--muted)]">Aadhar image (photo)</label>
          <div className="flex items-center gap-3 mt-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useCamera} onChange={(e) => setUseCamera(e.target.checked)} /> Use camera
            </label>
            {!useCamera && <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files[0]); runOcr(e.target.files[0]); }} />}
          </div>
          {useCamera && (
            <div className="mt-2">
              <CameraCapture onCapture={(blob) => { const f = new File([blob], `aadhar-${Date.now()}.jpg`, { type: 'image/jpeg' }); setFile(f); runOcr(f); }} />
              {file && <div className="mt-2 text-sm text-[var(--muted)]">Captured photo ready — OCR: {ocrText ? (ocrMatch ? 'Matches' : 'No match') : 'Pending'}</div>}
            </div>
          )}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-end">
          <button className="btn-primary" type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}
