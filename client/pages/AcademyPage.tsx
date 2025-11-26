
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

    // Porto Theme: Placas de madeira
    return `
      w-24 h-28 flex items-center justify-center
      bg-[#F5E6DE] border-4 border-[#8D6E63] rounded-2xl
      transition-all duration-300 relative overflow-hidden shadow-[0_16px_25px_rgba(93,64,55,0.25)]
      ${isCompleted ? 'brightness-110 border-[#FFCA28] shadow-[0_16px_25px_rgba(255,202,40,0.25)]' : 
      isLocked ? 'opacity-50 saturate-75' : 
      'after:absolute after:inset-0 after:bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")] after:opacity-25 after:pointer-events-none'}
    `;
  };

  const containerFont = theme === 'game'
    ? "font-['Press_Start_2P']"
    : theme === 'sport'
    ? "font-['Russo_One']"
    : 'font-porto';

  return (
    <div className={`pb-28 pt-24 px-4 min-h-screen bg-background relative overflow-hidden transition-colors duration-500 ${containerFont} ${theme === 'cyber' ? 'text-[#3E2723]' : ''}`}>
      {theme === 'cyber' && (
        <div className="porto-wave-container">
          <div className="porto-wave"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b1d2e] via-transparent"></div>
        </div>
      )}

      {theme === 'game' && (
        <div className="absolute inset-0 opacity-70 mix-blend-screen" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,64,129,0.25), transparent 45%)' }}></div>
      )}

      {theme === 'sport' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(120deg, rgba(255,99,71,0.25), transparent 50%, rgba(41,121,255,0.25))' }}></div>
        </div>
      )}

      <div className="max-w-md mx-auto flex flex-col items-center space-y-12 relative z-10">
        
        {/* User Dashboard Widget */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => navigate('/profile')}
          className={`
            w-full cursor-pointer group
            ${theme === 'game' ? 'bg-[#20123b] border-4 border-[#ff4081] p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.45)] pixel-scanlines' : 
              theme === 'sport' ? 'bg-[#16233f] -skew-x-6 border-l-8 border-[#ff6347] p-5 shadow-[0_12px_25px_rgba(0,0,0,0.35)] text-white' :
              'porto-panel p-5 rounded-3xl border-4 border-[#5D4037] text-[#3E2723]'}
             flex items-center space-x-4
          `}
        >
           <div className={`w-16 h-16 flex items-center justify-center overflow-hidden relative ${theme === 'cyber' ? 'rounded-2xl bg-[#F5E6DE] border-4 border-[#8D6E63]' : theme === 'game' ? 'border-4 border-white bg-black pixel-frame' : 'rounded-full border-4 border-[#ff6347]/70 bg-[#0f1b3a]'}`}>
             <BotoAvatar 
                {...user.customization}
                size="sm"
                className="scale-125"
             />
           </div>
           <div className="flex-1">
             <div className="flex justify-between items-center">
                <span className={`text-xs mb-1 uppercase tracking-[0.35em] ${theme === 'cyber' ? 'text-[#BF360C]' : 'text-white/70'}`}>
                  {theme === 'game' ? 'PLAYER_1' : theme === 'sport' ? 'ATHLETE' : 'TRIPULAÇÃO'}
                </span>
                <span className="text-[10px] bg-white/10 text-slate-300 px-1 rounded">V 1.0</span>
             </div>
             <h2 className={`font-bold text-white text-lg ${theme === 'game' ? "font-['Press_Start_2P'] text-xs mt-2 tracking-[0.15em]" : theme === 'sport' ? 'tracking-[0.08em]' : 'text-[#3E2723]'}`}>
               {user.codename}
             </h2>
             <div className={`w-full h-2 mt-3 overflow-hidden ${theme === 'game' ? 'bg-black border-2 border-[#00ff8c]' : theme === 'sport' ? 'bg-[#0b142d] border-2 border-[#ff6347]' : 'bg-[#8D6E63] border-2 border-[#5D4037] rounded-full'}`}>
               <div className={`h-full ${theme === 'game' ? 'bg-[#ffeb3b]' : theme === 'sport' ? 'bg-[#ffcf4a]' : 'bg-gradient-to-r from-[#FFCA28] to-[#F57C00]'} w-3/4`}></div>
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
                     ${theme === 'game' ? 'w-4 bg-black border-x-2 border-[#ff4081]' : 
                     theme === 'sport' ? 'w-1 bg-[#ff6347]' : 
                     'w-1 bg-[#8D6E63]'}
                  `}>
                        {isCompleted && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 1 }}
                        className={`w-full ${theme === 'game' ? 'bg-[#ffeb3b]' : theme === 'sport' ? 'bg-[#ffcf4a]' : 'bg-[#FFCA28]'}`}
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
                    >
                        {/* Inner Content */}
                        <div className="z-10 relative">
                            {isCompleted ? (
                            <Check className={`${theme === 'game' ? 'text-black' : theme === 'sport' ? 'text-[#ffcf4a]' : 'text-[#FFCA28]'} w-8 h-8`} strokeWidth={3} />
                            ) : isLocked ? (
                                <Lock className="text-slate-500 w-6 h-6" />
                            ) : (
                            theme === 'sport' ? <span className="font-['Russo_One'] text-2xl text-white">{index + 1}</span> :
                            <Star className={`${theme === 'game' ? 'text-[#ffeb3b] fill-[#ffeb3b]' : 'text-[#FFCA28] fill-[#FFCA28]'} w-8 h-8`} />
                            )}
                        </div>
                    </div>

                    {/* Label/Tooltip */}
                    <div className={`
                        absolute -bottom-8 left-1/2 -translate-x-1/2 
                        whitespace-nowrap px-2 py-1 
                        ${theme === 'game' ? 'bg-black text-white font-["Press_Start_2P"] text-[8px] border border-[#00ff8c] shadow-[2px_2px_0px_rgba(0,0,0,0.6)]' : 
                          theme === 'sport' ? 'bg-[#16233f] text-[#ff6347] font-["Russo_One"] -skew-x-12 uppercase border-l-4 border-[#ffcf4a]' :
                          'bg-[#8D6E63] border border-[#5D4037] text-[#FFECB3] rounded font-mono text-[10px] shadow-[0_0_15px_rgba(93,64,55,0.25)]'}
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

