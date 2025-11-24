
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BookOpen, Map, Target, Terminal, Gamepad2, Trophy, Crosshair } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAppData();
  const theme = user.activeTheme;

  // Choose icons based on theme
  const getIcon = (type: 'hub' | 'arena' | 'ops') => {
    if (theme === 'game') {
      if (type === 'hub') return Map; // RPG Map style
      if (type === 'arena') return Gamepad2;
      if (type === 'ops') return Crosshair;
    }
    if (theme === 'sport') {
      if (type === 'hub') return Trophy;
      if (type === 'arena') return Target;
      if (type === 'ops') return BookOpen; // Strategy book
    }
    // Cyber defaults
    if (type === 'hub') return BookOpen;
    if (type === 'arena') return Terminal;
    return Target;
  };

  const navItems = [
    { path: '/', label: 'HUB', icon: getIcon('hub') },
    { path: '/arena', label: 'ARENA', icon: getIcon('arena') },
    { path: '/missions', label: 'OPS', icon: getIcon('ops') },
  ];

  const containerStyles = {
    cyber: "bg-surface/80 backdrop-blur-lg border-t border-boto-500/30 pb-4 h-20",
    game: "bg-slate-900 border-t-4 border-white pb-2 h-20",
    sport: "bg-slate-900 border-t-4 border-boto-500 pb-4 h-20 skew-y-1 origin-bottom-right"
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${containerStyles[theme]}`}>
      <div className={`flex justify-around items-center h-full max-w-md mx-auto ${theme === 'sport' ? '-skew-y-1' : ''}`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 group relative ${
                isActive ? 'text-boto-500' : 'text-slate-500 hover:text-boto-300'
              }`}
            >
              {/* Background Highlight Logic */}
              {isActive && theme === 'cyber' && (
                <div className="absolute inset-0 bg-boto-500/5 blur-xl"></div>
              )}
              {isActive && theme === 'game' && (
                 <div className="absolute w-12 h-12 bg-white/10 rounded-none border-2 border-white/20"></div>
              )}

              <div className={`p-1.5 transition-all relative z-10 
                ${isActive && theme === 'cyber' ? '-translate-y-2' : ''}
                ${isActive && theme === 'game' ? 'scale-110' : ''}
                ${theme === 'sport' ? '-skew-x-12' : ''}
              `}>
                <Icon size={theme === 'game' ? 20 : 24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Text Label Logic */}
              <span className={`
                text-[10px] mt-1 transition-all duration-300
                ${theme === 'game' ? "font-['Press_Start_2P'] text-[8px]" : "font-mono"}
                ${theme === 'sport' ? "font-['Russo_One'] italic uppercase" : ""}
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              `}>
                {item.label}
              </span>

              {/* Active Indicators */}
              {isActive && theme === 'cyber' && (
                <div className="absolute bottom-2 w-1 h-1 bg-boto-500 rounded-full shadow-[0_0_5px_cyan]"></div>
              )}
              {isActive && theme === 'sport' && (
                <div className="absolute top-0 w-full h-1 bg-boto-500"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
