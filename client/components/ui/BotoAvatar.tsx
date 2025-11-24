import React from 'react';
import { motion } from 'framer-motion';
import { CharacterCustomization } from '../../types';

interface BotoAvatarProps extends Partial<CharacterCustomization> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'idle' | 'happy' | 'sad';
  className?: string;
}

const BotoAvatar: React.FC<BotoAvatarProps> = ({ 
  color = 'pink', 
  head = 'none', 
  eyes = 'none',
  tail = 'none',
  size = 'md',
  emotion = 'idle',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-64 h-64'
  };

  const colorMap = {
    pink: '#d946ef',
    blue: '#06b6d4',
    purple: '#8b5cf6',
    orange: '#f59e0b'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center select-none`}>
      <motion.div
        animate={emotion === 'happy'
          ? {
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0],
              scale: [1, 1.05, 1],
              filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
            }
          : {
              y: [0, -2, 0],
              rotate: [0, 1, 0],
            }}
        transition={{
          duration: emotion === 'happy' ? 0.5 : 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="w-full h-full relative"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(var(--primary-color)/0.4)]">
          <defs>
            <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: colorMap[color], stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 0.6 }} />
            </linearGradient>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <path
            d="
               M 95,45 
               C 95,43 85,42 80,40   
               C 75,25 65,15 45,15   
               C 25,15 15,35 5,45    
               C 0,55 5,65 15,65     
               Q 10,75 5,80          
               Q 15,75 20,65         
               C 40,75 60,65 75,55   
               C 85,50 95,47 95,45
               Z
            "
            fill={`url(#grad-${color})`}
            stroke={colorMap[color]}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="
               M 95,45 
               C 95,43 85,42 80,40   
               C 75,25 65,15 45,15   
               C 25,15 15,35 5,45    
               C 0,55 5,65 15,65     
               Q 10,75 5,80          
               Q 15,75 20,65         
               C 40,75 60,65 75,55   
               C 85,50 95,47 95,45
               Z
            "
            fill="url(#grid)"
            opacity="0.6"
          />

          <path d="M 40,15 Q 45,5 55,15 Z" fill={colorMap[color]} stroke={colorMap[color]} strokeWidth="1" />

          <path d="M 55,55 Q 50,70 65,65 Q 60,55 55,55 Z" fill={colorMap[color]} stroke={colorMap[color]} opacity="0.8" />

          <circle cx="75" cy="40" r="3.5" fill="#0f172a" stroke={colorMap[color]} strokeWidth="0.5" />

          <motion.circle
            cx="75"
            cy="40"
            r="1.5"
            fill={emotion === 'idle' ? '#10b981' : '#ef4444'}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <path
            d={emotion === 'sad' ? 'M 85,52 Q 90,54 95,52' : 'M 85,50 Q 90,52 95,50'}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="1 1"
            fill="none"
          />

          {head !== 'none' && (
            <g transform="translate(55, 12) scale(0.8)">
              {head === 'crown' && <text x="-10" y="0" fontSize="20">👑</text>}
              {head === 'antenna' && <text x="-10" y="5" fontSize="20">📡</text>}
              {head === 'cap' && <text x="-10" y="5" fontSize="20">🧢</text>}
              {head === 'headphones' && <text x="-15" y="15" fontSize="25">🎧</text>}
            </g>
          )}

          {eyes !== 'none' && (
            <g transform="translate(75, 40) scale(0.6)">
              {eyes === 'sunglasses' && <text x="-20" y="10" fontSize="30">🕶️</text>}
              {eyes === 'visor' && <text x="-20" y="10" fontSize="30">🥽</text>}
              {eyes === 'patch' && <text x="-15" y="10" fontSize="30">🏴‍☠️</text>}
            </g>
          )}

          {tail !== 'none' && (
            <g transform="translate(10, 70) scale(0.5)">
              {tail === 'ribbon' && <text x="-10" y="0" fontSize="30">🎀</text>}
              {tail === 'thruster' && <text x="-10" y="5" fontSize="30">🔥</text>}
              {tail === 'fin-ring' && <circle cx="0" cy="0" r="15" stroke="white" strokeWidth="5" fill="none" opacity="0.7" />}
            </g>
          )}
        </svg>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full"
          />
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 4, delay: 1, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default BotoAvatar;