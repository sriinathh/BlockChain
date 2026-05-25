import React, { useState } from 'react';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ username: email.split('@')[0], email, password });
      if (res?.token) {
        toast.success('Account created');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    }
  };
  return (
    <div className="max-w-md card p-6 rounded-xl">
      <h2 className="text-xl font-semibold">Register</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input className="form-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <AnimatedButton className="btn-primary">Create account</AnimatedButton>
      </form>
    </div>
  );
}
