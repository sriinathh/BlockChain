import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Debug-time checks: log if any top-level imported component is undefined
try {
  const debugList = { Navbar, Sidebar, Footer, Landing, Dashboard, Send, Transactions, Settings, Login, Register, NotFound, ProtectedRoute };
  Object.entries(debugList).forEach(([k,v]) => {
    if (!v) console.error(`App import check: component ${k} is undefined`);
  });
} catch (e) {
  console.error('App import check failed', e);
}

function PageWrapper({children}){
  // Only use motion.div if it's actually available; never pass motion props to regular div
  const hasMotion = motion && typeof motion.div === 'function';
  if (hasMotion) {
    return (
      <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}} transition={{duration:.35}} className="min-h-[70vh]">
        {children}
      </motion.div>
    );
  }
  return <div className="min-h-[70vh]">{children}</div>;
}

export default function App(){
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 flex gap-6">
        <Sidebar />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false} key={location.pathname}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Landing/></PageWrapper>} />
              <Route path="/dashboard" element={<PageWrapper><ProtectedRoute><Dashboard/></ProtectedRoute></PageWrapper>} />
              <Route path="/send" element={<PageWrapper><ProtectedRoute><Send/></ProtectedRoute></PageWrapper>} />
              <Route path="/transactions" element={<PageWrapper><ProtectedRoute><Transactions/></ProtectedRoute></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><ProtectedRoute><Settings/></ProtectedRoute></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login/></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register/></PageWrapper>} />
              <Route path="*" element={<PageWrapper><NotFound/></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
}
