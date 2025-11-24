import { User, Lesson, Mission, Challenge, LessonType } from '../types';

export const INITIAL_USER: User = {
  id: 'u1',
  codename: 'BotoExplorador',
  xp: 1250,
  hearts: 5,
  maxHearts: 5,
  streak: 12,
  coins: 450,
  completedLessons: ['l1'],
  completedMissions: [],
  inventory: ['double_xp'],
  activeTheme: 'cyber',
  customization: {
    color: 'pink',
    hat: 'none',
    accessory: 'none'
  }
};

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Olá, Rio!',
    description: 'Introdução ao Python e print()',
    xpReward: 10,
    locked: false,
    completed: true,
    position: 'center',
    steps: []
  },
  {
    id: 'l2',
    title: 'Mergulho Profundo',
    description: 'Variáveis e tipos de dados',
    xpReward: 15,
    locked: false,
    completed: false,
    position: 'left',
    steps: [
      {
        id: 's1',
        type: LessonType.CONCEPT,
        content: 'No fundo do rio, guardamos tesouros em *variáveis*. Uma variável é como uma concha onde você pode guardar um valor.',
      },
      {
        id: 's2',
        type: LessonType.QUIZ,
        content: 'Como criamos uma variável chamada `peixe` com o valor "Dourado"?',
        options: ['peixe == "Dourado"', 'peixe = "Dourado"', '"Dourado" = peixe'],
        correctAnswer: 'peixe = "Dourado"',
        explanation: 'Usamos o sinal de igual `=` para atribuir valor.'
      },
      {
        id: 's3',
        type: LessonType.CODE_ORDER,
        content: 'Organize o código para definir a profundidade e mostrar na tela.',
        options: ['print(profundidade)', 'profundidade = 10'],
        correctOrder: ['profundidade = 10', 'print(profundidade)'],
      }
    ]
  },
  {
    id: 'l3',
    title: 'Correnteza Lógica',
    description: 'Estruturas condicionais (if/else)',
    xpReward: 20,
    locked: true,
    completed: false,
    position: 'right',
    steps: []
  },
  {
    id: 'l4',
    title: 'Loops do Rio',
    description: 'Repetições com For e While',
    xpReward: 25,
    locked: true,
    completed: false,
    position: 'center',
    steps: []
  }
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Nadador Veloz',
    description: 'Complete 2 lições hoje.',
    reward: { type: 'XP', value: 50 },
    current: 0,
    total: 2,
    completed: false,
    expiry: Date.now() + 86400000,
  },
  {
    id: 'm2',
    title: 'Caçador de Bugs',
    description: 'Acerte 5 exercícios seguidos sem errar.',
    reward: { type: 'COIN', value: 20 },
    current: 3,
    total: 5,
    completed: false,
    expiry: Date.now() + 86400000,
  },
  {
    id: 'm3',
    title: 'Mestre da Arena',
    description: 'Ganhe 100 pontos na Arena de Simulação.',
    reward: { type: 'BOOSTER', value: 'shield' },
    current: 45,
    total: 100,
    completed: false,
    expiry: Date.now() + 86400000,
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Limpeza do Rio',
    difficulty: 'Easy',
    description: 'Crie um loop para remover 10 itens de lixo da lista `rio`.',
    multiplier: 1.0,
    bestScore: 85,
  },
  {
    id: 'c2',
    title: 'Cardume Sincronizado',
    difficulty: 'Medium',
    description: 'Use lógica condicional para desviar de obstáculos.',
    multiplier: 1.5,
  },
  {
    id: 'c3',
    title: 'Algoritmo da Piracema',
    difficulty: 'Hard',
    description: 'Otimize a subida do rio contra a correnteza.',
    multiplier: 2.5,
  }
];