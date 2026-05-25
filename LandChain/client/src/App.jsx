import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  React.useEffect(() => {
    const saved = localStorage.getItem('landchain_theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <WalletProvider>
            <div className="min-h-screen bg-cyber-dark text-white select-none">
              <AppRoutes />
            </div>
          </WalletProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
