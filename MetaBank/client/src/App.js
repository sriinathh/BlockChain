import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transfer from './pages/Transfer';
import CryptoExchange from './pages/CryptoExchange';
import Staking from './pages/Staking';
import Loans from './pages/Loans';
import Transactions from './pages/Transactions';
import NFTIdentity from './pages/NFTIdentity';
import BlockchainExplorer from './pages/BlockchainExplorer';
import FraudDetection from './pages/FraudDetection';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><DashboardLayout><Wallet /></DashboardLayout></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute><DashboardLayout><Deposit /></DashboardLayout></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><DashboardLayout><Withdraw /></DashboardLayout></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><DashboardLayout><Transfer /></DashboardLayout></ProtectedRoute>} />
        <Route path="/exchange" element={<ProtectedRoute><DashboardLayout><CryptoExchange /></DashboardLayout></ProtectedRoute>} />
        <Route path="/staking" element={<ProtectedRoute><DashboardLayout><Staking /></DashboardLayout></ProtectedRoute>} />
        <Route path="/loans" element={<ProtectedRoute><DashboardLayout><Loans /></DashboardLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><DashboardLayout><Transactions /></DashboardLayout></ProtectedRoute>} />
        <Route path="/nft-identity" element={<ProtectedRoute><DashboardLayout><NFTIdentity /></DashboardLayout></ProtectedRoute>} />
        <Route path="/explorer" element={<ProtectedRoute><DashboardLayout><BlockchainExplorer /></DashboardLayout></ProtectedRoute>} />
        <Route path="/fraud" element={<ProtectedRoute><DashboardLayout><FraudDetection /></DashboardLayout></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><DashboardLayout><AIAssistant /></DashboardLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />

        {/* Admin and Officer Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'officer']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
