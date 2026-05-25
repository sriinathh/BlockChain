import React from 'react';

export default function GradientButton({ children, className = '', ...props }) {
  return (
    <button {...props} className={`btn-neon ${className}`}>
      {children}
    </button>
  );
}
