
import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Clock, Gift, Shield, Zap, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

const MissionsPage = () => {
  const { missions, user } = useAppData();
  const theme = user.activeTheme;

  // Helper to format time left (static for demo)
  const timeLeft = "14h 32m";

    const getBoosterIcon = (id: string) => {
            if (id === 'double_xp') return <Zap className={`w-6 h-6 ${theme === 'cyber' ? 'text-[#ffb347]' : 'text-yellow-600'}`} />;
            if (id === 'shield') return <Shield className={`w-6 h-6 ${theme === 'cyber' ? 'text-[#00b7ff]' : 'text-blue-600'}`} />;
      return <Gift className="w-6 h-6 text-purple-500" />;
  };

  const containerClasses = {
            cyber: "min-h-screen bg-background text-[#1b2a3a] font-porto px-4 pt-24 pb-24 relative",
      game: "min-h-screen bg-background text-white font-['Press_Start_2P'] px-4 pt-24 pb-24 pixel-scanlines",
      sport: "min-h-screen bg-background text-white font-['Russo_One'] px-4 pt-24 pb-24 uppercase italic relative"
  }[theme];

  const cardClasses = (completed: boolean) => {
      if (theme === 'game') return `p-4 border-4 mb-4 ${completed ? 'bg-[#1b422f] border-[#00ff8c] opacity-60' : 'bg-[#1b0f33] border-[#ff4081]'} shadow-[6px_6px_0px_rgba(0,0,0,0.6)]`;
      if (theme === 'sport') return `p-4 border-l-8 mb-4 -skew-x-12 ${completed ? 'bg-[#16233f] border-[#4caf50] text-slate-400' : 'bg-[#0f1b3a] border-[#ff6347]'} shadow-[0_12px_25px_rgba(0,0,0,0.35)]`;
        return `p-5 rounded-3xl border mb-4 bg-white/95 backdrop-blur transition-all shadow-[0_20px_50px_rgba(12,55,95,0.15)] ${completed ? 'opacity-55 border-[#d0e2f2]' : 'border-[#cadaf0] hover:border-[#6dd7ff]'}`;
  };

  const renderProgressBar = (current: number, total: number) => {
      const pct = Math.min((current / total) * 100, 100);
      
      if (theme === 'game') {
          return (
              <div className="flex space-x-1 mt-3">
                  {Array.from({length: 10}).map((_, i) => (
                      <div key={i} className={`h-3 flex-1 border border-white ${i < pct/10 ? 'bg-green-500' : 'bg-black'}`}></div>
                  ))}
              </div>
          )
      }
      if (theme === 'sport') {
          return (
              <div className="w-full h-4 bg-slate-700 mt-2 skew-x-12 border border-slate-600">
                   <div className="h-full bg-orange-500 skew-x-12" style={{ width: `${pct}%` }}></div>
              </div>
          )
      }
      // Cyber
      return (
          <div className="w-full h-2 bg-[#e3edf7] rounded-full mt-3 overflow-hidden relative border border-[#cadaf0]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6dd7ff] to-[#0077c8]" style={{ width: `${pct}%` }}></div>
          </div>
      )
  };

    return (
        <div className={containerClasses}>
            {theme === 'cyber' && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(0,165,255,0.15), transparent 45%), linear-gradient(160deg, rgba(255,255,255,0.2), transparent)' }}></div>
                </div>
            )}
            {theme === 'sport' && (
                <div className="absolute inset-0 sport-stripe"></div>
            )}
            <div className="max-w-md mx-auto relative z-10">
                <h1 className={`text-3xl font-bold mb-6 ${theme === 'game' ? 'text-[#ffeb3b]' : theme === 'sport' ? 'text-[#ff6347] tracking-[0.3em]' : 'text-[#0f2b44]' }`}>
                        {theme === 'game' ? 'QUEST LOG' : theme === 'sport' ? 'DRILLS DIÁRIAS' : 'PAINEL DE MISSÕES'}
                </h1>
        
        {/* Header Status */}
                <div className={`
                         flex items-center justify-between mb-8 p-4
                         ${theme === 'game' ? 'bg-[#20123b] border-4 border-[#ff4081] shadow-[6px_6px_0px_rgba(0,0,0,0.45)] pixel-scanlines' : 
                             theme === 'sport' ? 'bg-[#0f1b3a] border-b-4 border-[#ffcf4a] -skew-x-12' : 
                             'rounded-2xl border border-[#cadaf0] bg-white/95 backdrop-blur shadow-[0_15px_35px_rgba(12,55,95,0.12)]'}
                `}>
           <div className="flex items-center space-x-3">
                        <Clock className={`w-5 h-5 ${theme === 'cyber' ? 'text-[#00b7ff]' : theme === 'sport' ? 'skew-x-12 text-[#ffcf4a]' : 'text-[#00ff8c]'}`} />
                         <span className={`text-sm ${theme === 'sport' ? 'skew-x-12 tracking-[0.35em]' : ''}`}>{theme === 'game' ? 'RESET TIMER:' : 'RESET:'} {timeLeft}</span>
           </div>
                    <div className={`text-xs px-2 py-1 ${theme === 'game' ? 'bg-black text-[#ffeb3b]' : theme === 'sport' ? 'bg-[#17264a] text-[#ff6347] skew-x-12' : 'bg-[#e6f3ff] text-[#3c5570] rounded-lg border border-[#cadaf0]'}`}>
                         RANK {Math.floor(user.xp / 100)}
           </div>
        </div>

        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id} className={cardClasses(mission.completed)}>
               <div className="flex items-start justify-between">
                   <div className="flex-1">
                            <div className={`flex items-center mb-1 ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                                <h4 className={`font-bold ${mission.completed ? 'line-through decoration-2 text-slate-400' : theme === 'cyber' ? 'text-[#0f2b44]' : 'text-white'}`}>
                                 {mission.title}
                             </h4>
                             {mission.completed && <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />}
                        </div>
                        <p className={`text-xs mb-2 ${theme === 'sport' ? 'skew-x-12 text-slate-400' : theme === 'cyber' ? 'text-[#4d6783] font-sans' : 'text-slate-400 font-sans'}`}>
                            {mission.description}
                        </p>
                   </div>
                                     <div className={`
                                             ml-2 px-2 py-1 text-[10px] font-bold whitespace-nowrap
                                             ${theme === 'game' ? 'bg-black text-[#00ff8c] border border-[#ffeb3b]' : 
                                                 theme === 'sport' ? 'bg-[#ff6347] text-white skew-x-12' : 
                                                 'bg-[#f0f7ff] text-[#0f2b44] border border-[#cadaf0] rounded-xl'}
                                     `}>
                       +{mission.reward.value} {mission.reward.type}
                   </div>
               </div>
               
               {renderProgressBar(mission.current, mission.total)}
               
               <div className={`flex justify-between mt-2 text-[10px] ${theme === 'sport' ? 'skew-x-12 text-[#8ea4ff]' : theme === 'cyber' ? 'text-[#4d6783]' : 'text-slate-500'}`}>
                   <span>PROGRESS</span>
                   <span>{mission.current} / {mission.total}</span>
               </div>
               
               {!mission.completed && (
                    <div className="mt-4">
                            <Button variant="secondary" fullWidth size="sm" className={`${theme === 'cyber' ? 'bg-[#ffd45c] border-[#e3b12a] text-[#1b2a3a] hover:bg-[#ffc938]' : theme === 'game' ? 'bg-black border-[#ff4081] text-[#ffeb3b]' : 'bg-[#16233f] border-[#ff6347] text-white'} opacity-90 hover:opacity-100`}>
                             {theme === 'game' ? 'TRACK' : 'VER'}
                        </Button>
                   </div>
               )}
            </div>
          ))}
        </div>

        <h3 className={`font-bold text-slate-500 text-sm mt-10 mb-6 uppercase tracking-wider ${theme === 'sport' ? 'skew-x-[-12deg] text-white' : theme === 'cyber' ? 'text-[#0f2b44]' : 'text-[#ffeb3b]'}`}>
            {theme === 'game' ? 'BAG' : 'INVENTÁRIO'}
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
            {user.inventory.map((item, idx) => (
                                <div key={idx} className={`
                                        aspect-square flex flex-col items-center justify-center p-2 relative group
                                        ${theme === 'game' ? 'bg-[#1b0f33] border-4 border-[#ff4081] hover:border-[#ffeb3b]' : 
                                            theme === 'sport' ? 'bg-[#0f1b3a] -skew-x-12 border-4 border-[#ff6347]/50 hover:border-[#ffcf4a]' :
                                            'rounded-2xl border border-[#cadaf0] bg-white/90 hover:border-[#6dd7ff] transition-all shadow-[0_12px_30px_rgba(12,55,95,0.12)]'}
                                `}>
                    <div className={theme === 'sport' ? 'skew-x-12' : ''}>
                        {getBoosterIcon(item)}
                    </div>
                    <span className={`text-[9px] mt-2 font-bold uppercase text-center ${theme === 'cyber' ? 'text-[#4d6783] group-hover:text-[#0077c8]' : 'text-slate-300'} ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                        {item.replace('_', ' ')}
                    </span>
                </div>
            ))}
            
            {/* Empty Slot */}
                         <div className={`
                                 aspect-square flex items-center justify-center opacity-30
                                 ${theme === 'game' ? 'border-4 border-dashed border-[#ff4081]' : 
                                     theme === 'sport' ? 'border-4 border-dashed border-[#ff6347] -skew-x-12' :
                                     'border border-dashed border-[#cadaf0] rounded-2xl'}
                         `}>
                 <span className={`text-[9px] text-slate-500 ${theme === 'sport' ? 'skew-x-12' : ''}`}>EMPTY</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;

