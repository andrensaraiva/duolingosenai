import React from 'react';
import { CharacterCustomization } from '../../types';

interface BotoAvatarProps extends Partial<CharacterCustomization> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'idle' | 'happy' | 'sad';
  className?: string;
}

const sizeMap: Record<NonNullable<BotoAvatarProps['size']>, string> = {
  sm: 'w-16 h-16',
  md: 'w-32 h-32',
  lg: 'w-44 h-44',
  xl: 'w-64 h-64',
};

const colorMap: Record<NonNullable<CharacterCustomization['color']>, string> = {
  pink: '#F48FB1',
  blue: '#4FC3F7',
  purple: '#CE93D8',
  orange: '#FFB74D',
};

const BotoAvatar: React.FC<BotoAvatarProps> = ({
  color = 'pink',
  head = 'none',
  eyes = 'none',
  tail = 'none',
  emotion = 'happy',
  size = 'md',
  className = '',
}) => {
  const bodyColor = colorMap[color];
  const strokeColor = '#1c2c3d';
  const accentColor = '#6dd7ff';
  const finFill = '#ffe0eb';

  const renderMouth = () => {
    if (emotion === 'sad') {
      return <path d="M100 132 Q110 120 122 132" stroke={strokeColor} strokeWidth={4} strokeLinecap="round" fill="none" />;
    }
    if (emotion === 'idle') {
      return <line x1={100} y1={130} x2={122} y2={130} stroke={strokeColor} strokeWidth={4} strokeLinecap="round" />;
    }
    return <path d="M95 128 Q110 140 128 127" stroke={strokeColor} strokeWidth={4} strokeLinecap="round" fill="none" />;
  };

  const headAccessories: Record<CharacterCustomization['head'], React.ReactNode> = {
    none: null,
    antenna: (
      <g>
        <line x1={112} y1={44} x2={112} y2={20} stroke={strokeColor} strokeWidth={4} strokeLinecap="round" />
        <circle cx={112} cy={14} r={6} fill={accentColor} stroke={strokeColor} strokeWidth={2} />
      </g>
    ),
    crown: (
      <path
        d="M82 52 L92 28 L106 38 L120 26 L132 48 L82 48 Z"
        fill={accentColor}
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    ),
    headphones: (
      <g>
        <path d="M72 88 C72 58 140 58 140 88" stroke={strokeColor} strokeWidth={10} strokeLinecap="round" />
        <rect x={64} y={88} width={16} height={36} rx={6} fill="#7c90a8" />
        <rect x={140} y={88} width={16} height={36} rx={6} fill="#7c90a8" />
      </g>
    ),
    cap: (
      <path d="M86 56 C88 34 146 30 160 54 L160 70 C134 60 108 60 86 70 Z" fill="#2979FF" stroke="#0D47A1" strokeWidth={4} />
    ),
  };

  const eyeVariants: Record<CharacterCustomization['eyes'], React.ReactNode> = {
    none: (
      <>
        <circle cx={104} cy={102} r={8} fill={strokeColor} />
        <circle cx={132} cy={100} r={8} fill={strokeColor} />
      </>
    ),
    sunglasses: (
      <g>
        <rect x={92} y={92} width={48} height={16} rx={6} fill="#212121" stroke="#00FF99" strokeWidth={3} />
        <line x1={80} y1={100} x2={92} y2={100} stroke="#212121" strokeWidth={4} strokeLinecap="round" />
        <line x1={140} y1={100} x2={156} y2={100} stroke="#212121" strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
    visor: (
      <g>
        <rect x={92} y={92} width={48} height={16} rx={8} fill="#1B5E20" stroke="#66BB6A" strokeWidth={3} />
        <rect x={96} y={96} width={40} height={8} rx={3} fill="#A5D6A7" opacity={0.7} />
      </g>
    ),
    patch: (
      <g>
        <circle cx={128} cy={100} r={12} fill="#212121" stroke={strokeColor} strokeWidth={3} />
        <line x1={116} y1={88} x2={92} y2={72} stroke={strokeColor} strokeWidth={4} strokeLinecap="round" />
        <line x1={138} y1={112} x2={160} y2={128} stroke={strokeColor} strokeWidth={4} strokeLinecap="round" />
        <circle cx={96} cy={102} r={8} fill={strokeColor} />
      </g>
    ),
  };

  const tailVariants: Record<CharacterCustomization['tail'], React.ReactNode> = {
    none: null,
    'fin-ring': (
      <g>
        <circle cx={34} cy={142} r={16} stroke={accentColor} strokeWidth={5} fill="none" opacity={0.7} />
        <circle cx={34} cy={142} r={8} fill={accentColor} opacity={0.25} />
      </g>
    ),
    thruster: (
      <g>
        <ellipse cx={40} cy={152} rx={12} ry={18} fill="#37474F" stroke="#263238" strokeWidth={4} />
        <path d="M34 168 Q40 196 46 168" fill="#FF7043" opacity={0.7} />
      </g>
    ),
    ribbon: (
      <path d="M30 134 Q12 152 32 170 Q52 152 36 134" fill="#F06292" stroke="#AD1457" strokeWidth={3} />
    ),
  };

  const defaultTail = (
    <g>
      <path
        d="M96 150 C62 128 16 150 20 196 C22 222 58 236 92 214 C106 204 116 188 110 168 C106 160 102 154 96 150 Z"
        fill={finFill}
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M70 162 C40 156 24 178 30 204"
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );

  return (
    <div className={`relative ${sizeMap[size]} ${className} select-none`}
      style={{ animation: emotion === 'happy' ? 'floaty 4s ease-in-out infinite' : 'floaty 6s ease-in-out infinite' }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_12px_25px_rgba(0,0,0,0.18)]" role="img">
        <defs>
          <radialGradient id="boto-glow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor={bodyColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ambient-circle" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="tech-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <circle cx={110} cy={122} r={96} fill="url(#ambient-circle)" />
        <circle cx={110} cy={122} r={84} fill="url(#boto-glow)" opacity={0.3} />
        <circle cx={110} cy={122} r={100} stroke="url(#tech-edge)" strokeWidth={2} fill="none" opacity={0.5} />

        {/* Tail */}
        {tail === 'none' && defaultTail}
        {tailVariants[tail]}

        {/* Body */}
        <path
          d="M72 146 C60 118 64 70 98 48 C136 24 182 42 192 78 C202 112 178 150 148 172 C120 192 84 184 72 146 Z"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* Belly */}
        <path d="M104 154 C142 162 170 140 168 122 C166 104 142 92 122 98" fill="#FFFFFF" opacity={0.55} />

        {/* Fins */}
        <path
          d="M156 148 C188 134 216 158 204 184 C192 210 150 194 138 170"
          fill={finFill}
          stroke={strokeColor}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* Head accessories */}
        <g transform="translate(0,0)">{headAccessories[head]}</g>

        {/* Eyes */}
        {eyeVariants[eyes]}

        {/* Cheeks */}
        <circle cx={96} cy={120} r={10} fill="#FFB6C1" opacity={0.7} />
        <circle cx={140} cy={118} r={10} fill="#FFB6C1" opacity={0.7} />

        {/* Mouth */}
        {renderMouth()}

        {/* Sparkles */}
        <circle cx={80} cy={84} r={4} fill={accentColor} opacity={0.45} />
        <circle cx={148} cy={74} r={3} fill={accentColor} opacity={0.35} />
      </svg>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default BotoAvatar;