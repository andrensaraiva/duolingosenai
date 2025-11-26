
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
      if (id === 'double_xp') return <Zap className={`w-6 h-6 ${theme === 'cyber' ? 'text-yellow-400 drop-shadow-[0_0_10px_gold]' : 'text-yellow-600'}`} />;
      if (id === 'shield') return <Shield className={`w-6 h-6 ${theme === 'cyber' ? 'text-boto-400 drop-shadow-[0_0_10px_cyan]' : 'text-blue-600'}`} />;
      return <Gift className="w-6 h-6 text-purple-500" />;
  };

  const containerClasses = {
      cyber: "min-h-screen bg-background text-[#3E2723] font-porto px-4 pt-24 pb-24 relative",
      game: "min-h-screen bg-background text-white font-['Press_Start_2P'] px-4 pt-24 pb-24 pixel-scanlines",
      sport: "min-h-screen bg-background text-white font-['Russo_One'] px-4 pt-24 pb-24 uppercase italic relative"
  }[theme];

  const cardClasses = (completed: boolean) => {
      if (theme === 'game') return `p-4 border-4 mb-4 ${completed ? 'bg-[#1b422f] border-[#00ff8c] opacity-60' : 'bg-[#1b0f33] border-[#ff4081]'} shadow-[6px_6px_0px_rgba(0,0,0,0.6)]`;
      if (theme === 'sport') return `p-4 border-l-8 mb-4 -skew-x-12 ${completed ? 'bg-[#16233f] border-[#4caf50] text-slate-400' : 'bg-[#0f1b3a] border-[#ff6347]'} shadow-[0_12px_25px_rgba(0,0,0,0.35)]`;
    return `p-5 rounded-3xl border-4 mb-4 porto-panel transition-all ${completed ? 'opacity-55 border-[#BCAAA4]' : 'border-[#5D4037] hover:border-[#FFCA28]'}`;
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
          <div className="w-full h-1.5 bg-[#D7CCC8] rounded-full mt-3 overflow-hidden relative border border-[#8D6E63]/40">
              <div className="absolute inset-0 bg-[#FFCA28] shadow-[0_0_10px_rgba(255,202,40,0.45)]" style={{ width: `${pct}%` }}></div>
          </div>
      )
  };

    return (
        <div className={containerClasses}>
            {theme === 'cyber' && (
                <div className="porto-wave-container">
                    <div className="porto-wave"></div>
                </div>
            )}
            {theme === 'sport' && (
                <div className="absolute inset-0 sport-stripe"></div>
            )}
            <div className="max-w-md mx-auto relative z-10">
                <h1 className={`text-3xl font-bold mb-6 ${theme === 'game' ? 'text-[#ffeb3b]' : theme === 'sport' ? 'text-[#ff6347] tracking-[0.3em]' : 'text-[#BF360C]' }`}>
                        {theme === 'game' ? 'QUEST LOG' : theme === 'sport' ? 'DRILLS DIÁRIAS' : 'PAINEL DE MISSÕES'}
                </h1>
        
        {/* Header Status */}
                <div className={`
                         flex items-center justify-between mb-8 p-4
                         ${theme === 'game' ? 'bg-[#20123b] border-4 border-[#ff4081] shadow-[6px_6px_0px_rgba(0,0,0,0.45)] pixel-scanlines' : 
                             theme === 'sport' ? 'bg-[#0f1b3a] border-b-4 border-[#ffcf4a] -skew-x-12' : 
                             'porto-panel border-4 border-[#5D4037] rounded-2xl'}
                `}>
           <div className="flex items-center space-x-3">
                         <Clock className={`w-5 h-5 ${theme === 'cyber' ? 'text-[#BF360C]' : theme === 'sport' ? 'skew-x-12 text-[#ffcf4a]' : 'text-[#00ff8c]'}`} />
                         <span className={`text-sm ${theme === 'sport' ? 'skew-x-12 tracking-[0.35em]' : ''}`}>{theme === 'game' ? 'RESET TIMER:' : 'RESET:'} {timeLeft}</span>
           </div>
                     <div className={`text-xs px-2 py-1 ${theme === 'game' ? 'bg-black text-[#ffeb3b]' : theme === 'sport' ? 'bg-[#17264a] text-[#ff6347] skew-x-12' : 'bg-[#8D6E63] text-[#FFECB3] rounded-lg border border-[#5D4037]'}`}>
                         RANK {Math.floor(user.xp / 100)}
           </div>
        </div>

        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id} className={cardClasses(mission.completed)}>
               <div className="flex items-start justify-between">
                   <div className="flex-1">
                            <div className={`flex items-center mb-1 ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                                <h4 className={`font-bold ${mission.completed ? 'line-through decoration-2 text-slate-400' : theme === 'cyber' ? 'text-[#3E2723]' : 'text-white'}`}>
                                 {mission.title}
                             </h4>
                             {mission.completed && <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />}
                        </div>
                        <p className={`text-xs mb-2 ${theme === 'sport' ? 'skew-x-12 text-slate-400' : theme === 'cyber' ? 'text-[#5D4037] font-sans' : 'text-slate-400 font-sans'}`}>
                            {mission.description}
                        </p>
                   </div>
                                     <div className={`
                                             ml-2 px-2 py-1 text-[10px] font-bold whitespace-nowrap
                                             ${theme === 'game' ? 'bg-black text-[#00ff8c] border border-[#ffeb3b]' : 
                                                 theme === 'sport' ? 'bg-[#ff6347] text-white skew-x-12' : 
                                                 'bg-[#8D6E63] text-[#FFECB3] border border-[#5D4037] rounded-lg'}
                                     `}>
                       +{mission.reward.value} {mission.reward.type}
                   </div>
               </div>
               
               {renderProgressBar(mission.current, mission.total)}
               
               <div className={`flex justify-between mt-2 text-[10px] ${theme === 'sport' ? 'skew-x-12 text-[#8ea4ff]' : theme === 'cyber' ? 'text-[#5D4037]' : 'text-slate-500'}`}>
                   <span>PROGRESS</span>
                   <span>{mission.current} / {mission.total}</span>
               </div>
               
               {!mission.completed && (
                    <div className="mt-4">
                        <Button variant="secondary" fullWidth size="sm" className={`${theme === 'cyber' ? 'bg-[#8D6E63] border-[#5D4037] text-[#FFECB3]' : theme === 'game' ? 'bg-black border-[#ff4081] text-[#ffeb3b]' : 'bg-[#16233f] border-[#ff6347] text-white'} opacity-80 hover:opacity-100`}>
                             {theme === 'game' ? 'TRACK' : 'VER'}
                        </Button>
                   </div>
               )}
            </div>
          ))}
        </div>

        <h3 className={`font-bold text-slate-500 text-sm mt-10 mb-6 uppercase tracking-wider ${theme === 'sport' ? 'skew-x-[-12deg] text-white' : theme === 'cyber' ? 'text-[#BF360C]' : 'text-[#ffeb3b]'}`}>
            {theme === 'game' ? 'BAG' : 'INVENTÁRIO'}
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
            {user.inventory.map((item, idx) => (
                                <div key={idx} className={`
                                        aspect-square flex flex-col items-center justify-center p-2 relative group
                                        ${theme === 'game' ? 'bg-[#1b0f33] border-4 border-[#ff4081] hover:border-[#ffeb3b]' : 
                                            theme === 'sport' ? 'bg-[#0f1b3a] -skew-x-12 border-4 border-[#ff6347]/50 hover:border-[#ffcf4a]' :
                                            'porto-panel border-4 border-[#5D4037] rounded-2xl hover:border-[#FFCA28] transition-all'}
                                `}>
                    <div className={theme === 'sport' ? 'skew-x-12' : ''}>
                        {getBoosterIcon(item)}
                    </div>
                    <span className={`text-[9px] mt-2 font-bold uppercase text-center ${theme === 'cyber' ? 'text-[#5D4037] group-hover:text-[#BF360C]' : 'text-slate-300'} ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                        {item.replace('_', ' ')}
                    </span>
                </div>
            ))}
            
            {/* Empty Slot */}
                         <div className={`
                                 aspect-square flex items-center justify-center opacity-30
                                 ${theme === 'game' ? 'border-4 border-dashed border-[#ff4081]' : 
                                     theme === 'sport' ? 'border-4 border-dashed border-[#ff6347] -skew-x-12' :
                                     'border-4 border-dashed border-[#5D4037] rounded-2xl'}
                         `}>
                 <span className={`text-[9px] text-slate-500 ${theme === 'sport' ? 'skew-x-12' : ''}`}>EMPTY</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;

