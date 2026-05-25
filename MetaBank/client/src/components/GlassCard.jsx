import React from 'react';

export default function GlassCard({ children, className = '' }) {
  return <div className={`bank-card ${className}`}>{children}</div>;
}
