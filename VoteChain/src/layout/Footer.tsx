import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-neutralDark text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2026 VoteChain. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-accent transition-colors">Security Guidelines</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          Government‑grade digital voting platform • Built with blockchain & AI security
        </div>
      </div>
    </footer>
  );
};
