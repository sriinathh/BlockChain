import React from 'react';
// Brand removed from footer per request
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-12 mt-12 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-lg font-semibold text-[var(--text-900)]">MetaBank — AI Powered Banking</div>
          <div className="text-sm text-[var(--muted)]">Secure, intelligent finance for consumers and enterprises.</div>
        </div>

        <div className="flex items-center gap-4">
          <button aria-label="Twitter" onClick={() => {}} className="text-[var(--muted)] hover:text-[var(--text-900)]"><FaTwitter size={18} /></button>
          <button aria-label="GitHub" onClick={() => {}} className="text-[var(--muted)] hover:text-[var(--text-900)]"><FaGithub size={18} /></button>
          <button aria-label="LinkedIn" onClick={() => {}} className="text-[var(--muted)] hover:text-[var(--text-900)]"><FaLinkedin size={18} /></button>
        </div>

        <div className="text-sm text-[var(--muted)]">© {new Date().getFullYear()}. All rights reserved.</div>
      </div>
    </footer>
  );
}
