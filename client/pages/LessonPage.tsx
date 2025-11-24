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
  if (isCompleted) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <SuccessAnimation />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface border border-boto-500/50 p-8 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center max-w-sm w-full z-10 text-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-boto-500 to-transparent"></div>

          <div className="mb-6 scale-125 relative">
             <div className="absolute inset-0 bg-boto-500 blur-2xl opacity-20 rounded-full"></div>
             <BotoAvatar {...user.customization} emotion="happy" size="lg" />
          </div>
          
          <h2 className="text-2xl font-tech text-boto-300 mb-2 uppercase tracking-widest">Module Completed</h2>
          <p className="text-slate-400 font-mono text-sm mb-8">System synchronization successful.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase mb-1">XP Acquired</span>
              <span className="text-2xl font-tech text-boto-500">+{displayedXp}</span>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col items-center">
               <span className="text-[10px] font-mono text-slate-500 uppercase mb-1">Streak</span>
               <div className="flex items-center text-orange-500">
                  <span className="text-2xl font-tech">{user.streak}</span>
                  <span className="text-lg ml-1">⚡</span>
               </div>
            </div>
          </div>

          <Button fullWidth size="lg" onClick={() => { completeLesson(lesson.id, lesson.xpReward); navigate('/'); }} className="neon-glow">
            CONFIRM UPLOAD
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-slate-100 overflow-hidden relative">
      
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-sm z-10">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-6 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-boto-500 shadow-[0_0_10px_#06b6d4]"
          />
        </div>
        <div className="flex items-center text-tech-pink font-bold font-mono">
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
                 <h2 className="text-xl font-tech text-slate-200 text-center uppercase tracking-wide">
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
                   <div className="bg-slate-800/80 backdrop-blur p-6 rounded-lg border-l-2 border-boto-500 shadow-lg text-slate-300 font-mono text-sm leading-relaxed typing-effect">
                       {currentStep.content}
                   </div>
               </div>
            )}

            {/* Quiz Options */}
            {currentStep.type === LessonType.QUIZ && (
                <div className="space-y-4">
                     <div className="bg-slate-900 border border-slate-700 p-4 rounded mb-6 font-mono text-sm text-green-400">
                        <span className="text-slate-500">{'// Query:'}</span><br/>
                        {currentStep.content}
                     </div>
                    {currentStep.options?.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => status === 'idle' && setSelectedOption(opt)}
                            className={`w-full p-4 rounded border font-mono text-sm text-left transition-all relative overflow-hidden group ${
                                selectedOption === opt 
                                ? 'bg-boto-900/30 border-boto-500 text-boto-300' 
                                : 'bg-surface border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                            }`}
                        >
                            <span className="mr-3 opacity-50 text-xs text-slate-500">
                                {opt.includes('==') ? 'bool' : 'var'}
                            </span>
                            {opt}
                            {selectedOption === opt && <div className="absolute inset-0 bg-boto-500/5 animate-pulse"></div>}
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
                           className="flex items-stretch bg-slate-900 rounded border border-slate-700 overflow-hidden group hover:border-slate-600"
                         >
                             <div className="flex flex-col bg-slate-800 border-r border-slate-700 w-10">
                                 <button onClick={() => moveItem(idx, -1)} className="flex-1 hover:bg-slate-700 text-slate-400 flex items-center justify-center">▲</button>
                                 <button onClick={() => moveItem(idx, 1)} className="flex-1 hover:bg-slate-700 text-slate-400 flex items-center justify-center">▼</button>
                             </div>
                             <div className="p-4 flex-1 font-mono text-tech-purple text-sm flex items-center">
                                 <span className="text-slate-600 mr-4 select-none">{idx + 1}</span>
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
      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t transition-colors duration-300 z-20 ${
          status === 'correct' ? 'bg-tech-green/10 border-tech-green' : 
          status === 'wrong' ? 'bg-tech-pink/10 border-tech-pink' : 
          'bg-surface border-slate-800'
      }`}>
          <div className="max-w-md mx-auto flex flex-col space-y-4">
              {status === 'correct' && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center text-tech-green font-mono font-bold"
                  >
                      <Terminal className="w-5 h-5 mr-2" />
                      {'>'} EXECUTION SUCCESSFUL
                  </motion.div>
              )}
              {status === 'wrong' && (
                  <motion.div 
                    initial={{ x: 10 }}
                    animate={{ x: [0, -10, 10, 0] }}
                    className="flex flex-col text-tech-pink mb-2 font-mono"
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
                className={status === 'correct' ? 'bg-tech-green border-green-700' : status === 'wrong' ? 'bg-tech-pink border-red-900' : 'bg-boto-600 border-boto-800'}
              >
                 {status === 'idle' ? 'RUN CODE' : status === 'correct' ? 'NEXT MODULE' : 'DEBUG'}
              </Button>
          </div>
      </div>
    </div>
  );
};

export default LessonPage;
