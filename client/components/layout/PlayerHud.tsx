
import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { Heart, Zap, Coins } from 'lucide-react';

const PlayerHud = () => {
  const { user } = useAppData();
  const theme = user.activeTheme;

  // --- THEME 1: CYBER (Minimalist, Glass, Top Bar) ---
  if (theme === 'cyber') {
    return (
      <header className="fixed top-0 left-0 right-0 bg-surface/50 backdrop-blur-md z-40 border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-between items-center font-tech">
          <div className="flex items-center space-x-2 text-boto-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
            <Zap className="w-4 h-4 fill-current animate-pulse" />
            <span className="font-bold text-sm">{user.streak} <span className="text-[10px] opacity-60">STRK</span></span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300 bg-black/20 px-3 py-0.5 rounded-full border border-white/5">
            <Coins className="w-3 h-3 text-yellow-400" />
            <span className="font-bold text-xs">{user.coins}</span>
          </div>

          <div className="flex items-center space-x-1 text-tech-pink">
            {Array.from({length: user.maxHearts}).map((_, i) => (
               <div key={i} className={`h-2 w-4 skew-x-[-12deg] ${i < user.hearts ? 'bg-tech-pink shadow-[0_0_5px_currentColor]' : 'bg-slate-700/50'}`}></div>
            ))}
          </div>
        </div>
      </header>
    );
  }

  // --- THEME 2: GAME (RPG Style, Boxy, Pixel Font) ---
  if (theme === 'game') {
    return (
      <header className="fixed top-4 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none">
        <div className="flex justify-between items-start font-['Press_Start_2P'] text-[10px]">
          {/* HP Bar */}
          <div className="bg-slate-900 border-2 border-white p-2 text-white shadow-[4px_4px_0px_black]">
             <div className="mb-1 text-red-500">HP</div>
             <div className="flex space-x-1">
               {Array.from({length: user.maxHearts}).map((_, i) => (
                  <div key={i} className={`w-3 h-3 ${i < user.hearts ? 'bg-red-500' : 'bg-slate-700'}`}></div>
               ))}
             </div>
          </div>

          {/* Stats Box */}
          <div className="flex flex-col space-y-2 items-end">
             <div className="bg-slate-900 border-2 border-white px-2 py-1 text-yellow-400 shadow-[4px_4px_0px_black] flex items-center space-x-2">
                <span>$ {user.coins}</span>
             </div>
             <div className="bg-slate-900 border-2 border-white px-2 py-1 text-blue-400 shadow-[4px_4px_0px_black] flex items-center space-x-2">
                <span>LVL {Math.floor(user.xp / 100)}</span>
             </div>
          </div>
        </div>
      </header>
    );
  }

  // --- THEME 3: SPORT (Scoreboard, Slanted, Bold) ---
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 z-40 border-b-4 border-boto-500 shadow-lg">
      <div className="max-w-md mx-auto flex justify-between items-stretch h-14 font-['Russo_One'] text-white">
         
         <div className="flex items-center px-4 bg-slate-800 -skew-x-12 border-r border-slate-700">
            <span className="skew-x-12 text-2xl text-orange-500">{user.streak}</span>
            <span className="skew-x-12 text-[10px] ml-1 text-slate-400 mt-2">WINS</span>
         </div>

         <div className="flex-1 flex items-center justify-center">
             <div className="bg-black px-4 py-1 rounded border border-slate-700 flex items-center space-x-3">
                 <span className="text-yellow-500 text-lg tracking-widest">{user.coins.toString().padStart(4, '0')}</span>
             </div>
         </div>

         <div className="flex items-center px-4 bg-slate-800 -skew-x-12 border-l border-slate-700 text-red-500">
            <Heart className="w-6 h-6 skew-x-12 fill-current" />
            <span className="skew-x-12 text-xl ml-2">{user.hearts}</span>
         </div>
      </div>
    </header>
  );
};

export default PlayerHud;


