
import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { Heart, Zap, Coins } from 'lucide-react';

const PlayerHud = () => {
  const { user } = useAppData();
  const theme = user.activeTheme;

  // --- THEME 1: PORTO (madeira e mar) ---
  if (theme === 'cyber') {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pt-4 px-4 pointer-events-auto">
          <div className="relative h-16 rounded-2xl border-4 border-[#5D4037] porto-panel flex items-center justify-between px-4 text-[#3E2723] shadow-[0_12px_30px_rgba(93,64,55,0.35)]">
            <span className="porto-rivet absolute left-3 top-3"></span>
            <span className="porto-rivet absolute right-3 top-3"></span>
            <span className="porto-rivet absolute left-3 bottom-3"></span>
            <span className="porto-rivet absolute right-3 bottom-3"></span>

            <div className="flex items-center gap-3">
              <div className="bg-[#F5E6DE] border border-[#8D6E63] rounded-lg px-3 py-1 flex items-center gap-2 shadow-inner">
                <Zap className="w-4 h-4 text-[#BF360C]" />
                <span className="font-semibold text-sm tracking-wide">{user.streak}º DIA</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#F5E6DE] border border-[#8D6E63] rounded-xl px-3 py-1 shadow-inner">
                <Coins className="w-4 h-4 text-[#BF360C]" />
                <span className="font-bold text-base">{user.coins}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#F5E6DE] border border-[#8D6E63] rounded-xl px-3 py-1 shadow-inner">
                {Array.from({ length: user.maxHearts }).map((_, index) => (
                  <Heart
                    key={index}
                    className={`w-3.5 h-3.5 ${index < user.hearts ? 'text-[#EF5350] fill-[#EF5350]' : 'text-[#BCAAA4]'} transition-colors`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // --- THEME 2: GAMES (Pixel Art) ---
  if (theme === 'game') {
    return (
      <header className="fixed top-4 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none">
        <div className="flex justify-between items-start font-['Press_Start_2P'] text-[10px] text-white">
          <div className="relative pixel-frame bg-[#20123b] p-3 pr-4 pointer-events-auto">
            <div className="text-[#ffeb3b] mb-2">HP</div>
            <div className="flex space-x-1">
              {Array.from({ length: user.maxHearts }).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 ${index < user.hearts ? 'bg-[#ff4f9a]' : 'bg-[#2c1f4c]'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="pixel-frame bg-[#1b0f33] px-3 py-2 text-[#00ff8c]">
              <span>COINS</span>
              <div className="text-xs mt-1">{user.coins}</div>
            </div>
            <div className="pixel-frame bg-[#1b0f33] px-3 py-2 text-[#ff4f9a]">
              <span>STREAK</span>
              <div className="text-xs mt-1">{user.streak}</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // --- THEME 3: ESPORTES (placar) ---
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a142d] border-b-4 border-[#ff6347] shadow-[0_10px_35px_rgba(0,0,0,0.4)] sport-stripe">
      <div className="relative max-w-md mx-auto flex justify-between items-center h-16 font-['Russo_One'] text-white px-4">
        <div className="flex items-center gap-3">
          <div className="sport-glass rounded-md px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-[#8ea4ff]">STREAK</span>
            <span className="text-2xl text-[#ffcf4a] leading-none">{user.streak}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[10px] tracking-[0.4em] text-[#8ea4ff]">SCORE</div>
          <div className="text-2xl tracking-widest text-[#ff6347]">{user.coins.toString().padStart(4, '0')}</div>
        </div>

        <div className="sport-glass rounded-md px-3 py-2 flex items-center gap-2 text-[#ff7f7f]">
          <Heart className="w-5 h-5 fill-current" />
          <span className="text-xl">{user.hearts}</span>
        </div>
      </div>
    </header>
  );
};

export default PlayerHud;


