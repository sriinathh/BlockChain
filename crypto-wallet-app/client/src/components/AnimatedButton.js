import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedButton({children, onClick, className='', disabled=false}){
  const hasMotion = motion && typeof motion.button === 'function';
  const base = `px-4 py-2 rounded-md neon-btn ${className}`;
  if (hasMotion) {
    const MotionButton = motion.button;
    return (
      <MotionButton whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} whileFocus={{ boxShadow: '0 8px 24px rgba(107,92,233,0.18)' }} onClick={onClick} className={base} disabled={disabled}>
        {children}
      </MotionButton>
    );
  }
  return (
    <button onClick={onClick} className={base} disabled={disabled}>
      {children}
    </button>
  );
}
