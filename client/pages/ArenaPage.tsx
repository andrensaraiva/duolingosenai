import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Trash2, Database, Zap, Hammer, Sprout, Code, Layout, HelpCircle, Loader2, Infinity as InfinityIcon, Sparkles, Flame, BadgePercent } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { Button } from '../components/ui/Button';
import BotoAvatar from '../components/ui/BotoAvatar';
import ArenaTutorial, { TutorialSlide } from '../components/ui/ArenaTutorial';
import { ArenaNode, BotInstruction, ResourceType } from '../types';

const TICK_RATE = 800;
const PASSIVE_TICK = 1000;
const PASSIVE_LOG_FREQUENCY = 5;
const RESOURCE_BASE_YIELD: Record<ResourceType, number> = {
  MATERIAL: 4,
  SEED: 3,
  ENERGY: 5,
};
const COMBO_BONUS = 2;

type UpgradeId = 'combo_boost' | 'yield_amp' | 'convert_discount';

interface ArenaUpgrade {
  id: UpgradeId;
  label: string;
  description: string;
  cost: number;
  icon: React.ComponentType<{ size?: number }>;
}

const ARENA_UPGRADES: ArenaUpgrade[] = [
  {
    id: 'combo_boost',
    label: 'Combo Booster',
    description: 'Quebras rendem +1 de combo permanente por ciclo.',
    cost: 40,
    icon: Flame,
  },
  {
    id: 'yield_amp',
    label: 'Flux Amplifier',
    description: 'Fazendas convertidas geram +50% de fluxo passivo.',
    cost: 60,
    icon: Sparkles,
  },
  {
    id: 'convert_discount',
    label: 'Nano Converter',
    description: 'Converter consome 5 unidades a menos de Material e Energia.',
    cost: 35,
    icon: BadgePercent,
  },
];
const RESOURCE_ORDER: ResourceType[] = ['MATERIAL', 'SEED', 'ENERGY'];

type ResourceInventory = Record<ResourceType, number>;

