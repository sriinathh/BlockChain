import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({size=36}){
  if (motion && motion.div) {
    return (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="flex items-center justify-center">
        <div style={{width:size,height:size}} className="rounded-full border-4 border-t-transparent border-white/30" />
      </motion.div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div style={{width:size,height:size}} className="rounded-full border-4 border-t-transparent border-white/30" />
    </div>
  );
}
