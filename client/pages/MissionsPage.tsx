
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
      cyber: "min-h-screen bg-background text-slate-100 font-tech px-4 pt-24 pb-24",
      game: "min-h-screen bg-black text-white font-['Press_Start_2P'] px-4 pt-24 pb-24 image-pixelated",
      sport: "min-h-screen bg-slate-900 text-white font-['Russo_One'] px-4 pt-24 pb-24 uppercase italic"
  }[theme];

  const cardClasses = (completed: boolean) => {
      if (theme === 'game') return `p-4 border-4 mb-4 ${completed ? 'bg-green-900 border-green-500 opacity-50' : 'bg-slate-900 border-white'} shadow-[4px_4px_0px_black]`;
      if (theme === 'sport') return `p-4 border-l-4 mb-4 -skew-x-12 ${completed ? 'bg-slate-800/50 border-green-500 text-slate-500' : 'bg-slate-800 border-orange-500'}`;
      return `p-5 rounded-xl border mb-4 backdrop-blur-sm transition-all ${completed ? 'bg-surface/30 border-white/5 opacity-60' : 'bg-surface/60 border-white/10 hover:border-boto-500/50'}`;
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
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden relative">
              <div className="absolute inset-0 bg-boto-500 shadow-[0_0_10px_cyan]" style={{ width: `${pct}%` }}></div>
          </div>
      )
  };

  return (
    <div className={containerClasses}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-boto-500">
            {theme === 'game' ? 'QUEST LOG' : theme === 'sport' ? 'DAILY DRILLS' : 'OPS DASHBOARD'}
        </h1>
        
        {/* Header Status */}
        <div className={`
             flex items-center justify-between mb-8 p-4
             ${theme === 'game' ? 'bg-blue-900 border-4 border-white shadow-[6px_6px_0px_rgba(0,0,0,0.5)]' : 
               theme === 'sport' ? 'bg-slate-800 border-b-4 border-boto-500' : 
               'bg-surface border border-boto-500/20 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.1)]'}
        `}>
           <div className="flex items-center space-x-3">
             <Clock className={`w-5 h-5 ${theme === 'cyber' ? 'text-boto-400' : ''}`} />
             <span className="text-sm">{theme === 'game' ? 'RESET TIMER:' : 'RESET:'} {timeLeft}</span>
           </div>
           <div className={`text-xs px-2 py-1 ${theme === 'game' ? 'bg-black text-yellow-500' : 'bg-white/10 rounded'}`}>
             Rank {Math.floor(user.xp / 100)}
           </div>
        </div>

        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id} className={cardClasses(mission.completed)}>
               <div className="flex items-start justify-between">
                   <div className="flex-1">
                        <div className={`flex items-center mb-1 ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                             <h4 className={`font-bold ${mission.completed ? 'line-through decoration-2' : 'text-white'}`}>
                                 {mission.title}
                             </h4>
                             {mission.completed && <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />}
                        </div>
                        <p className={`text-xs mb-2 ${theme === 'sport' ? 'skew-x-12 text-slate-400' : 'text-slate-400 font-sans'}`}>
                            {mission.description}
                        </p>
                   </div>
                   <div className={`
                       ml-2 px-2 py-1 text-[10px] font-bold whitespace-nowrap
                       ${theme === 'game' ? 'bg-black text-green-400 border border-white' : 
                         theme === 'sport' ? 'bg-orange-600 text-white skew-x-12' : 
                         'bg-boto-500/10 text-boto-400 border border-boto-500/30 rounded'}
                   `}>
                       +{mission.reward.value} {mission.reward.type}
                   </div>
               </div>
               
               {renderProgressBar(mission.current, mission.total)}
               
               <div className={`flex justify-between mt-2 text-[10px] ${theme === 'sport' ? 'skew-x-12' : ''} text-slate-500`}>
                   <span>PROGRESS</span>
                   <span>{mission.current} / {mission.total}</span>
               </div>
               
               {!mission.completed && (
                   <div className="mt-4">
                        <Button variant="secondary" fullWidth size="sm" className="opacity-80 hover:opacity-100">
                             {theme === 'game' ? 'TRACK' : 'DETAILS'}
                        </Button>
                   </div>
               )}
            </div>
          ))}
        </div>

        <h3 className={`font-bold text-slate-500 text-sm mt-10 mb-6 uppercase tracking-wider ${theme === 'sport' ? 'skew-x-[-12deg]' : ''}`}>
            {theme === 'game' ? 'BAG' : 'INVENTORY'}
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
            {user.inventory.map((item, idx) => (
                <div key={idx} className={`
                    aspect-square flex flex-col items-center justify-center p-2 relative group
                    ${theme === 'game' ? 'bg-slate-900 border-4 border-slate-700 hover:border-white' : 
                      theme === 'sport' ? 'bg-slate-800 -skew-x-12 border-2 border-slate-700 hover:border-orange-500' :
                      'bg-surface border border-white/10 rounded-xl hover:bg-white/5 hover:border-boto-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all'}
                `}>
                    <div className={theme === 'sport' ? 'skew-x-12' : ''}>
                        {getBoosterIcon(item)}
                    </div>
                    <span className={`text-[9px] mt-2 font-bold uppercase text-center ${theme === 'cyber' ? 'text-slate-400 group-hover:text-white' : 'text-slate-500'} ${theme === 'sport' ? 'skew-x-12' : ''}`}>
                        {item.replace('_', ' ')}
                    </span>
                </div>
            ))}
            
            {/* Empty Slot */}
             <div className={`
                 aspect-square flex items-center justify-center opacity-30
                 ${theme === 'game' ? 'border-4 border-dashed border-slate-700' : 
                   theme === 'sport' ? 'border-2 border-dashed border-slate-600 -skew-x-12' :
                   'border border-dashed border-slate-700 rounded-xl'}
             `}>
                 <span className={`text-[9px] text-slate-500 ${theme === 'sport' ? 'skew-x-12' : ''}`}>EMPTY</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;

