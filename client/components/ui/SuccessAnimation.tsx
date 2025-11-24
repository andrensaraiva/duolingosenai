import React from 'react';
import { motion } from 'framer-motion';

const SuccessAnimation = () => {
  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 200 - 100, // Random spread X
    y: Math.random() * -200 - 50, // Random spread Y (upwards)
    color: ['#f43f97', '#0ea5e9', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 4)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{ 
            opacity: 0, 
            x: p.x, 
            y: p.y, 
            rotate: p.rotation,
            scale: 1 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

export default SuccessAnimation;