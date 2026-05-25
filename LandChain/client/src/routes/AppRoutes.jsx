import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/UserDashboard';
import LandRegistration from '../pages/LandRegistration';
import MyLands from '../pages/MyLands';
import TransferOwnership from '../pages/TransferOwnership';
import BlockchainExplorer from '../pages/BlockchainExplorer';
import GisMap from '../pages/GisMap';
import AdminDashboard from '../pages/AdminDashboard';
import FraudDetection from '../pages/FraudDetection';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      />

      {/* Portal Pages (Protected by DashboardLayout) */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <UserDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/register-land"
        element={
          <DashboardLayout>
            <LandRegistration />
          </DashboardLayout>
        }
      />
      <Route
        path="/my-lands"
        element={
          <DashboardLayout>
            <MyLands />
          </DashboardLayout>
        }
      />
      <Route
        path="/transfer-ownership"
        element={
          <DashboardLayout>
            <TransferOwnership />
          </DashboardLayout>
        }
      />
      <Route
        path="/explorer"
        element={
          <DashboardLayout>
            <BlockchainExplorer />
          </DashboardLayout>
        }
      />
      <Route
        path="/maps"
        element={
          <DashboardLayout>
            <GisMap />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/fraud-detection"
        element={
          <DashboardLayout>
            <FraudDetection />
          </DashboardLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;
