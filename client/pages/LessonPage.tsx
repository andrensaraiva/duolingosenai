import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { LessonType } from '../types';
import { Button } from '../components/ui/Button';
import { X, Heart, Terminal, Code2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BotoAvatar from '../components/ui/BotoAvatar';
import SuccessAnimation from '../components/ui/SuccessAnimation';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, user, loseHeart, completeLesson } = useAppData();
  const theme = user.activeTheme;
  const isCyber = theme === 'cyber';
  
  const lesson = lessons.find(l => l.id === lessonId);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [orderState, setOrderState] = useState<string[]>([]);
  
  // Completion State
  const [isCompleted, setIsCompleted] = useState(false);
  const [displayedXp, setDisplayedXp] = useState(0);

  const currentStep = lesson?.steps[currentStepIndex];
  const progress = lesson ? ((currentStepIndex + 1) / lesson.steps.length) * 100 : 0;

  useEffect(() => {
    if (currentStep?.type === LessonType.CODE_ORDER && currentStep.options) {
      setOrderState([...currentStep.options].sort(() => Math.random() - 0.5));
    } else {
      setOrderState([]);
    }
    setSelectedOption(null);
    setStatus('idle');
  }, [currentStepIndex, currentStep]);

  useEffect(() => {
    if (isCompleted && lesson) {
      const interval = setInterval(() => {
        setDisplayedXp(prev => {
          if (prev < lesson.xpReward) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isCompleted, lesson]);

  if (!lesson || !currentStep) return <div className="bg-background h-screen text-white p-10 font-mono">Loading System...</div>;

  const handleCheck = () => {
    let success = false;
    if (currentStep.type === LessonType.QUIZ) {
      if (selectedOption === currentStep.correctAnswer) success = true;
    } else if (currentStep.type === LessonType.CODE_ORDER) {
        const userOrder = orderState.join('');
        const correctOrder = currentStep.correctOrder?.join('') || '';
        if (userOrder === correctOrder) success = true;
    } else {
      success = true;
    }

    if (success) {
        setStatus('correct');
    } else {
        setStatus('wrong');
        loseHeart();
    }
  };

  const handleContinue = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const moveItem = (index: number, direction: -1 | 1) => {
      if (status !== 'idle') return;
      const newOrder = [...orderState];
      if (index + direction >= 0 && index + direction < newOrder.length) {
          [newOrder[index], newOrder[index + direction]] = [newOrder[index + direction], newOrder[index]];
          setOrderState(newOrder);
      }
  };

  // Render Completion Overlay - "System Upgrade"
  const themeStyles = {
    cyber: {
      background: 'porto-grid',
      panel: 'rounded-3xl border border-[#cadaf0] bg-white/95 text-[#1b2a3a] shadow-[0_25px_60px_rgba(12,55,95,0.18)]',
      accent: 'text-[#0077c8]',
      progress: 'bg-gradient-to-r from-[#6dd7ff] to-[#0077c8]',
      heart: 'text-[#ff5c83]',
      buttonPrimary: 'bg-[#0077c8] border border-[#0063a6] text-white hover:bg-[#005b96]',
      buttonSuccess: 'bg-[#00b3ff] border border-[#0093d1] text-white',
      buttonDanger: 'bg-[#ff5c83] border border-[#e0446a] text-white',
      footer: 'bg-white/95 border-t border-[#cadaf0] text-[#1b2a3a]',
      footerSuccess: 'bg-[#e5f9f2] border-t border-[#9be7d8] text-[#0f5c49]',
      footerDanger: 'bg-[#ffe9ee] border-t border-[#ffb0c4] text-[#7c1f33]',
    },
    game: {
      background: 'pixel-scanlines',
      panel: 'bg-[#1b0f33] border-4 border-[#ff4081] rounded-3xl text-white pixel-scanlines',
      accent: 'text-[#ff4081]',
      progress: 'bg-[#ff4081]',
      heart: 'text-[#ffeb3b]',
      buttonPrimary: 'bg-black border-2 border-[#ff4081] text-[#ffeb3b]',
      buttonSuccess: 'bg-[#00ff8c] border-2 border-[#00c973] text-black',
      buttonDanger: 'bg-[#ff4081] border-2 border-[#c21664] text-white',
      footer: 'bg-[#1b0f33] border-t-4 border-[#ff4081] text-white',
      footerSuccess: 'bg-[#00c973] border-t-4 border-[#00995a] text-black',
      footerDanger: 'bg-[#c21664] border-t-4 border-[#7a0d3f] text-white',
    },
    sport: {
      background: 'sport-stripe',
      panel: 'bg-[#0f1b3a] border-4 border-[#ff6347] rounded-3xl text-white',
      accent: 'text-[#ff6347]',
      progress: 'bg-[#ff6347]',
      heart: 'text-[#ffcf4a]',
      buttonPrimary: 'bg-[#10203d] border-2 border-[#ff6347] text-[#ffcf4a]',
      buttonSuccess: 'bg-[#2f9364] border-2 border-[#1f6a46] text-white',
      buttonDanger: 'bg-[#c62828] border-2 border-[#8e1b1b] text-white',
      footer: 'bg-[#0f1b3a] border-t-4 border-[#ff6347] text-white',
      footerSuccess: 'bg-[#1f6a46] border-t-4 border-[#13452e] text-white',
      footerDanger: 'bg-[#8e1b1b] border-t-4 border-[#540f10] text-white',
    },
  }[theme];

  if (isCompleted) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        {isCyber && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(0,165,255,0.18), transparent 45%), linear-gradient(120deg, rgba(255,255,255,0.2), transparent 60%)' }}></div>
          </div>
        )}
        <SuccessAnimation />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${themeStyles.panel} p-8 shadow-[0_0_30px_rgba(0,0,0,0.25)] flex flex-col items-center max-w-sm w-full z-10 text-center relative`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fcbf49] to-transparent"></div>

          <div className="mb-6 scale-125 relative">
            <div className="absolute inset-0 bg-[#FFCA28] blur-2xl opacity-20 rounded-full"></div>
             <BotoAvatar {...user.customization} emotion="happy" size="lg" />
          </div>
          
          <h2 className={`text-2xl font-tech ${themeStyles.accent} mb-2 uppercase tracking-widest`}>Missão Concluída</h2>
          <p className={`font-mono text-sm mb-8 ${isCyber ? 'text-[#5f7d9a]' : 'text-slate-300'}`}>Progresso registrado no diário do Boto.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className={`${isCyber ? 'bg-white/90 border border-[#cadaf0] text-[#1b2a3a]' : 'bg-black/30 border border-white/10 text-white'} p-4 rounded-lg flex flex-col items-center`}>
              <span className={`text-[10px] font-mono uppercase mb-1 ${isCyber ? 'text-[#5f7d9a]' : 'text-slate-300'}`}>XP</span>
              <span className={`text-2xl font-tech ${themeStyles.accent}`}>+{displayedXp}</span>
            </div>
            <div className={`${isCyber ? 'bg-white/90 border border-[#cadaf0] text-[#1b2a3a]' : 'bg-black/30 border border-white/10 text-white'} p-4 rounded-lg flex flex-col items-center`}>
               <span className={`text-[10px] font-mono uppercase mb-1 ${isCyber ? 'text-[#5f7d9a]' : 'text-slate-300'}`}>Streak</span>
               <div className={`flex items-center ${themeStyles.accent}`}>
                  <span className="text-2xl font-tech">{user.streak}</span>
                  <span className="text-lg ml-1">⚡</span>
               </div>
            </div>
          </div>

          <Button fullWidth size="lg" onClick={() => { completeLesson(lesson.id, lesson.xpReward); navigate('/'); }} className={`${themeStyles.buttonPrimary} neon-glow`}>
            VOLTAR AO PORTO
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-background overflow-hidden relative ${isCyber ? 'text-[#1b2a3a]' : 'text-slate-100'}`}>
      {isCyber && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 18% 18%, rgba(0,165,255,0.2), transparent 45%), linear-gradient(160deg, rgba(255,255,255,0.2), transparent 60%)' }}></div>
        </div>
      )}
      {theme === 'sport' && <div className="absolute inset-0 sport-stripe opacity-40"></div>}
      {theme === 'game' && <div className="absolute inset-0 pixel-scanlines opacity-40"></div>}
      
      {/* Header */}
      <div className={`px-4 py-4 flex items-center justify-between z-10 ${theme === 'cyber' ? 'bg-white/95 border-b border-[#cadaf0] shadow-sm' : theme === 'game' ? 'bg-[#1b0f33] border-b-4 border-[#ff4081]' : 'bg-[#0f1b3a] border-b-4 border-[#ff6347]'}`}>
        <button onClick={() => navigate('/')} className={`${theme === 'cyber' ? 'text-[#5f7d9a] hover:text-[#0077c8]' : 'text-white/70 hover:text-white'} transition-colors`}>
          <X className="w-6 h-6" />
        </button>
        <div className={`flex-1 mx-6 h-1 rounded-full overflow-hidden ${theme === 'cyber' ? 'bg-[#dfe9f5]' : 'bg-black/30'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${themeStyles.progress} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
          />
        </div>
        <div className={`flex items-center font-bold font-mono ${themeStyles.heart}`}>
          <Heart className="w-5 h-5 fill-current mr-2" />
          {user.hearts}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-lg mx-auto w-full pb-32 relative">
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <Code2 className="w-96 h-96 absolute -right-20 -bottom-20 rotate-12" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full z-10"
          >
            <div className="flex items-center justify-center mb-6 space-x-2">
                 {currentStep.type === LessonType.CONCEPT && <Cpu className="text-boto-500" />}
                 {currentStep.type === LessonType.QUIZ && <Terminal className="text-tech-purple" />}
                 <h2 className={`text-xl font-tech text-center uppercase tracking-wide ${isCyber ? 'text-[#0f2b44]' : 'text-slate-200'}`}>
                    {currentStep.type === LessonType.CONCEPT && "Data Input"}
                    {currentStep.type === LessonType.QUIZ && "Verify Logic"}
                    {currentStep.type === LessonType.CODE_ORDER && "Sequence Algorithm"}
                </h2>
            </div>

            {/* Boto Helper - Hologram Mode */}
            {currentStep.type === LessonType.CONCEPT && (
               <div className="flex flex-col items-center mb-8">
                   <div className="w-24 h-24 mb-4 relative">
                       <div className="absolute inset-0 bg-boto-500/20 blur-xl rounded-full animate-pulse"></div>
                       <BotoAvatar {...user.customization} size="md" emotion="idle" />
                   </div>
                     <div className={`backdrop-blur p-6 rounded-lg border text-sm font-mono leading-relaxed typing-effect ${isCyber ? 'bg-white/95 border-[#cadaf0] text-[#1b2a3a]' : 'bg-slate-800/80 border-l-2 border-boto-500 text-slate-300 shadow-lg'}`}>
                       {currentStep.content}
                   </div>
               </div>
            )}

            {/* Quiz Options */}
            {currentStep.type === LessonType.QUIZ && (
                <div className="space-y-4">
                     <div className={`p-4 rounded mb-6 font-mono text-sm ${isCyber ? 'bg-white/95 border border-[#cadaf0] text-[#1b2a3a]' : 'bg-slate-900 border border-slate-700 text-green-400'}`}>
                        <span className="text-slate-500">{'// Query:'}</span><br/>
                        {currentStep.content}
                     </div>
                    {currentStep.options?.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => status === 'idle' && setSelectedOption(opt)}
                        className={`w-full p-4 rounded border font-mono text-sm text-left transition-all relative overflow-hidden group ${
                          selectedOption === opt 
                          ? isCyber ? 'bg-[#e6f3ff] border-[#69d5ff] text-[#0077c8]' : 'bg-boto-900/30 border-boto-500 text-boto-300'
                          : isCyber ? 'bg-white border-[#cadaf0] text-[#1b2a3a] hover:border-[#69d5ff]' : 'bg-surface border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                        >
                            <span className="mr-3 opacity-50 text-xs text-slate-500">
                                {opt.includes('==') ? 'bool' : 'var'}
                            </span>
                            {opt}
                        {selectedOption === opt && <div className={`absolute inset-0 ${isCyber ? 'bg-[#69d5ff]/20' : 'bg-boto-500/5'} animate-pulse`}></div>}
                        </button>
                    ))}
                </div>
            )}

            {/* Code Ordering - Dark IDE Style */}
            {currentStep.type === LessonType.CODE_ORDER && (
                <div className="space-y-3">
                     <p className="text-slate-400 mb-4 font-mono text-sm text-center">Reorder logic blocks:</p>
                     {orderState.map((block, idx) => (
                         <motion.div 
                         layout
                         key={block} 
                         className={`flex items-stretch rounded border overflow-hidden group ${isCyber ? 'bg-white border-[#cadaf0] hover:border-[#69d5ff]' : 'bg-slate-900 border border-slate-700 hover:border-slate-600'}`}
                         >
                         <div className={`flex flex-col w-10 ${isCyber ? 'bg-[#f0f7ff] border-r border-[#cadaf0]' : 'bg-slate-800 border-r border-slate-700'}`}>
                           <button onClick={() => moveItem(idx, -1)} className={`flex-1 flex items-center justify-center ${isCyber ? 'text-[#0077c8] hover:bg-[#e3f2ff]' : 'text-slate-400 hover:bg-slate-700'}`}>▲</button>
                           <button onClick={() => moveItem(idx, 1)} className={`flex-1 flex items-center justify-center ${isCyber ? 'text-[#0077c8] hover:bg-[#e3f2ff]' : 'text-slate-400 hover:bg-slate-700'}`}>▼</button>
                             </div>
                         <div className={`p-4 flex-1 font-mono text-sm flex items-center ${isCyber ? 'text-[#1b2a3a]' : 'text-tech-purple'}`}>
                           <span className={`${isCyber ? 'text-[#9ab0c8]' : 'text-slate-600'} mr-4 select-none`}>{idx + 1}</span>
                                 {block}
                             </div>
                         </motion.div>
                     ))}
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Feedback Console */}
        <div className={`fixed bottom-0 left-0 right-0 p-4 transition-colors duration-300 z-20 ${
          status === 'correct' ? themeStyles.footerSuccess : 
          status === 'wrong' ? themeStyles.footerDanger : 
          themeStyles.footer
      }`}>
          <div className="max-w-md mx-auto flex flex-col space-y-4">
              {status === 'correct' && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center font-mono font-bold"
                  >
                      <Terminal className="w-5 h-5 mr-2" />
                      {'>'} RESPOSTA PERFEITA
                  </motion.div>
              )}
              {status === 'wrong' && (
                  <motion.div 
                    initial={{ x: 10 }}
                    animate={{ x: [0, -10, 10, 0] }}
                    className="flex flex-col mb-2 font-mono"
                  >
                      <div className="font-bold flex items-center mb-1">
                        <span className="mr-2">⚠</span> RUNTIME ERROR
                      </div>
                      <p className="text-xs text-slate-400">{currentStep.explanation || "Syntax error detected."}</p>
                  </motion.div>
              )}

              <Button 
                fullWidth 
                size="lg" 
                variant={status === 'idle' ? 'primary' : status === 'correct' ? 'success' : 'danger'}
                onClick={status === 'idle' ? handleCheck : status === 'correct' ? handleContinue : () => setStatus('idle')}
                disabled={currentStep.type === LessonType.QUIZ && !selectedOption && status === 'idle'}
                className={status === 'correct' ? themeStyles.buttonSuccess : status === 'wrong' ? themeStyles.buttonDanger : themeStyles.buttonPrimary}
              >
                 {status === 'idle' ? 'EXECUTAR' : status === 'correct' ? 'SEGUIR' : 'AJUSTAR'}
              </Button>
          </div>
      </div>
    </div>
  );
};

export default LessonPage;
