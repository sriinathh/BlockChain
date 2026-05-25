import React, { useState } from 'react';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res?.token) {
        toast.success('Logged in');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.message || 'Login failed');
    }
  };
  return (
    <div className="max-w-md card p-6 rounded-xl">
      <h2 className="text-xl font-semibold">Login</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input className="form-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div className="relative">
          <input type="password" className="form-input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="muted text-sm">Forgot password?</div>
          <AnimatedButton className="btn-primary">Login</AnimatedButton>
        </div>
      </form>
    </div>
  );
}
