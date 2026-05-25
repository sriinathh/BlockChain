import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Runtime guard: log when React.createElement is called with an undefined type
try {
  const _origCreateElement = React.createElement;
  React.createElement = function(type, props, ...children) {
    if (typeof type === 'undefined' || type === null) {
      // eslint-disable-next-line no-console
      console.error('React.createElement called with undefined/null type', { type, props, stack: new Error().stack });
    }
    return _origCreateElement(type, props, ...children);
  };
} catch (e) {
  console.warn('Failed to install createElement guard', e);
}
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <ToastContainer position="top-right" />
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
