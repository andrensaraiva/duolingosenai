import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { Play, Save, Layout, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const { challenges, user } = useAppData();
    const theme = user.activeTheme;
  const challenge = challenges.find(c => c.id === id);

  const [code, setCode] = useState<string>('# Digite seu código boto aqui\n\ndef nadar():\n  pass');
  const [simulating, setSimulating] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  if (!challenge) return <div>Desafio não encontrado</div>;

  const handleSimulate = () => {
    setSimulating(true);
    setConsoleOutput(['Compilando...', 'Inicializando ambiente do rio...']);
    
    // Fake simulation
    setTimeout(() => {
       setConsoleOutput(prev => [...prev, '> Boto iniciou nado...', '> Velocidade: 5 nós', '> Correnteza superada!']);
    }, 1000);

    setTimeout(() => {
        setSimulating(false);
        setConsoleOutput(prev => [...prev, 'SUCESSO! Eficiência: 98%']);
    }, 2500);
  };

  const snippets = ['for i in range(10):', 'if obstacle:', 'boto.jump()', 'return true'];

  const addSnippet = (snip: string) => {
      setCode(prev => prev + '\n' + snip);
  };

  const themeStyles = {
    cyber: {
      layout: 'bg-background text-[#1b2a3a] font-porto',
      toolbar: 'bg-white/95 border-b border-[#cadaf0] shadow-sm',
      icon: 'text-[#5f7d9a] hover:text-[#0077c8]',
      actionBtn: 'bg-white/90 p-2 rounded-xl border border-[#cadaf0] hover:border-[#69d5ff]',
      editorBg: 'bg-white',
      textarea: 'text-[#1b2a3a]',
      snippetStrip: 'bg-white border-t border-[#cadaf0]',
      snippet: 'bg-[#f0f7ff] border border-[#cadaf0] text-[#1b2a3a] hover:border-[#69d5ff]',
      console: 'bg-white border-t border-[#cadaf0]',
      consoleHeader: 'bg-[#e6f2ff] text-[#1b2a3a]',
      simulateBtn: 'bg-[#0077c8] border-[#0063a6] text-white',
    },
    game: {
      layout: "bg-background text-white font-['Press_Start_2P']",
      toolbar: 'bg-[#1b0f33] border-b-4 border-[#ff4081] pixel-scanlines',
      icon: 'text-[#ffeb3b] hover:text-white',
      actionBtn: 'bg-black p-2 border border-[#ff4081] rounded hover:bg-[#1b0f33]',
      editorBg: 'bg-[#0c071a]',
      textarea: 'text-[#00ff8c]',
      snippetStrip: 'bg-[#1b0f33] border-t border-[#ff4081]',
      snippet: 'bg-black border border-[#ff4081] text-[#ffeb3b] hover:border-[#00ff8c]',
      console: 'bg-[#0c071a] border-t border-[#ff4081]',
      consoleHeader: 'bg-[#1b0f33] text-[#ffeb3b]',
      simulateBtn: 'bg-[#00ff8c] border-[#00c973] text-black',
    },
    sport: {
      layout: "bg-background text-white font-['Russo_One'] uppercase",
      toolbar: 'bg-[#0f1b3a] border-b-4 border-[#ff6347] sport-stripe',
      icon: 'text-[#ffcf4a] hover:text-white',
      actionBtn: 'bg-[#10203d] p-2 border border-[#ff6347] rounded hover:bg-[#152a4c]',
      editorBg: 'bg-[#10192f]',
      textarea: 'text-[#ffcf4a]',
      snippetStrip: 'bg-[#10203d] border-t border-[#ff6347]',
      snippet: 'bg-[#152a4c] border border-[#ff6347] text-[#ffcf4a] hover:bg-[#1d3358]',
      console: 'bg-[#0f1b3a] border-t border-[#ff6347]',
      consoleHeader: 'bg-[#152a4c] text-[#ffcf4a]',
      simulateBtn: 'bg-[#ff6347] border-[#c62828] text-white',
    },
  }[theme];

  return (
    <div className={`h-screen flex flex-col ${themeStyles.layout}`}>
       {/* Toolbar */}
       <div className={`${themeStyles.toolbar} p-3 flex items-center justify-between`}>
           <button onClick={() => navigate('/arena')} className={themeStyles.icon}>
               <ArrowLeft className="w-6 h-6" />
           </button>
           <h2 className="font-bold text-sm truncate max-w-[200px] tracking-wide">{challenge.title}</h2>
           <div className="flex space-x-2">
               <button className={themeStyles.actionBtn}><Layout className="w-4 h-4" /></button>
               <button className={themeStyles.actionBtn}><Save className="w-4 h-4" /></button>
           </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 flex flex-col relative">
           <div className={`flex-1 ${themeStyles.editorBg} p-4 font-mono text-sm overflow-auto`}
             style={{ boxShadow: theme === 'cyber' ? 'inset 0 0 0 rgba(0,0,0,0)' : undefined }}>
               <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-full bg-transparent focus:outline-none resize-none ${themeStyles.textarea}`}
                spellCheck={false}
               />
           </div>

           {/* Smart Keyboard / Snippets */}
           <div className={`${themeStyles.snippetStrip} p-2 overflow-x-auto whitespace-nowrap scrollbar-hide`}>
               {snippets.map((snip, i) => (
                   <button 
                    key={i} 
                    onClick={() => addSnippet(snip)}
                    className={`inline-block px-3 py-1.5 rounded text-xs font-mono mr-2 transition-all ${themeStyles.snippet}`}
                   >
                       {snip}
                   </button>
               ))}
           </div>
       </div>

       {/* Simulation/Output Drawer */}
       <div className={`${themeStyles.console} transition-all duration-300 flex flex-col ${simulating || consoleOutput.length > 0 ? 'h-1/3' : 'h-16'}`}>
           <div className={`p-3 flex justify-between items-center ${themeStyles.consoleHeader}`}>
               <span className="text-xs font-bold">TERMINAL DO BOTO</span>
               {simulating && <span className="animate-pulse text-xs">EXECUTANDO...</span>}
           </div>
           
           <div className={`flex-1 p-4 font-mono text-xs overflow-auto ${theme === 'cyber' ? 'text-[#1b2a3a]' : 'text-slate-200'}`}>
               {consoleOutput.map((line, i) => (
                   <div key={i} className="mb-1">{line}</div>
               ))}
           </div>

           <div className="p-4 absolute bottom-0 right-0 left-0" style={{display: simulating || consoleOutput.length > 0 ? 'none' : 'block'}}>
                <Button fullWidth onClick={handleSimulate} className={`${themeStyles.simulateBtn} hover:brightness-110`}>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    EXECUTAR CÓDIGO
                </Button>
           </div>
       </div>
    </div>
  );
};

export default ChallengePage;
