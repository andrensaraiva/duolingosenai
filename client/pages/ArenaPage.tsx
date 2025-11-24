
import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { Terminal, Cpu, Play, Crosshair, Trophy, Swords } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ArenaPage = () => {
  const { challenges, user } = useAppData();
  const navigate = useNavigate();
  const theme = user.activeTheme;

  // --- Theme Specific Styles ---
  
  const pageContainerClass = {
    cyber: "min-h-screen bg-background text-slate-100 font-tech px-4 pt-24 pb-24 relative overflow-hidden",
    game: "min-h-screen bg-black text-white font-['Press_Start_2P'] px-4 pt-24 pb-24 relative image-pixelated",
    sport: "min-h-screen bg-slate-900 text-white font-['Russo_One'] px-4 pt-24 pb-24 relative uppercase italic"
  }[theme];

  const headerCardClass = {
    cyber: "bg-surface/50 backdrop-blur-md border border-boto-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-8 relative overflow-hidden",
    game: "bg-purple-900 border-4 border-white p-6 shadow-[8px_8px_0px_black] mb-8 relative",
    sport: "bg-slate-800 border-l-8 border-orange-500 p-6 -skew-x-6 mb-8 relative"
  }[theme];

  const challengeCardClass = () => {
    if (theme === 'game') {
      return "bg-slate-800 border-4 border-slate-600 p-4 mb-4 hover:border-white transition-none active:translate-y-1 shadow-[4px_4px_0px_black]";
    }
    if (theme === 'sport') {
      return "bg-slate-800 border-r-4 border-slate-600 p-4 mb-4 -skew-x-12 hover:bg-slate-700 hover:border-orange-500 transition-colors";
    }
    // Cyber
    return "bg-surface/80 border border-white/5 p-4 mb-4 rounded-xl hover:border-boto-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group";
  };

  const DifficultyBadge = ({ level }: { level: string }) => {
    if (theme === 'game') {
      return <span className="text-[10px] text-yellow-400 bg-black px-2 py-1 border border-white">LVL.{level === 'Easy' ? 1 : level === 'Medium' ? 5 : 10}</span>
    }
    if (theme === 'sport') {
       return <span className="text-xs bg-white text-slate-900 px-3 py-0.5 skew-x-12 font-bold">{level} LEAGUE</span>
    }
    const colors = level === 'Easy' ? 'text-green-400 border-green-500/30 bg-green-500/10' : level === 'Medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10';
    return <span className={`text-xs px-2 py-0.5 rounded border ${colors}`}>{level}</span>
  }

  return (
    <div className={pageContainerClass}>
      {/* Background Ambience */}
      {theme === 'cyber' && <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-boto-900/20 via-transparent to-transparent pointer-events-none"></div>}
      
      <div className="max-w-md mx-auto relative z-10">
        
        {/* Header Section */}
        <div className={headerCardClass}>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 text-boto-500">
               {theme === 'game' ? 'CHALLENGE STAGE' : theme === 'sport' ? 'TRAINING GROUND' : 'CODE ARENA'}
            </h1>
            <p className="opacity-80 text-sm mb-4">
              {theme === 'game' ? 'INSERT COIN TO FARM XP' : 'SIMULATE & DOMINATE'}
            </p>
            
            <div className={`flex items-center space-x-2 w-fit px-3 py-1 rounded ${theme === 'game' ? 'bg-black border border-white' : theme === 'sport' ? 'bg-orange-600 -skew-x-12' : 'bg-boto-500/10 border border-boto-500/30'}`}>
               <Cpu className={`w-4 h-4 ${theme === 'cyber' ? 'animate-pulse text-boto-400' : ''}`} />
               <span className="text-xs font-bold">
                 FARMING: {theme === 'game' ? 'ON' : 'ACTIVE'} <span className="opacity-60">24/h</span>
               </span>
            </div>
          </div>
          
          {/* Decorative Icon */}
          <div className="absolute -bottom-4 -right-4 opacity-10">
             {theme === 'game' ? <Swords size={100} /> : theme === 'sport' ? <Trophy size={100} /> : <Terminal size={100} />}
          </div>
        </div>

        <h3 className={`font-bold text-slate-400 text-sm mb-6 uppercase tracking-wider ${theme === 'sport' ? 'skew-x-[-12deg]' : ''}`}>
           {theme === 'game' ? 'SELECT LEVEL' : 'AVAILABLE SIMULATIONS'}
        </h3>

        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className={challengeCardClass()}>
              <div className="flex justify-between items-start mb-2">
                <DifficultyBadge level={challenge.difficulty} />
                {challenge.bestScore && (
                  <span className={`text-xs font-bold ${theme === 'cyber' ? 'text-slate-500 font-mono' : 'text-slate-400'}`}>
                    HI-SCORE: {challenge.bestScore}
                  </span>
                )}
              </div>
              
              <h4 className={`font-bold text-lg my-3 ${theme === 'sport' ? 'skew-x-12 text-white' : theme === 'cyber' ? 'text-slate-200 group-hover:text-boto-400 transition-colors' : 'text-primary'}`}>
                  {challenge.title}
              </h4>
              
              <p className={`text-sm mb-6 ${theme === 'game' ? 'text-slate-400 leading-5' : 'text-slate-400'}`}>
                  {challenge.description}
              </p>
              
              <Button 
                onClick={() => navigate(`/challenge/${challenge.id}`)}
                variant="primary"
                fullWidth
                className="flex items-center justify-center space-x-2"
              >
                {theme === 'game' ? <Crosshair className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{theme === 'game' ? 'START GAME' : 'ENTER SIM'}</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArenaPage;