const createInstructionId = () => `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;

const SOURCE_LABEL_MAP: Record<ResourceType, string> = {
  MATERIAL: 'SRC_M',
  SEED: 'SRC_S',
  ENERGY: 'SRC_E',
};

const makeInstruction = (instruction: Omit<BotInstruction, 'id'>): BotInstruction => ({
  id: createInstructionId(),
  ...instruction,
});

const initialNodes: ArenaNode[] = [
  { id: 0, type: 'SOURCE', sourceType: 'MATERIAL', state: 'ACTIVE', level: 1, label: 'SRC_0', yieldRate: RESOURCE_BASE_YIELD.MATERIAL, comboLevel: 0 },
  { id: 1, type: 'SOURCE', sourceType: 'SEED', state: 'ACTIVE', level: 1, label: 'SRC_1', yieldRate: RESOURCE_BASE_YIELD.SEED, comboLevel: 0 },
  { id: 2, type: 'SOURCE', sourceType: 'ENERGY', state: 'ACTIVE', level: 1, label: 'SRC_2', yieldRate: RESOURCE_BASE_YIELD.ENERGY, comboLevel: 0 },
  { id: 3, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
  { id: 4, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
  { id: 5, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
  { id: 6, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
  { id: 7, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
  { id: 8, type: 'PLOT', state: 'EMPTY', level: 0, comboLevel: 0 },
];

const starterConvertedNode: ArenaNode = {
  id: 3,
  type: 'SOURCE',
  state: 'CONVERTED',
  sourceType: 'MATERIAL',
  level: 2,
  label: 'SRC_M+',
  yieldRate: RESOURCE_BASE_YIELD.MATERIAL + 2,
  comboLevel: 0,
};

const ensureStarterConversion = (nodes: ArenaNode[]): ArenaNode[] => {
  const hasPassiveNode = nodes.some(node => node.type === 'SOURCE' && node.state === 'CONVERTED');
  if (hasPassiveNode) return nodes;

  return nodes.map(node => {
    if (node.id !== starterConvertedNode.id) return node;

    return {
      ...starterConvertedNode,
      comboLevel: node.comboLevel ?? starterConvertedNode.comboLevel,
    };
  });
};

const createDemoScript = (): BotInstruction[] => {
  const script: BotInstruction[] = [];

  const push = (instruction: Omit<BotInstruction, 'id'>) => {
    script.push(makeInstruction(instruction));
  };

  const harvestLoop = (target: number, resource: ResourceType, times: number) => {
    push({ command: 'GOTO', target });
    for (let i = 0; i < times; i += 1) {
      push({ command: 'HARVEST', resource });
    }
  };

  harvestLoop(0, 'MATERIAL', 40);
  harvestLoop(1, 'SEED', 30);
  harvestLoop(2, 'ENERGY', 40);

  push({ command: 'GOTO', target: 4 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });
  push({ command: 'CONVERT', resource: 'MATERIAL' });

  harvestLoop(3, 'MATERIAL', 10);
  harvestLoop(4, 'MATERIAL', 10);
  harvestLoop(0, 'MATERIAL', 10);
  harvestLoop(2, 'ENERGY', 25);

  push({ command: 'GOTO', target: 5 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });
  push({ command: 'CONVERT', resource: 'ENERGY' });

  harvestLoop(0, 'MATERIAL', 15);
  harvestLoop(3, 'MATERIAL', 10);
  harvestLoop(4, 'MATERIAL', 10);
  harvestLoop(2, 'ENERGY', 15);
  harvestLoop(5, 'ENERGY', 15);
  harvestLoop(1, 'SEED', 10);

  push({ command: 'GOTO', target: 6 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });
  push({ command: 'CONVERT', resource: 'SEED' });
  push({ command: 'BREAK' });

  harvestLoop(2, 'ENERGY', 10);
  harvestLoop(5, 'ENERGY', 10);
  harvestLoop(0, 'MATERIAL', 10);
  harvestLoop(4, 'MATERIAL', 10);
  harvestLoop(1, 'SEED', 10);

  push({ command: 'GOTO', target: 6 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });
  push({ command: 'CONVERT', resource: 'SEED' });

  harvestLoop(6, 'SEED', 12);

  push({ command: 'GOTO', target: 7 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });

  push({ command: 'GOTO', target: 8 });
  push({ command: 'BUILD' });
  push({ command: 'INSTALL' });
  push({ command: 'UPGRADE' });

  harvestLoop(4, 'MATERIAL', 10);
  harvestLoop(5, 'ENERGY', 10);
  harvestLoop(6, 'SEED', 10);

  return script;
};

const initialScript: BotInstruction[] = createDemoScript();

const ArenaPage: React.FC = () => {
  const { user } = useAppData();
  const theme = user.activeTheme;

  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [viewMode, setViewMode] = useState<'VISUAL' | 'CODE'>('VISUAL');
  const [script, setScript] = useState<BotInstruction[]>(initialScript);
  const [textCode, setTextCode] = useState('');
  const [nodes, setNodes] = useState<ArenaNode[]>(() => ensureStarterConversion(initialNodes));
  const [resources, setResources] = useState<ResourceInventory>({ MATERIAL: 0, SEED: 0, ENERGY: 0 });
  const [botPos, setBotPos] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM READY.']);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pps, setPps] = useState(0);
  const [shards, setShards] = useState(0);
  const [acquiredUpgrades, setAcquiredUpgrades] = useState<UpgradeId[]>([]);
  const [shardPulse, setShardPulse] = useState(false);
  const [hasRunOnce, setHasRunOnce] = useState(false);

  const nodesRef = useRef(nodes);
  const resourcesRef = useRef(resources);
  const botPosRef = useRef(botPos);
  const scriptRef = useRef(script);
  const currentLineRef = useRef(currentLine);
  const passiveTickRef = useRef(0);
  const shardsRef = useRef(shards);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { resourcesRef.current = resources; }, [resources]);
  useEffect(() => { botPosRef.current = botPos; }, [botPos]);
  useEffect(() => { scriptRef.current = script; }, [script]);
  useEffect(() => { currentLineRef.current = currentLine; }, [currentLine]);
  useEffect(() => { shardsRef.current = shards; }, [shards]);

  useEffect(() => {
    if (shards > 0) {
      setShardPulse(true);
      const timer = setTimeout(() => setShardPulse(false), 400);
      return () => clearTimeout(timer);
    }
  }, [shards]);

  const ensureSessionStart = useCallback(() => {
    setStartTime(prev => prev ?? Date.now());
  }, []);

  const hasUpgrade = useCallback((id: UpgradeId) => acquiredUpgrades.includes(id), [acquiredUpgrades]);

  const comboBonusValue = useCallback(() => COMBO_BONUS + (hasUpgrade('combo_boost') ? 1 : 0), [hasUpgrade]);

  const computePassiveYield = useCallback((nodeList: ArenaNode[], upgradesList: UpgradeId[]) => {
    const base = nodeList.reduce((acc, node) => {
      if (node.type === 'SOURCE' && node.state === 'CONVERTED') {
        const fallback = node.sourceType ? RESOURCE_BASE_YIELD[node.sourceType] : 0;
        return acc + (node.yieldRate ?? fallback);
      }
      return acc;
    }, 0);
    const multiplier = upgradesList.includes('yield_amp') ? 1.5 : 1;
    return Math.round(base * multiplier);
  }, []);

  const addLog = useCallback((entry: string) => {
    setLogs(prev => [entry, ...prev].slice(0, 6));
  }, []);

  useEffect(() => {
    addLog('~ PASSIVE NODE ONLINE');
  }, [addLog]);

  const tutorialSlides: TutorialSlide[] = useMemo(() => ([
    {
      title: 'Protocolo de Expansão',
      text: 'O Rio Digital precisa crescer. Colete recursos nas fontes 0, 1 e 2 para preparar novas bases.',
      highlight: [0, 1, 2],
    },
    {
      title: 'Ciclo do Boto',
      text: 'Navegue até um slot vazio, construa (BUILD), instale (INSTALL) e ative (UPGRADE) para torná-lo produtivo.',
      highlight: [4, 5, 6],
    },
    {
      title: 'Converter e Evoluir',
      text: 'Quando o nó estiver ativo, use CONVERT <recurso> para transformá-lo em uma nova fonte e ganhar 100 pontos.',
      highlight: [6, 7, 8],
    },
  ]), []);

  const generateTextFromScript = useCallback((instructions: BotInstruction[]) => {
    return instructions
      .map((instr) => {
        const base = instr.command;
        const parts = [base];
        if (instr.target !== undefined) parts.push(String(instr.target));
        if (instr.resource) parts.push(instr.resource);
        return parts.join(' ');
      })
      .join('\n');
  }, []);

  useEffect(() => {
    if (viewMode === 'VISUAL') {
      setTextCode(generateTextFromScript(script));
    }
  }, [script, viewMode, generateTextFromScript]);

  const normalizeCommand = (cmd: string) => {
    if (cmd === 'PLANT') return 'INSTALL';
    return cmd;
  };

  const parseCodeToScript = useCallback((code: string) => {
    const lines = code.split('\n');
    const parsed: BotInstruction[] = [];

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      if (!line) return;

      const parts = line.toUpperCase().split(/\s+/).filter(Boolean);
      const baseCommand = normalizeCommand(parts[0]);
      if (!['GOTO', 'HARVEST', 'BUILD', 'INSTALL', 'UPGRADE', 'CONVERT', 'BREAK'].includes(baseCommand)) {
        addLog(`! IGNORE LINE ${idx}: ${parts[0]}`);
        return;
      }

      const instruction: BotInstruction = { id: createInstructionId(), command: baseCommand as BotInstruction['command'] };

      if (baseCommand === 'GOTO') {
        const target = Number(parts[1]);
        if (!Number.isNaN(target) && target >= 0 && target <= 8) {
          instruction.target = target;
        } else {
          instruction.target = 0;
        }
      }

      if (baseCommand === 'CONVERT') {
        const resource = parts[1];
        if (resource && RESOURCE_ORDER.includes(resource as ResourceType)) {
          instruction.resource = resource as ResourceType;
        } else {
          instruction.resource = 'MATERIAL';
        }
      }

      if (baseCommand === 'HARVEST' && parts[1] && RESOURCE_ORDER.includes(parts[1] as ResourceType)) {
        instruction.resource = parts[1] as ResourceType;
      }

      parsed.push(instruction);
    });

    if (parsed.length) {
      setScript(parsed);
      setCurrentLine(0);
    }
  }, [addLog]);

  const updateResources = useCallback((mutator: (prev: ResourceInventory) => ResourceInventory) => {
    setResources(prev => {
      const next = mutator(prev);
      resourcesRef.current = next;
      return next;
    });
  }, []);

  const updateNodes = useCallback((mutator: (prev: ArenaNode[]) => ArenaNode[]) => {
    setNodes(prev => {
      const next = mutator(prev);
      nodesRef.current = next;
      return next;
    });
  }, []);

  const updateBotPosition = useCallback((nextPos: number) => {
    setBotPos(nextPos);
    botPosRef.current = nextPos;
  }, []);

  const handleCycleResource = (instructionId: string) => {
    setScript(prev => prev.map(instr => {
      if (instr.id !== instructionId) return instr;
      const current = instr.resource ?? 'MATERIAL';
      const index = RESOURCE_ORDER.indexOf(current);
      const nextResource = RESOURCE_ORDER[(index + 1) % RESOURCE_ORDER.length];
      return { ...instr, resource: nextResource };
    }));
  };

  const handleCycleTarget = (instructionId: string) => {
    setScript(prev => prev.map(instr => {
      if (instr.id !== instructionId) return instr;
      const nextTarget = ((instr.target ?? 0) + 1) % nodesRef.current.length;
      return { ...instr, target: nextTarget };
    }));
  };

  const handleUpgradePurchase = useCallback((upgrade: ArenaUpgrade) => {
    if (hasUpgrade(upgrade.id)) return;
    if (shardsRef.current < upgrade.cost) {
      addLog('! PRECISA DE MAIS SHARDS');
      return;
    }

    setShards(prev => prev - upgrade.cost);
    setAcquiredUpgrades(prev => [...prev, upgrade.id]);
    addLog(`++ UPGRADE UNLOCKED: ${upgrade.label.toUpperCase()}`);
  }, [addLog, hasUpgrade]);

  const updateNodeState = useCallback((nodeId: number, fromState: ArenaNode['state'], toState: ArenaNode['state']) => {
    const node = nodesRef.current.find(n => n.id === nodeId);
    if (!node || node.state !== fromState || node.type !== 'PLOT') {
      addLog(`! NODE ${nodeId} BUSY`);
      return;
    }

    updateNodes(prev => prev.map(n => (n.id === nodeId ? { ...n, state: toState } : n)));

    addLog(`> NODE ${nodeId} -> ${toState}`);
  }, [addLog, updateNodes]);

  const executeStep = useCallback(() => {
    const instructions = scriptRef.current;
    if (!instructions.length) return;

    const currentInstruction = instructions[currentLineRef.current];
    if (!currentInstruction) return;

    const advance = () => {
      const nextLine = (currentLineRef.current + 1) % instructions.length;
      currentLineRef.current = nextLine;
      setCurrentLine(nextLine);
    };

    switch (currentInstruction.command) {
      case 'GOTO': {
        const target = currentInstruction.target ?? 0;
        updateBotPosition(target);
        addLog(`> MOVE TO ${target}`);
        break;
      }
      case 'HARVEST': {
        const node = nodesRef.current.find(n => n.id === botPosRef.current);
        if (node?.type === 'SOURCE' && (node.state === 'ACTIVE' || node.state === 'CONVERTED')) {
          const harvestedType = currentInstruction.resource ?? node.sourceType ?? 'MATERIAL';
          const amount = node.level;
          updateResources(prev => ({
            ...prev,
            [harvestedType]: prev[harvestedType] + amount,
          }));
          addLog(`+ HARVEST ${harvestedType} (+${amount})`);
        } else {
          addLog(`! NO SOURCE @${botPosRef.current}`);
        }
        break;
      }
      case 'BUILD': {
        if (resourcesRef.current.MATERIAL >= 5) {
          updateResources(prev => ({ ...prev, MATERIAL: prev.MATERIAL - 5 }));
          updateNodeState(botPosRef.current, 'EMPTY', 'BUILT');
        } else {
          addLog('! NEED 5 MATERIAL');
        }
        break;
      }
      case 'INSTALL': {
        if (resourcesRef.current.SEED >= 5) {
          updateResources(prev => ({ ...prev, SEED: prev.SEED - 5 }));
          updateNodeState(botPosRef.current, 'BUILT', 'SEEDED');
        } else {
          addLog('! NEED 5 SEED');
        }
        break;
      }
      case 'UPGRADE': {
        if (resourcesRef.current.ENERGY >= 5) {
          updateResources(prev => ({ ...prev, ENERGY: prev.ENERGY - 5 }));
          updateNodeState(botPosRef.current, 'SEEDED', 'ACTIVE');
        } else {
          addLog('! NEED 5 ENERGY');
        }
        break;
      }
      case 'CONVERT': {
        const node = nodesRef.current.find(n => n.id === botPosRef.current);
        if (node && node.state === 'ACTIVE' && node.type === 'PLOT') {
          const convertCost = hasUpgrade('convert_discount') ? 15 : 20;
          if (resourcesRef.current.MATERIAL >= convertCost && resourcesRef.current.ENERGY >= convertCost) {
            const targetResource = currentInstruction.resource ?? 'MATERIAL';
            updateResources(prev => ({
              ...prev,
              MATERIAL: prev.MATERIAL - convertCost,
              ENERGY: prev.ENERGY - convertCost,
            }));
            const comboLevel = node.comboLevel ?? 0;
            const baseYield = RESOURCE_BASE_YIELD[targetResource];
            const comboYield = comboLevel * comboBonusValue();
            const plotLevel = node.level ?? 0;
            const newYield = baseYield + comboYield + Math.max(0, plotLevel - 1);
            const convertReward = 100 + comboLevel * 25 + (hasUpgrade('convert_discount') ? 10 : 0);
            ensureSessionStart();
            setScore(prev => prev + convertReward);
            updateNodes(prev => prev.map(n => (n.id === botPosRef.current
              ? {
                  ...n,
                  type: 'SOURCE',
                  sourceType: targetResource,
                  state: 'CONVERTED',
                  label: `${SOURCE_LABEL_MAP[targetResource]}${comboLevel > 0 ? `+${comboLevel}` : ''}`,
                  level: Math.max(1, (n.level || 1) + 1),
                  yieldRate: newYield,
                  comboLevel,
                }
              : n)));
            addLog(`*** CONVERT ${botPosRef.current} => ${targetResource} (+${convertReward} | +${newYield}/tick)`);
          } else {
            addLog(`! NEED ${convertCost} MATERIAL & ${convertCost} ENERGY`);
          }
        } else {
          addLog(`! NODE ${botPosRef.current} NOT READY`);
        }
        break;
      }
      case 'BREAK': {
        const node = nodesRef.current.find(n => n.id === botPosRef.current);
        if (!node) {
          addLog('! NO NODE FOUND');
          break;
        }

        if (node.type === 'SOURCE' && node.state === 'CONVERTED' && node.id >= 3) {
          const nextCombo = (node.comboLevel ?? 0) + 1;
          const shardReward = 5 + nextCombo * 3;
          const pointReward = 20 * nextCombo;
          ensureSessionStart();
          setScore(prev => prev + pointReward);
          updateResources(prev => ({
            ...prev,
            MATERIAL: prev.MATERIAL + 5,
          }));
          setShards(prev => prev + shardReward);
          updateNodes(prev => prev.map(n => (n.id === botPosRef.current
            ? {
                id: n.id,
                type: 'PLOT',
                state: 'EMPTY',
                level: 0,
                label: undefined,
                yieldRate: undefined,
                sourceType: undefined,
                comboLevel: nextCombo,
              }
            : n)));
          addLog(`> BREAK NODE ${botPosRef.current} | combo x${nextCombo} (+${pointReward} pts | +${shardReward} shards)`);
        } else if (node.type === 'PLOT' && node.state !== 'EMPTY') {
          updateNodes(prev => prev.map(n => (n.id === botPosRef.current
            ? {
                ...n,
                state: 'EMPTY',
              }
            : n)));
          addLog(`> RESET NODE ${botPosRef.current}`);
        } else {
          addLog('! NOTHING TO BREAK');
        }
        break;
      }
      default:
        break;
    }

    advance();
  }, [addLog, comboBonusValue, ensureSessionStart, hasUpgrade, updateBotPosition, updateNodeState, updateNodes, updateResources]);

  useEffect(() => {
    if (!isRunning) {
      setStartTime(null);
      setPps(0);
      return;
    }

    if (!scriptRef.current.length) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const interval = setInterval(() => {
      executeStep();
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [isRunning, executeStep, startTime]);

  useEffect(() => {
    if (!hasRunOnce) return;

    const interval = setInterval(() => {
      const yieldGain = computePassiveYield(nodesRef.current, acquiredUpgrades);

      if (yieldGain > 0) {
        ensureSessionStart();
        setScore(prev => prev + yieldGain);
        passiveTickRef.current += 1;
        if (passiveTickRef.current % PASSIVE_LOG_FREQUENCY === 0) {
          addLog(`~ PASSIVE FLOW +${yieldGain}`);
        }
      }
    }, PASSIVE_TICK);

    return () => clearInterval(interval);
  }, [acquiredUpgrades, addLog, computePassiveYield, ensureSessionStart, hasRunOnce]);

  useEffect(() => {
    if (!startTime) return;
    if (score <= 0) return;

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    if (elapsedSeconds > 0) {
      setPps(parseFloat((score / elapsedSeconds).toFixed(1)));
    }
  }, [score, startTime]);

  const themeConfig = useMemo(() => ({
    cyber: {
      bg: 'bg-background font-porto text-[#ffe9cc]',
      grid: 'grid-cols-3 gap-4',
      nodeShape: 'rounded-2xl border-4 border-[#1b3648] porto-panel',
      nodeColors: {
        SOURCE: 'bg-[#2a4a64] border-[#58a6d8] shadow-[0_12px_24px_rgba(0,0,0,0.3)]',
        EMPTY: 'bg-[#17384c]/60 border-[#102635] border-dashed border-2',
        BUILT: 'bg-[#2a4a64]/70 border-[#fcbf49]/40',
        SEEDED: 'bg-[#2a4a64]/80 border-[#fcbf49]',
        ACTIVE: 'bg-[#58a6d8] border-[#fcbf49] shadow-[0_15px_28px_rgba(88,166,216,0.45)]',
        CONVERTED: 'bg-[#fcbf49] border-[#ffe4a0] shadow-[0_18px_32px_rgba(252,191,73,0.45)]',
      },
      labels: { MATERIAL: 'MADEIRA', SEED: 'MUDAS', ENERGY: 'ENERGIA' },
      icons: { MATERIAL: Database, SEED: Sprout, ENERGY: Zap },
    },
    game: {
      bg: "bg-background text-white font-['Press_Start_2P'] pixel-scanlines",
      grid: 'grid-cols-3 gap-2',
      nodeShape: 'rounded-none',
      nodeColors: {
        SOURCE: 'bg-[#1b0f33] border-4 border-[#ff4081] shadow-[4px_4px_0px_rgba(0,0,0,0.7)]',
        EMPTY: 'bg-[#120822] border-4 border-[#372054] border-dashed',
        BUILT: 'bg-[#2a1750] border-4 border-[#ffeb3b]',
        SEEDED: 'bg-[#1f3d2a] border-4 border-[#00ff8c]',
        ACTIVE: 'bg-[#ffeb3b] border-4 border-[#ff4081]',
        CONVERTED: 'bg-[#00ff8c] border-4 border-[#ffeb3b]',
      },
      labels: { MATERIAL: 'WOOD', SEED: 'SEED', ENERGY: 'MANA' },
      icons: { MATERIAL: Hammer, SEED: Sprout, ENERGY: Zap },
    },
    sport: {
      bg: "bg-background text-white font-['Russo_One'] uppercase",
      grid: 'grid-cols-3 gap-6 skew-x-[-6deg]',
      nodeShape: 'rounded-md',
      nodeColors: {
        SOURCE: 'bg-[#10203d] border-l-8 border-[#ff6347] shadow-[0_12px_24px_rgba(0,0,0,0.35)]',
        EMPTY: 'bg-[#101a33]/60 border border-[#24406e]',
        BUILT: 'bg-[#17264a] border-l-8 border-[#2979ff]',
        SEEDED: 'bg-[#142d38] border-l-8 border-[#4caf50]',
        ACTIVE: 'bg-[#ff6347] border-4 border-white scale-[1.03]',
        CONVERTED: 'bg-[#ffcf4a] border-4 border-white',
      },
      labels: { MATERIAL: 'FERRO', SEED: 'SUP', ENERGY: 'STM' },
      icons: { MATERIAL: Hammer, SEED: Sprout, ENERGY: Zap },
    },
  })[theme], [theme]);

  const passiveRate = useMemo(() => computePassiveYield(nodes, acquiredUpgrades), [nodes, acquiredUpgrades, computePassiveYield]);
  const passiveRateDisplay = hasRunOnce ? passiveRate : 0;

  const convertedCount = useMemo(() => (
    nodes.filter(node => node.type === 'SOURCE' && node.state === 'CONVERTED').length
  ), [nodes]);

  const isHighlight = useCallback((nodeId: number) => {
    const highlight = tutorialSlides[tutorialStep]?.highlight;
    return showTutorial && highlight?.includes(nodeId);
  }, [tutorialSlides, tutorialStep, showTutorial]);

  const ResourceIcon = (type: ResourceType) => {
    const Icon = themeConfig.icons[type];
    return <Icon className="w-4 h-4" />;
  };

  const handleAddInstruction = (command: BotInstruction['command']) => {
    setScript(prev => ([
      ...prev,
      {
        id: createInstructionId(),
        command,
        target: command === 'GOTO' ? 0 : undefined,
        resource: command === 'HARVEST' ? 'MATERIAL' : command === 'CONVERT' ? 'MATERIAL' : undefined,
      },
    ]));
  };

  const handleRunToggle = () => {
    const starting = !isRunning;

    if (starting && viewMode === 'CODE') {
      parseCodeToScript(textCode);
    }
    if (starting) {
      currentLineRef.current = 0;
      setCurrentLine(0);
      setStartTime(null);
      setHasRunOnce(true);
    }
    setIsRunning(prev => !prev);
  };

  const handleViewSwitch = (mode: 'VISUAL' | 'CODE') => {
    if (mode === 'VISUAL') {
      parseCodeToScript(textCode);
    }
    setViewMode(mode);
  };

  return (
    <div className={`min-h-screen pb-24 pt-20 px-2 flex flex-col transition-colors duration-500 ${themeConfig.bg}`}>
      <ArenaTutorial
        open={showTutorial}
        theme={theme}
        customization={user.customization}
        step={tutorialStep}
        slides={tutorialSlides}
        onAdvance={() => {
          if (tutorialStep < tutorialSlides.length - 1) {
            setTutorialStep(step => step + 1);
          } else {
            setTutorialStep(0);
            setShowTutorial(false);
          }
        }}
        onClose={() => {
          setTutorialStep(0);
          setShowTutorial(false);
        }}
      />

      <div className="flex justify-between items-end mb-4 px-3">
        <div className="flex space-x-4">
          <div className={`flex flex-col ${theme === 'cyber' ? 'text-[#fcbf49]' : theme === 'game' ? 'text-[#ffeb3b]' : 'text-[#ff6347]'}`}>
            <span className={`text-[10px] opacity-70 ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>SCORE</span>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className={`flex flex-col ${theme === 'cyber' ? 'text-[#58a6d8]' : theme === 'game' ? 'text-[#00ff8c]' : 'text-[#8ea4ff]'}`}>
            <span className={`text-[10px] opacity-70 ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>PPS</span>
            <span className="text-xl font-bold">{pps.toFixed(1)}</span>
          </div>
          <div className={`flex flex-col transition-transform duration-300 ${shardPulse ? 'scale-110' : ''} ${theme === 'cyber' ? 'text-[#ffe0a3]' : theme === 'game' ? 'text-[#ffeb3b]' : 'text-[#ffcf4a]'}`}>
            <div className={`text-[10px] opacity-70 flex items-center space-x-1 ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>
              <Sparkles className="w-3 h-3" />
              <span>SHARDS</span>
            </div>
            <span className="text-xl font-bold">{shards}</span>
          </div>
          <div className={`flex flex-col ${theme === 'cyber' ? 'text-[#58a6d8]' : theme === 'game' ? 'text-[#00ff8c]' : 'text-[#ffcf4a]'}`}>
            <div className={`text-[10px] opacity-70 flex items-center space-x-1 ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>
              <InfinityIcon className="w-3 h-3" />
              <span>FLOW</span>
            </div>
            <span className="text-xl font-bold">{passiveRateDisplay}/tick</span>
            {convertedCount > 0 && (
              <span className={`text-[9px] ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>{convertedCount} nodes</span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setTutorialStep(0);
            setShowTutorial(true);
          }}
          className={`${theme === 'cyber' ? 'text-[#d4e8f6] hover:text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className={`flex justify-around items-center p-3 mb-4 sticky top-16 z-30 ${theme === 'game'
        ? 'bg-[#20123b] border-4 border-[#ff4081] shadow-[6px_6px_0px_rgba(0,0,0,0.6)] pixel-scanlines'
        : theme === 'sport'
        ? 'bg-[#0f1b3a] border-b-4 border-[#ff6347] -skew-x-12 shadow-[0_12px_24px_rgba(0,0,0,0.35)]'
        : 'porto-panel border-4 border-[#17384c] rounded-2xl'
      }`}>
        {RESOURCE_ORDER.map((resource) => (
          <div key={resource} className={`flex items-center space-x-2 ${theme === 'sport' ? 'skew-x-12' : ''}`}>
            <div className={`p-1.5 rounded ${theme === 'cyber' ? 'bg-[#17384c] text-[#fcbf49]' : theme === 'game' ? 'bg-black text-[#00ff8c]' : 'bg-[#101a33] text-[#ffcf4a]'}`}>
              {ResourceIcon(resource)}
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] opacity-60 ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/70'}`}>{themeConfig.labels[resource]}</span>
              <span className="text-lg font-bold leading-none">{resources[resource]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-amber-200">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs tracking-wide font-mono">SHARD FORGE</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Use shards para desbloquear upgrades.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ARENA_UPGRADES.map(upgrade => {
            const unlocked = hasUpgrade(upgrade.id);
            const affordable = shards >= upgrade.cost;
            const Icon = upgrade.icon;
            return (
              <button
                key={upgrade.id}
                onClick={() => handleUpgradePurchase(upgrade)}
                disabled={unlocked}
                className={`relative group text-left p-3 rounded-lg border transition-all duration-300 ${
                  unlocked
                    ? 'bg-boto-500/20 border-boto-400/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : affordable
                    ? 'bg-surface/60 border-boto-500/40 hover:border-boto-500 hover:bg-boto-500/10'
                    : 'bg-surface/40 border-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-2 rounded-full ${unlocked ? 'bg-boto-500/30' : 'bg-black/40'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide">{upgrade.label}</p>
                    <p className="text-[10px] text-slate-400">Custo: {upgrade.cost} shards</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 font-mono">{upgrade.description}</p>
                {unlocked && (
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-boto-200">ATIVO</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center mb-4">
        <div className={`grid ${themeConfig.grid} w-full max-w-sm`}>
          {nodes.map((node) => {
            const isBotHere = botPos === node.id;
            const colorKey = node.state === 'CONVERTED' ? 'CONVERTED' : node.type === 'SOURCE' ? 'SOURCE' : node.state;
            const colorClass = themeConfig.nodeColors[colorKey];

            return (
              <motion.div
                key={node.id}
                layout
                className={`aspect-square flex flex-col items-center justify-center relative transition-all duration-300 ${themeConfig.nodeShape} ${colorClass} ${isHighlight(node.id) ? 'ring-4 ring-boto-500/60 scale-[1.05]' : ''}`}
              >
                <span className={`text-[10px] absolute top-1 ${theme === 'game' ? 'text-black bg-white px-1' : 'text-white/60'}`}>
                  {node.id}
                </span>

                {node.state === 'CONVERTED' && (
                  <motion.div
                    className="absolute inset-1 rounded-full bg-white/10 blur-xl opacity-60"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {node.type === 'SOURCE' && node.sourceType && (
                  <div className={`${theme === 'cyber' ? 'animate-pulse' : ''} text-white scale-150 z-10`}> 
                    {ResourceIcon(node.sourceType)}
                  </div>
                )}

                {node.state === 'BUILT' && <Hammer className="w-6 h-6 text-white/60" />}
                {node.state === 'SEEDED' && <Sprout className="w-6 h-6 text-green-400" />}

                {node.label && (
                  <span className={`absolute bottom-1 text-[10px] tracking-widest ${theme === 'game' ? 'text-white' : 'text-white/70'}`}>
                    {node.label}
                  </span>
                )}
                {node.state === 'CONVERTED' && (
                  <motion.span
                    className="absolute top-6 text-[9px] font-mono text-white/80"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    +{node.yieldRate ?? 0}/tick
                  </motion.span>
                )}
                {node.comboLevel && node.comboLevel > 0 && (
                  <span className="absolute bottom-6 text-[9px] font-mono text-amber-200">Combo x{node.comboLevel}</span>
                )}

                {isBotHere && (
                  <motion.div
                    layoutId="arena-boto"
                    className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  >
                    <BotoAvatar {...user.customization} size="sm" className={theme === 'cyber' ? 'filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : ''} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={`flex flex-col h-72 overflow-hidden transition-all relative z-40 ${
        theme === 'game'
          ? 'bg-[#120822] border-t-4 border-[#ff4081] pixel-scanlines'
          : theme === 'sport'
          ? 'bg-[#0f1b3a] border-t-4 border-[#ff6347]'
          : 'porto-panel border-t-4 border-[#17384c] rounded-t-3xl'
      }`}>
        <div className={`flex items-center justify-between p-2 ${theme === 'game' ? 'border-b-2 border-[#ff4081] bg-[#1b0f33]' : theme === 'sport' ? 'border-b-4 border-[#ff6347] bg-[#10203d] -skew-x-6' : 'border-b-2 border-[#17384c] bg-[#17384c]/60 rounded-t-3xl'}`}>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={isRunning ? 'danger' : 'success'}
              onClick={handleRunToggle}
              className="flex items-center space-x-1"
            >
              {isRunning ? <Pause size={12} /> : <Play size={12} />}
              <span>{isRunning ? 'STOP' : 'RUN'}</span>
            </Button>

            <div className={`flex rounded p-0.5 ${theme === 'cyber' ? 'bg-[#17384c] border border-[#58a6d8]/40' : theme === 'game' ? 'bg-black border border-[#ff4081]' : 'bg-[#10203d] border border-[#2979ff]'}`}>
              <button
                onClick={() => handleViewSwitch('VISUAL')}
                className={`p-1.5 rounded ${viewMode === 'VISUAL' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <Layout size={12} />
              </button>
              <button
                onClick={() => handleViewSwitch('CODE')}
                className={`p-1.5 rounded ${viewMode === 'CODE' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <Code size={12} />
              </button>
            </div>
          </div>
          <div className={`text-[10px] font-mono ${theme === 'cyber' ? 'text-[#d4e8f6]' : 'text-white/60'}`}>
            {viewMode === 'CODE' ? 'TEXT_MODE' : `BLOCKS: ${script.length}`}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {viewMode === 'VISUAL' ? (
            <>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                {script.map((instr, idx) => (
                  <div
                    key={instr.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono border transition-all ${
                      idx === currentLine && isRunning
                        ? 'bg-boto-500 text-slate-900 border-white scale-105 shadow-lg'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="opacity-50 w-4 text-right">{idx}</span>
                      <span className="font-bold text-blue-400">{instr.command}</span>
                      {instr.target !== undefined && (
                        <button
                          disabled={isRunning}
                          onClick={() => handleCycleTarget(instr.id)}
                          className={`px-1 py-0.5 border rounded ${isRunning ? 'opacity-30' : 'hover:border-boto-500'} ${theme === 'game' ? 'border-white text-yellow-400' : 'border-slate-600 text-yellow-300'}`}
                        >
                          #{instr.target}
                        </button>
                      )}
                      {instr.resource && (
                        <button
                          disabled={isRunning}
                          onClick={() => handleCycleResource(instr.id)}
                          className={`px-1 py-0.5 border rounded ${isRunning ? 'opacity-30' : 'hover:border-boto-500'} ${theme === 'game' ? 'border-white text-green-300' : 'border-slate-600 text-green-300'}`}
                        >
                          {instr.resource}
                        </button>
                      )}
                    </div>
                    {!isRunning && (
                      <button onClick={() => setScript(prev => prev.filter(item => item.id !== instr.id))} className="text-slate-500 hover:text-red-500">
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
                {script.length === 0 && (
                  <div className="text-center text-slate-500 text-xs py-12 flex flex-col items-center space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p>Adicione blocos para iniciar o loop.</p>
                  </div>
                )}
              </div>
              {!isRunning && (
                <div className="w-28 bg-black/25 border-l border-white/10 p-2 space-y-2 overflow-y-auto">
                  {[
                    { cmd: 'GOTO' as const, label: 'GOTO', color: 'bg-blue-900/50 text-blue-300' },
                    { cmd: 'HARVEST' as const, label: 'HARVEST', color: 'bg-green-900/40 text-green-300' },
                    { cmd: 'BUILD' as const, label: 'BUILD', color: 'bg-purple-900/40 text-purple-300' },
                    { cmd: 'INSTALL' as const, label: 'INSTALL', color: 'bg-yellow-900/40 text-yellow-300' },
                    { cmd: 'UPGRADE' as const, label: 'UPGRADE', color: 'bg-orange-900/40 text-orange-300' },
                    { cmd: 'CONVERT' as const, label: 'CONVERT', color: 'bg-red-900/40 text-red-300' },
                    { cmd: 'BREAK' as const, label: 'BREAK', color: 'bg-slate-900/50 text-slate-300' },
                  ].map(option => (
                    <button
                      key={option.cmd}
                      onClick={() => handleAddInstruction(option.cmd)}
                      className={`w-full text-[9px] py-2 rounded border border-white/10 ${option.color} hover:brightness-125 transition`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 bg-[#1e1e1e] p-2 relative">
              <textarea
                value={textCode}
                onChange={(event) => setTextCode(event.target.value)}
                disabled={isRunning}
                className="w-full h-full bg-transparent text-green-400 font-mono text-sm focus:outline-none resize-none"
                spellCheck={false}
                placeholder={`GOTO 0\nHARVEST MATERIAL\nGOTO 3\nBUILD`}
              />
              {isRunning && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                  <span className="text-red-500 font-mono bg-black/80 px-3 py-1 rounded">READ ONLY (RUNNING)</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`h-9 p-1 px-2 text-[10px] font-mono flex items-center border-t ${theme === 'cyber' ? 'bg-[#102635] text-[#fcbf49] border-[#17384c]' : theme === 'game' ? 'bg-black text-[#00ff8c] border-[#ff4081]' : 'bg-[#0f1b3a] text-[#ffcf4a] border-[#ff6347]'}`}>
          <span className="mr-2 opacity-50">$</span>
          <span className="truncate uppercase tracking-[0.2em]">{logs[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default ArenaPage;

