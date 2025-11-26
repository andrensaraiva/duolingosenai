
import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const themeStyles = {
  cyber: {
    base: 'relative rounded-2xl font-porto font-semibold tracking-wide overflow-hidden transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-none',
    variants: {
      primary: 'bg-[#FFCA28] text-[#BF360C] border-b-4 border-r-4 border-[#FF6F00] hover:brightness-110',
      secondary: 'bg-[#8D6E63] text-[#FFECB3] border-b-4 border-r-4 border-[#5D4037] hover:brightness-105',
      success: 'bg-[#66BB6A] text-[#1B5E20] border-b-4 border-r-4 border-[#2E7D32]',
      danger: 'bg-[#EF5350] text-white border-b-4 border-r-4 border-[#C62828]',
      ghost: 'bg-transparent text-[#3E2723] hover:text-[#BF360C] shadow-none',
    },
  },
  game: {
    base: 'font-["Press_Start_2P"] text-[10px] uppercase tracking-[0.25em] rounded-none border-4 border-black pixel-shadow transition-none active:translate-y-1 active:translate-x-1 active:shadow-none',
    variants: {
      primary: 'bg-[#00FF99] text-black',
      secondary: 'bg-[#FF00FF] text-white',
      success: 'bg-[#69F0AE] text-black',
      danger: 'bg-[#FF4081] text-white',
      ghost: 'bg-black text-[#00FF99] hover:text-white',
    },
  },
  sport: {
    base: 'relative font-["Russo_One"] uppercase tracking-[0.18em] sport-skew transition-transform duration-200 shadow-[0_12px_25px_rgba(0,0,0,0.25)] active:scale-95',
    variants: {
      primary: 'bg-[#FF5252] text-white border-l-[12px] border-[#B71C1C]',
      secondary: 'bg-[#2979FF] text-white border-l-[12px] border-[#0D47A1]',
      success: 'bg-[#26C6DA] text-[#0D47A1] border-l-[12px] border-[#00838F]',
      danger: 'bg-[#FF7043] text-white border-l-[12px] border-[#BF360C]',
      ghost: 'bg-transparent text-[#1A237E] border border-[#1A237E]/40 backdrop-blur-sm',
    },
  },
} as const;

const sizeClasses = {
  sm: 'py-2 px-4 text-xs',
  md: 'py-3 px-6 text-sm',
  lg: 'py-4 px-8 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const { user } = useAppData();
  const theme = user.activeTheme;

  const themeConfig = themeStyles[theme];
  const composedClassName = [
    themeConfig.base,
    themeConfig.variants[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
    'disabled:opacity-50 disabled:pointer-events-none',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={composedClassName} disabled={disabled} {...props}>
      <span className={theme === 'sport' ? 'block skew-x-12' : ''}>{children}</span>
    </button>
  );
};
