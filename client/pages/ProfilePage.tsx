import React, { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Monitor, Gamepad2, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import BotoAvatar from '../components/ui/BotoAvatar';
import { CharacterCustomization, ThemeId } from '../types';

const ProfilePage = () => {
  const { user, updateCustomization, setTheme } = useAppData();
  const navigate = useNavigate();

  const [currentCustomization, setCurrentCustomization] = useState<CharacterCustomization>(user.customization);
  const theme = user.activeTheme;

  const colors: CharacterCustomization['color'][] = ['pink', 'blue', 'purple', 'orange'];
  const heads: CharacterCustomization['head'][] = ['none', 'antenna', 'crown', 'headphones', 'cap'];
  const eyes: CharacterCustomization['eyes'][] = ['none', 'sunglasses', 'visor', 'patch'];
  const tails: CharacterCustomization['tail'][] = ['none', 'fin-ring', 'thruster', 'ribbon'];

  const handleSave = () => {
    updateCustomization(currentCustomization);
    navigate('/');
  };

  const themes: { id: ThemeId; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'cyber', label: 'PORTO', icon: Monitor, color: '#0077c8' },
    { id: 'game', label: 'GAMES', icon: Gamepad2, color: '#ff4081' },
    { id: 'sport', label: 'ESPORTES', icon: Trophy, color: '#ff6347' },
  ];

  const themeStyles = {
    cyber: {
      layout: 'bg-background text-[#1b2a3a] font-porto',
      header: 'bg-white/95 border-b border-[#cadaf0] shadow-sm',
      headerButton: 'p-2 text-[#5f7d9a] hover:text-[#0077c8] hover:bg-[#e6f3ff] rounded-lg transition-colors',
      title: 'text-[#0077c8]',
      preview: 'bg-white/95 border border-[#cadaf0] rounded-3xl p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_25px_50px_rgba(12,55,95,0.2)] min-h-[300px]',
      badge: 'bg-[#e6f2ff] border border-[#cadaf0] text-[#0077c8]',
      sectionLabel: 'text-[#5f7d9a]',
      optionBase: 'bg-white border border-[#cadaf0] text-[#1b2a3a]',
      optionActive: 'border-2 border-[#69d5ff] bg-[#e6f7ff] shadow-[0_12px_28px_rgba(0,119,200,0.18)]',
      circleActive: 'border-[#69d5ff] shadow-[0_0_16px_rgba(0,179,255,0.45)]',
      footer: 'bg-white/95 border-t border-[#cadaf0] shadow-[0_-10px_30px_rgba(12,55,95,0.12)]',
      save: 'bg-[#0077c8] border border-[#0063a6] text-white font-porto',
    },
    game: {
      layout: "bg-background text-white font-['Press_Start_2P']",
      header: 'bg-[#1b0f33] border-b-4 border-[#ff4081] pixel-scanlines',
      headerButton: 'p-2 text-[#ffeb3b] hover:text-white hover:bg-black rounded',
      title: 'text-[#ff4081]',
      preview: 'bg-[#120822] border-4 border-[#ff4081] rounded-3xl p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.6)] min-h-[300px]',
      badge: 'bg-black border border-[#ff4081] text-[#00ff8c]',
      sectionLabel: 'text-[#ffeb3b]',
      optionBase: 'bg-black border border-[#372054] text-[#ffeb3b] pixel-scanlines',
      optionActive: 'border-2 border-[#00ff8c] bg-[#1b0f33] shadow-[6px_6px_0px_rgba(0,0,0,0.6)]',
      circleActive: 'border-[#00ff8c] shadow-[0_0_12px_rgba(0,255,140,0.5)]',
      footer: 'bg-[#1b0f33] border-t-4 border-[#ff4081]',
      save: 'bg-[#00ff8c] border border-[#00c973] text-black',
    },
    sport: {
      layout: "bg-background text-white font-['Russo_One'] uppercase",
      header: 'bg-[#0f1b3a] border-b-4 border-[#ff6347] sport-stripe',
      headerButton: 'p-2 text-[#ffcf4a] hover:text-white hover:bg-[#152a4c] rounded',
      title: 'text-[#ff6347]',
      preview: 'bg-[#10203d] border-4 border-[#ff6347] rounded-3xl p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.45)] min-h-[300px]',
      badge: 'bg-[#152a4c] border border-[#ffcf4a] text-[#ffcf4a]',
      sectionLabel: 'text-[#ffcf4a]',
      optionBase: 'bg-[#152a4c] border border-[#24406e] text-[#ffcf4a]',
      optionActive: 'border-2 border-[#ff6347] bg-[#0f1b3a] shadow-[0_12px_24px_rgba(255,99,71,0.3)]',
      circleActive: 'border-[#ff6347] shadow-[0_0_12px_rgba(255,99,71,0.4)]',
      footer: 'bg-[#0f1b3a] border-t-4 border-[#ff6347]',
      save: 'bg-[#ff6347] border border-[#c62828] text-white',
    },
  }[theme];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${themeStyles.layout}`}>
      <div className={`${themeStyles.header} p-4 flex items-center justify-between sticky top-0 z-20`}>
        <button onClick={() => navigate('/')} className={themeStyles.headerButton}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className={`font-tech text-lg tracking-wider ${themeStyles.title}`}>Base do Boto</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24">
        <div className={themeStyles.preview}>
          <div className="absolute inset-0 theme-grid-bg opacity-30"></div>
          <div className="relative z-10 scale-110">
            <BotoAvatar
              {...currentCustomization}
              size="xl"
              emotion="happy"
              className="drop-shadow-[0_0_20px_rgba(var(--primary-color)/0.4)]"
            />
          </div>
          <div className={`mt-8 px-4 py-1 rounded font-mono text-xs animate-pulse ${themeStyles.badge}`}>
            CODENAME: {user.codename}
          </div>
        </div>

        <section className="mb-8">
          <h3 className={`font-mono text-sm uppercase mb-3 flex items-center gap-2 ${themeStyles.sectionLabel}`}>
            <span>⚡</span> Escolha de Tema
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ id, icon: Icon, label, color }) => {
              const isActive = user.activeTheme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`relative overflow-hidden rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive ? themeStyles.optionActive : `${themeStyles.optionBase} opacity-70 hover:opacity-100`
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-slate-400'}`} style={isActive ? { color } : undefined} />
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
                  {isActive && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundColor: color }} />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-6 border-t border-white/10 pt-6">
          <section>
            <h3 className={`font-mono text-sm uppercase mb-3 ${themeStyles.sectionLabel}`}>Cor do Avatar</h3>
            <div className="flex space-x-4">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setCurrentCustomization((prev) => ({ ...prev, color: colorOption }))}
                  className={`w-12 h-12 rounded-full border-2 transition-all relative ${
                    currentCustomization.color === colorOption ? `${themeStyles.circleActive} scale-110` : 'border-slate-700 opacity-50'
                  }`}
                  style={{
                    backgroundColor: 'transparent',
                    color:
                      colorOption === 'pink' ? '#d946ef' : colorOption === 'blue' ? '#06b6d4' : colorOption === 'purple' ? '#8b5cf6' : '#f59e0b',
                  }}
                >
                  <div className="absolute inset-1 rounded-full opacity-50" style={{ backgroundColor: 'currentColor' }} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`font-mono text-sm uppercase mb-3 ${themeStyles.sectionLabel}`}>Head Module</h3>
            <div className="grid grid-cols-5 gap-2">
              {heads.map((option) => (
                <button
                  key={option}
                  onClick={() => setCurrentCustomization((prev) => ({ ...prev, head: option }))}
                  className={`aspect-square rounded flex items-center justify-center text-2xl transition-all ${
                    currentCustomization.head === option ? themeStyles.optionActive : `${themeStyles.optionBase} opacity-70 hover:opacity-100`
                  }`}
                >
                  {option === 'none' ? <span className="text-slate-500 text-xs font-mono">NULL</span> : option === 'antenna' ? '📡' : option === 'crown' ? '👑' : option === 'headphones' ? '🎧' : '🧢'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`font-mono text-sm uppercase mb-3 ${themeStyles.sectionLabel}`}>Optical Sensor</h3>
            <div className="grid grid-cols-4 gap-2">
              {eyes.map((option) => (
                <button
                  key={option}
                  onClick={() => setCurrentCustomization((prev) => ({ ...prev, eyes: option }))}
                  className={`aspect-square rounded flex items-center justify-center text-2xl transition-all ${
                    currentCustomization.eyes === option ? themeStyles.optionActive : `${themeStyles.optionBase} opacity-70 hover:opacity-100`
                  }`}
                >
                  {option === 'none' ? <span className="text-slate-500 text-xs font-mono">NULL</span> : option === 'sunglasses' ? '🕶️' : option === 'visor' ? '🥽' : '🏴‍☠️'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className={`font-mono text-sm uppercase mb-3 ${themeStyles.sectionLabel}`}>Rear Thruster</h3>
            <div className="grid grid-cols-4 gap-2">
              {tails.map((option) => (
                <button
                  key={option}
                  onClick={() => setCurrentCustomization((prev) => ({ ...prev, tail: option }))}
                  className={`aspect-square rounded flex items-center justify-center text-2xl transition-all ${
                    currentCustomization.tail === option ? themeStyles.optionActive : `${themeStyles.optionBase} opacity-70 hover:opacity-100`
                  }`}
                >
                  {option === 'none' ? <span className="text-slate-500 text-xs font-mono">NULL</span> : option === 'fin-ring' ? '⭕' : option === 'thruster' ? '🔥' : '🎀'}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 p-4 z-20 ${themeStyles.footer}`}>
        <div className="max-w-md mx-auto">
          <Button
            fullWidth
            onClick={handleSave}
            className={`flex items-center justify-center space-x-2 hover:brightness-110 ${themeStyles.save}`}
          >
            <Save className="w-4 h-4" />
            <span>Salvar Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
