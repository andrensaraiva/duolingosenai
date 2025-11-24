import React from 'react';
import { motion } from 'framer-motion';
import { CharacterCustomization } from '../../types';

interface BotoAvatarProps extends CharacterCustomization {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'idle' | 'happy' | 'sad';
  className?: string;
}

const BotoAvatar: React.FC<BotoAvatarProps> = ({ 
  color = 'pink', 
  hat = 'none', 
  accessory = 'none', 
  size = 'md',
  emotion = 'idle',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-56 h-56'
  };

  // Tech colors instead of flat pastels
  const colorMap = {
    pink: '#d946ef',  // Neon Pink
    blue: '#06b6d4',  // Cyan
    purple: '#8b5cf6', // Violet
    orange: '#f59e0b'  // Amber
  };

  const hatMap = {
    none: null,
    party: '🤖', // Robot head
    cowboy: '📡', // Antenna
    astronaut: '⛑️', // Helmet
    crown: '👑'
  };

  const accessoryMap = {
    none: null,
    glasses: '🕶️',
    bowtie: '💾',
    scarf: '🧣'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <motion.div
        animate={emotion === 'happy' ? { scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="w-full h-full relative"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
          <defs>
            <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: colorMap[color], stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 0.4 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Grid Pattern for Hologram Effect */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>

          {/* Hologram Base */}
          <path 
            d="M20,60 L10,50 L30,30 L50,10 L80,20 L95,40 L90,60 L50,70 L30,70 Z" 
            fill={`url(#grad-${color})`} 
            stroke={colorMap[color]} 
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Grid Overlay */}
          <path 
            d="M20,60 L10,50 L30,30 L50,10 L80,20 L95,40 L90,60 L50,70 L30,70 Z" 
            fill="url(#grid)" 
            opacity="0.5"
          />

          {/* Tail Segment */}
          <path d="M20,60 L10,70 L5,60 L15,50 Z" fill="none" stroke={colorMap[color]} strokeWidth="1.5" />
          
          {/* Fin Segment */}
          <path d="M50,30 L60,10 L70,30 Z" fill={colorMap[color]} fillOpacity="0.5" stroke={colorMap[color]} />
          
          {/* Cyber Eye */}
          <circle cx="70" cy="35" r="4" fill="#0f172a" stroke="white" strokeWidth="1" />
          <circle cx="70" cy="35" r="1.5" fill={emotion === 'idle' ? '#10b981' : '#ef4444'} className="animate-pulse" />
          
          {/* Data Line / Mouth */}
          <path 
             d={emotion === 'sad' ? "M75,50 L85,52" : "M75,48 L85,48"} 
             stroke="white" 
             strokeWidth="2" 
             strokeDasharray="2 1"
          />
        </svg>

        {/* Floating HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-pulse-fast opacity-50">
             <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white rounded-full"></div>
             <div className="absolute bottom-[20%] right-[20%] w-1 h-1 bg-white rounded-full"></div>
             <div className="absolute top-[10%] right-[30%] border border-white/30 w-4 h-4 rounded-full"></div>
        </div>

        {/* Layers for Customization */}
        {hat !== 'none' && (
          <div className="absolute -top-[20%] right-[5%] text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
             <span style={{ fontSize: size === 'sm' ? '1rem' : size === 'md' ? '2rem' : '4rem' }}>
                {hatMap[hat]}
             </span>
          </div>
        )}

        {accessory !== 'none' && (
           <div className="absolute top-[35%] right-[0%] transform rotate-[-5deg] mix-blend-overlay">
             <span style={{ fontSize: size === 'sm' ? '0.8rem' : size === 'md' ? '1.5rem' : '3rem' }}>
                {accessoryMap[accessory]}
             </span>
           </div>
        )}
      </motion.div>
    </div>
  );
};

export default BotoAvatar;