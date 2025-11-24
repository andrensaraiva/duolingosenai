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

  const colors: CharacterCustomization['color'][] = ['pink', 'blue', 'purple', 'orange'];
  const hats: CharacterCustomization['hat'][] = ['none', 'party', 'cowboy', 'astronaut', 'crown'];
  const accessories: CharacterCustomization['accessory'][] = ['none', 'glasses', 'bowtie', 'scarf'];

  const handleSave = () => {
    updateCustomization(currentCustomization);
    navigate('/');
  };

  const themes: { id: ThemeId; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'cyber', label: 'CYBER', icon: Monitor, color: '#06b6d4' },
    { id: 'game', label: 'ARCADE', icon: Gamepad2, color: '#ff0080' },
    { id: 'sport', label: 'SPORTS', icon: Trophy, color: '#f97316' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-100 transition-colors duration-500">
      <div className="bg-surface/90 backdrop-blur p-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-20">
        <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-tech text-lg text-boto-500 tracking-wider">SYSTEM_CONFIG</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24">
        
        {/* Preview Area - Holo Deck */}
        <div className="bg-surface/50 border border-white/10 rounded-xl p-8 mb-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 theme-grid-bg opacity-30"></div>
          
          <div className="relative z-10 scale-125">
             <BotoAvatar 
                {...currentCustomization} 
                size="xl" 
                emotion="happy"
                className="drop-shadow-[0_0_20px_rgba(var(--primary-color)/0.4)]"
            />
          </div>
          
          <div className="mt-6 bg-black/40 border border-white/20 px-4 py-1 rounded font-mono text-xs text-boto-500">
             ID: {user.codename}
          </div>
        </div>

        {/* Theme Switcher */}
        <section className="mb-8">
            <h3 className="font-mono text-sm text-slate-400 mb-3 uppercase flex items-center">
                <span className="mr-2">⚡</span> Interface Theme
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => {
                    const isActive = user.activeTheme === theme.id;
                    const Icon = theme.icon;
                    return (
                        <button
                            key={theme.id}
                            onClick={() => setTheme(theme.id)}
                            className={`
                                relative overflow-hidden rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-300
                                ${isActive ? 'bg-surface border-2 border-boto-500 shadow-[0_0_15px_rgba(var(--primary-color)/0.3)]' : 'bg-surface/50 border border-transparent opacity-60 hover:opacity-100'}
                            `}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-boto-500' : 'text-slate-400'}`} />
                            <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                {theme.label}
                            </span>
                            {isActive && <div className="absolute inset-0 bg-boto-500/10 pointer-events-none" />}
                        </button>
                    )
                })}
            </div>
        </section>

        {/* Customization Options */}
        <div className="space-y-8 border-t border-white/10 pt-6">
          
          {/* Colors */}
          <section>
            <h3 className="font-mono text-sm text-slate-400 mb-3 uppercase">Hologram Color</h3>
            <div className="flex space-x-4">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrentCustomization(prev => ({ ...prev, color: c }))}
                  className={`w-12 h-12 rounded-full border-2 transition-all relative ${
                    currentCustomization.color === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-slate-700 opacity-50'
                  }`}
                  style={{ 
                      backgroundColor: 'transparent',
                      color: c === 'pink' ? '#d946ef' : c === 'blue' ? '#06b6d4' : c === 'purple' ? '#8b5cf6' : '#f59e0b'
                  }}
                >
                    <div className="absolute inset-1 rounded-full opacity-50" style={{ backgroundColor: 'currentColor' }}></div>
                </button>
              ))}
            </div>
          </section>

          {/* Hats */}
          <section>
            <h3 className="font-mono text-sm text-slate-400 mb-3 uppercase">Head Module</h3>
            <div className="grid grid-cols-5 gap-2">
              {hats.map(h => (
                <button
                  key={h}
                  onClick={() => setCurrentCustomization(prev => ({ ...prev, hat: h }))}
                  className={`aspect-square rounded bg-surface border flex items-center justify-center text-2xl transition-all ${
                    currentCustomization.hat === h ? 'border-boto-500 bg-white/5 shadow-[0_0_10px_rgba(var(--primary-color)/0.2)]' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {h === 'none' ? <span className="text-slate-500 text-xs font-mono">NULL</span> : 
                   h === 'party' ? '🤖' : h === 'cowboy' ? '📡' : h === 'astronaut' ? '⛑️' : '👑'}
                </button>
              ))}
            </div>
          </section>

           {/* Accessories */}
           <section>
            <h3 className="font-mono text-sm text-slate-400 mb-3 uppercase">Add-ons</h3>
            <div className="grid grid-cols-4 gap-2">
              {accessories.map(a => (
                <button
                  key={a}
                  onClick={() => setCurrentCustomization(prev => ({ ...prev, accessory: a }))}
                  className={`aspect-square rounded bg-surface border flex items-center justify-center text-2xl transition-all ${
                    currentCustomization.accessory === a ? 'border-boto-500 bg-white/5 shadow-[0_0_10px_rgba(var(--primary-color)/0.2)]' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {a === 'none' ? <span className="text-slate-500 text-xs font-mono">NULL</span> : 
                   a === 'glasses' ? '🕶️' : a === 'bowtie' ? '💾' : '🧣'}
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-white/10 z-20">
        <div className="max-w-md mx-auto">
          <Button fullWidth onClick={handleSave} className="flex items-center justify-center space-x-2 bg-boto-500 hover:bg-boto-600 border-none text-white font-mono shadow-lg shadow-boto-500/20">
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
