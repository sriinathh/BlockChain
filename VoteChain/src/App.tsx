import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Guidelines } from './pages/Guidelines';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlockchainExplorer } from './pages/BlockchainExplorer';
import { ResultsDashboard } from './pages/ResultsDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow max-w-7xl w-full mx-auto py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/explorer" element={<BlockchainExplorer />} />
            <Route path="/results" element={<ResultsDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
