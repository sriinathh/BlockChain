import React from 'react';

export default function Brand({ hideText = false, imgClass = 'w-6 h-6', textClass = 'font-semibold text-[var(--text-900)]', containerClass = '' }) {
  return (
    <span className={`inline-flex items-center ${containerClass}`}>
      <img src="/Metabank.png" alt="Logo" className={`${imgClass} rounded`} />
      {!hideText && <span className={`ml-2 ${textClass}`}>MetaBank</span>}
    </span>
  );
}
