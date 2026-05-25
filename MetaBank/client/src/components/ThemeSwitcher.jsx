import React, { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('metabank-theme') || 'professional';
    } catch (e) { return 'professional'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('metabank-theme', theme); } catch (e) {}
  }, [theme]);

  return (
    <select aria-label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="text-sm border-transparent bg-transparent">
      <option value="professional">Professional</option>
      <option value="navy">Navy</option>
      <option value="emerald">Emerald</option>
      <option value="gold">Corporate Gold</option>
    </select>
  );
}
