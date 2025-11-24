
import React from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { Lock, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BotoAvatar from '../components/ui/BotoAvatar';

const AcademyPage = () => {
  const { lessons, user, startLesson } = useAppData();
  const navigate = useNavigate();
  const theme = user.activeTheme;

  const handleStart = (lessonId: string) => {
    startLesson(lessonId);
    navigate(`/lesson/${lessonId}`);
  };

  // Theme-based Shape Logic
  const getNodeShape = (isCompleted: boolean, isLocked: boolean) => {
    // Game Theme: Squares (Pixel Art style)
    if (theme === 'game') {
      return `w-20 h-20 flex items-center justify-center border-4 ${
        isCompleted ? 'bg-green-500 border-black shadow-[4px_4px_0px_black]' :
        isLocked ? 'bg-slate-700 border-slate-900 opacity-50' :
        'bg-boto-500 border-white animate-bounce-slow shadow-[4px_4px_0px_black]'
      }`;
    }
    
    // Sport Theme: Circles with heavy borders
    if (theme === 'sport') {
      return `w-24 h-24 rounded-full flex items-center justify-center border-8 ${
        isCompleted ? 'bg-slate-900 border-green-500' :
        isLocked ? 'bg-slate-800 border-slate-700' :
        'bg-slate-900 border-boto-500 ring-4 ring-offset-4 ring-offset-slate-900 ring-boto-500'
      }`;
    }

    // Cyber Theme: Hexagons
    return `
      w-24 h-24 flex items-center justify-center
      clip-path-hexagon bg-surface border-2 
      transition-all duration-300 relative overflow-hidden
      ${isCompleted ? 'border-boto-500 shadow-[0_0_15px_rgba(var(--primary-color)/0.3)]' : 
      isLocked ? 'border-white/10 bg-black/20' : 
      'border-tech-purple shadow-[0_0_15px_rgba(var(--secondary-color)/0.3)] animate-pulse-fast'}
    `;
  };

  return (
    <div className={`pb-28 pt-24 px-4 min-h-screen bg-background relative overflow-hidden transition-colors duration-500 font-${theme === 'game' ? "['Press_Start_2P']" : theme === 'sport' ? "['Russo_One']" : 'tech'}`}>
      
      {/* --- NEON RIVER EFFECT --- */}
      <div className="neon-river-container">
        <div className="neon-river-grid"></div>
        {/* Fog to fade out the horizon */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-background to-transparent z-10"></div>
      </div>
      
      {/* Theme specific decorations */}
      {theme === 'cyber' && (
        <>
           <div className="absolute top-20 left-10 w-32 h-32 bg-boto-500 rounded-full blur-[100px] opacity-10 animate-pulse"></div>
           <div className="absolute bottom-40 right-10 w-40 h-40 bg-tech-purple rounded-full blur-[100px] opacity-10 animate-pulse delay-700"></div>
        </>
      )}

      <div className="max-w-md mx-auto flex flex-col items-center space-y-12 relative z-10">
        
        {/* User Dashboard Widget */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => navigate('/profile')}
          className={`
            w-full cursor-pointer group
            ${theme === 'game' ? 'bg-blue-800 border-4 border-white p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.5)]' : 
              theme === 'sport' ? 'bg-slate-800 -skew-x-6 border-l-4 border-boto-500 p-4' :
              'bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-boto-500'}
             flex items-center space-x-4
          `}
        >
           <div className={`w-16 h-16 flex items-center justify-center overflow-hidden relative ${theme === 'cyber' ? 'rounded-lg bg-black/30' : theme === 'game' ? 'border-2 border-white bg-black' : 'rounded-full border-2 border-slate-600 bg-slate-700'}`}>
             <BotoAvatar 
                {...user.customization}
                size="sm"
                className="scale-125"
             />
           </div>
           <div className="flex-1">
             <div className="flex justify-between items-center">
                <span className={`text-xs mb-1 ${theme === 'cyber' ? 'font-mono text-boto-500' : 'text-white/70'}`}>
                  {theme === 'game' ? 'PLAYER_1' : theme === 'sport' ? 'ATHLETE' : 'CODENAME_'}
                </span>
                <span className="text-[10px] bg-white/10 text-slate-300 px-1 rounded">V 1.0</span>
             </div>
             <h2 className={`font-bold text-white text-lg ${theme === 'game' ? "font-['Press_Start_2P'] text-xs mt-2" : ''}`}>
               {user.codename}
             </h2>
             <div className={`w-full h-2 mt-2 overflow-hidden ${theme === 'game' ? 'bg-black border border-white' : 'bg-black/50 rounded-full'}`}>
                <div className={`h-full ${theme === 'game' ? 'bg-green-500' : theme === 'sport' ? 'bg-orange-500 skew-x-12' : 'bg-gradient-to-r from-boto-500 to-tech-purple'} w-3/4`}></div>
             </div>
           </div>
        </motion.div>

        {/* Learning Path Network */}
        <div className="w-full flex flex-col items-center space-y-8">
            {lessons.map((lesson, index) => {
            const isLocked = lesson.locked;
            const isCompleted = lesson.completed;
            
            const offsetClass = 
                lesson.position === 'left' ? '-translate-x-12' : 
                lesson.position === 'right' ? 'translate-x-12' : 
                '';

            return (
                <div key={lesson.id} className={`relative flex justify-center w-full ${offsetClass}`}>
                
                {/* Connection Line */}
                {index < lessons.length - 1 && (
                    <div className={`absolute top-14 left-1/2 -translate-x-1/2 h-24 -z-10
                       ${theme === 'game' ? 'w-4 bg-black border-x-2 border-white' : 
                         theme === 'sport' ? 'w-1 bg-slate-700' : 
                         'w-0.5 bg-boto-500/50 shadow-[0_0_10px_cyan]'}
                    `}>
                        {isCompleted && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 1 }}
                                className={`w-full ${theme === 'game' ? 'bg-white' : 'bg-boto-500 shadow-[0_0_15px_cyan]'}`}
                            />
                        )}
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isLocked && handleStart(lesson.id)}
                    disabled={isLocked}
                    className="relative group focus:outline-none"
                >
                    <div 
                      className={getNodeShape(isCompleted, isLocked)}
                      style={theme === 'cyber' ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" } : {}}
                    >
                        {/* Inner Content */}
                        <div className="z-10 relative">
                            {isCompleted ? (
                                <Check className={`${theme === 'game' ? 'text-black' : 'text-boto-500'} w-8 h-8`} strokeWidth={3} />
                            ) : isLocked ? (
                                <Lock className="text-slate-500 w-6 h-6" />
                            ) : (
                                theme === 'sport' ? <span className="font-['Russo_One'] text-2xl text-white">{index + 1}</span> :
                                <Star className={`${theme === 'game' ? 'text-yellow-400 fill-yellow-400' : 'text-white fill-tech-purple'} w-8 h-8`} />
                            )}
                        </div>
                    </div>

                    {/* Label/Tooltip */}
                    <div className={`
                        absolute -bottom-8 left-1/2 -translate-x-1/2 
                        whitespace-nowrap px-2 py-1 
                        ${theme === 'game' ? 'bg-black text-white font-["Press_Start_2P"] text-[8px] border border-white shadow-[2px_2px_0px_white]' : 
                          theme === 'sport' ? 'bg-slate-800 text-orange-500 font-["Russo_One"] -skew-x-12 uppercase border-l-4 border-orange-500' :
                          'bg-surface border border-boto-500/30 text-boto-300 rounded font-mono text-[10px] shadow-[0_0_10px_rgba(6,182,212,0.2)]'}
                    `}>
                        {isCompleted ? 'DONE' : isLocked ? 'LOCKED' : 'START'}
                    </div>

                </motion.button>
                </div>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default AcademyPage;

