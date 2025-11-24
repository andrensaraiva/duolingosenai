
import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

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

  // Base styles per theme
  const themeBaseStyles = {
    cyber: "rounded-xl font-tech tracking-wider border transition-all duration-300 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(var(--primary-color)/0.5)] active:scale-95",
    game: "rounded-none font-['Press_Start_2P'] text-xs border-b-4 border-r-4 border-black active:border-0 active:translate-y-1 active:translate-x-1 transition-none",
    sport: "rounded-sm font-['Russo_One'] transform -skew-x-12 tracking-tight border-b-2 active:skew-x-[-12deg] active:scale-95 transition-transform uppercase"
  };

  // Variants mapping considering themes
  const getVariantStyle = () => {
    // Cyber Styles (Neon & Glass)
    if (theme === 'cyber') {
      switch (variant) {
        case 'primary': return "bg-boto-500/20 border-boto-500 text-boto-500 hover:bg-boto-500 hover:text-slate-900";
        case 'success': return "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500 hover:text-slate-900";
        case 'danger': return "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-slate-900";
        case 'secondary': return "bg-surface border-slate-700 text-slate-300 hover:border-slate-500";
        case 'ghost': return "border-transparent text-slate-400 hover:text-white";
        default: return "";
      }
    }
    
    // Game Styles (Solid & Pixel)
    if (theme === 'game') {
      switch (variant) {
        case 'primary': return "bg-boto-500 text-white border-black hover:brightness-110";
        case 'success': return "bg-green-500 text-white border-black hover:brightness-110";
        case 'danger': return "bg-red-500 text-white border-black hover:brightness-110";
        case 'secondary': return "bg-slate-200 text-slate-900 border-black hover:bg-white";
        case 'ghost': return "bg-transparent border-transparent text-slate-200 hover:text-white border-0 shadow-none";
        default: return "";
      }
    }

    // Sport Styles (Bold & Contrast)
    if (theme === 'sport') {
      switch (variant) {
        case 'primary': return "bg-boto-500 border-boto-700 text-white shadow-lg";
        case 'success': return "bg-green-600 border-green-800 text-white shadow-lg";
        case 'danger': return "bg-red-600 border-red-800 text-white shadow-lg";
        case 'secondary': return "bg-surface border-slate-600 text-slate-200";
        case 'ghost': return "bg-transparent border-transparent text-slate-400 hover:text-white skew-x-0";
        default: return "";
      }
    }
    return "";
  };

  const sizes = {
    sm: "py-1 px-3 text-xs",
    md: "py-3 px-6 text-sm",
    lg: "py-4 px-8 text-base"
  };

  return (
    <button 
      className={`
        ${themeBaseStyles[theme]}
        ${getVariantStyle()} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
        disabled:opacity-50 disabled:pointer-events-none
      `}
      disabled={disabled}
      {...props}
    >
      <span className={theme === 'sport' ? 'block skew-x-12' : ''}>
        {children}
      </span>
      {/* Cyber Glitch Effect on Hover */}
      {theme === 'cyber' && !disabled && variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
      )}
    </button>
  );
};
