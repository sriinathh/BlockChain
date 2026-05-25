import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BlockchainParticle = ({ count = 20 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 4 + 2, // size in px
      duration: Math.random() * 12 + 10, // float speed
      delay: Math.random() * -20, // start immediately
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyber-cyan/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ['0px', '-120px', '0px'],
            x: ['0px', '30px', '0px'],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Laser light scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent pointer-events-none blur-[1px]"
        animate={{
          top: ['0%', '100%', '0%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default BlockchainParticle;
