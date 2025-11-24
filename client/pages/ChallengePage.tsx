import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { Play, Save, Layout, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { challenges } = useAppData();
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

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
       {/* Toolbar */}
       <div className="bg-slate-800 p-3 flex items-center justify-between border-b border-slate-700">
           <button onClick={() => navigate('/arena')} className="text-slate-400 hover:text-white">
               <ArrowLeft className="w-6 h-6" />
           </button>
           <h2 className="font-bold text-sm truncate max-w-[200px]">{challenge.title}</h2>
           <div className="flex space-x-2">
               <button className="bg-slate-700 p-2 rounded hover:bg-slate-600"><Layout className="w-4 h-4" /></button>
               <button className="bg-slate-700 p-2 rounded hover:bg-slate-600"><Save className="w-4 h-4" /></button>
           </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 flex flex-col relative">
           <div className="flex-1 bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto">
               <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-green-400 focus:outline-none resize-none"
                spellCheck={false}
               />
           </div>

           {/* Smart Keyboard / Snippets */}
           <div className="bg-slate-800 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-slate-700">
               {snippets.map((snip, i) => (
                   <button 
                    key={i} 
                    onClick={() => addSnippet(snip)}
                    className="inline-block bg-slate-700 px-3 py-1.5 rounded text-xs font-mono mr-2 border border-slate-600 hover:bg-slate-600"
                   >
                       {snip}
                   </button>
               ))}
           </div>
       </div>

       {/* Simulation/Output Drawer */}
       <div className={`bg-slate-900 border-t border-slate-700 transition-all duration-300 flex flex-col ${simulating || consoleOutput.length > 0 ? 'h-1/3' : 'h-16'}`}>
           <div className="p-3 flex justify-between items-center bg-slate-800">
               <span className="text-xs font-bold text-slate-400">TERMINAL DO BOTO</span>
               {simulating && <span className="animate-pulse text-yellow-400 text-xs">EXECUTANDO...</span>}
           </div>
           
           <div className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-300">
               {consoleOutput.map((line, i) => (
                   <div key={i} className="mb-1">{line}</div>
               ))}
           </div>

           <div className="p-4 bg-slate-800 absolute bottom-0 right-0 left-0" style={{display: simulating || consoleOutput.length > 0 ? 'none' : 'block'}}>
                <Button fullWidth onClick={handleSimulate} className="bg-green-600 border-green-700 hover:bg-green-500 text-white">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    EXECUTAR CÓDIGO
                </Button>
           </div>
       </div>
    </div>
  );
};

export default ChallengePage;
