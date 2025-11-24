import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CharacterCustomization, ThemeId } from '../../types';
import BotoAvatar from './BotoAvatar';
import { Button } from './Button';

export interface TutorialSlide {
  title: string;
  text: string;
  highlight?: number[];
}

interface ArenaTutorialProps {
  open: boolean;
  theme: ThemeId;
  customization: CharacterCustomization;
  step: number;
  slides: TutorialSlide[];
  onAdvance: () => void;
  onClose: () => void;
}

const ArenaTutorial: React.FC<ArenaTutorialProps> = ({
  open,
  theme,
  customization,
  step,
  slides,
  onAdvance,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="arena-tutorial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <div
            className={`max-w-sm w-full p-6 relative overflow-hidden ${
              theme === 'game'
                ? 'bg-blue-900 border-4 border-white shadow-[8px_8px_0px_black] font-[\'Press_Start_2P\']'
                : 'bg-surface border border-boto-500/50 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)]'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-slate-400 hover:text-white font-bold"
              aria-label="Fechar tutorial"
            >
              X
            </button>

            <div className="flex justify-center mb-4">
              <BotoAvatar {...customization} size="md" emotion="happy" />
            </div>

            <h2
              className={`text-xl font-bold mb-2 text-center ${
                theme === 'cyber' ? 'text-boto-500 font-tech' : 'text-white'
              }`}
            >
              {slides[step]?.title}
            </h2>
            <p className="text-slate-300 text-sm text-center mb-6 font-mono leading-relaxed">
              {slides[step]?.text}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === step ? 'bg-boto-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
              <Button size="sm" onClick={onAdvance}>
                {step < slides.length - 1 ? 'PRÓXIMO' : 'COMEÇAR'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArenaTutorial;
