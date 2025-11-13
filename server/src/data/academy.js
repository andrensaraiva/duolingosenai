const academyPath = [
  {
    id: "lesson-python-hello",
    type: "lesson",
    title: "Primeiro contato",
    skill: "print & comentários",
    icon: "circle",
    rewardXp: 10,
  },
  {
    id: "lesson-python-variables",
    type: "lesson",
    title: "Variáveis que contam histórias",
    skill: "variáveis",
    icon: "circle",
    rewardXp: 15,
  },
  {
    id: "lesson-python-types",
    type: "lesson",
    title: "Tipos e strings úteis",
    skill: "tipos",
    icon: "circle",
    rewardXp: 20,
  },
  {
    id: "lesson-python-operations",
    type: "lesson",
    title: "Operações e entrada",
    skill: "expressões",
    icon: "circle",
    rewardXp: 25,
  },
  {
    id: "lesson-python-conditionals",
    type: "lesson",
    title: "Tomando decisões",
    skill: "if/else",
    icon: "circle",
    rewardXp: 30,
  },
  {
    id: "checkpoint-python-foundations",
    type: "checkpoint",
    title: "Fundamentos Python liberados",
    skill: "Arena",
    icon: "checkpoint",
    rewardXp: 80,
    unlocksChallenge: "challenge-automation-lab",
  },
];

const lessonContent = {
  "lesson-python-hello": {
    durationMinutes: 2,
    cards: [
      {
        type: "concept",
        title: "Python fala por texto",
        body:
          "Imagine um treinador celebrando cada passo. Em Python, esse papel é do print(): ele narra em voz alta o que sua automação faz e mantém o jogador confiante.",
      },
      {
        type: "code",
        title: "Primeira execução",
        snippet: "# status da automação\nprint('Iniciando coleta de sensores...')",
        explanation: "Linhas iniciadas com # são comentários. Use-os para narrar o que o robô está fazendo.",
      },
      {
        type: "quiz",
        prompt: "Como imprimir o texto 'Pronto para automatizar'?",
        choices: ["echo('Pronto para automatizar')", "print('Pronto para automatizar')", "console.log('Pronto para automatizar')"],
        answer: "print('Pronto para automatizar')",
        feedback: "Em Python usamos print(). Outros comandos pertencem a shells diferentes.",
      },
    ],
  },
  "lesson-python-variables": {
    durationMinutes: 3,
    cards: [
      {
        type: "concept",
        title: "Variáveis guardam contexto",
        body:
          "Cada variável é um slot na mochila do jogador. Quando você dá nomes claros, combina itens e ganha combos de produtividade.",
      },
      {
        type: "code",
        title: "Capturando estados",
        snippet: "temperatura_media = 28\nalerta_ativo = False\nmensagem = f'Temp: {temperatura_media}°C'",
        explanation: "Cada atribuição usa =. Strings f'' permitem interpolar variáveis rapidamente.",
      },
      {
        type: "quiz",
        prompt: "Complete o código para guardar o nome do operador.",
        codeBefore: "operador = ",
        codeAfter: "",
        choices: ["nome", "'nome'", "user.nome"],
        answer: "'nome'",
        feedback: "Valores literais de texto precisam estar entre aspas.",
      },
    ],
  },
  "lesson-python-types": {
    durationMinutes: 3,
    cards: [
      {
        type: "concept",
        title: "Misture números e strings",
        body:
          "Sensores enviam dados em todos os sabores. Converter tipos rápido evita perder vidas com bugs bobos.",
      },
      {
        type: "code",
        title: "Normalizando dados",
        snippet: "leitura = '42'\ncontador = int(leitura)\nstatus = f\"Sensores ativos: {contador}\"",
        explanation: "Converta antes de operar. Um str + int gera erro, mas int('42') transforma o texto em número.",
      },
      {
        type: "arrange",
        prompt: "Organize para formar um relatório formatado.",
        blocks: ["f'Bateria: {nivel}%'", "nivel = int(dado)", "dado = '78'"],
        solution: ["dado = '78'", "nivel = int(dado)", "f'Bateria: {nivel}%'"],
        feedback: "Converta antes de interpolar. Assim evitamos '78%' virar string duplicada.",
      },
    ],
  },
  "lesson-python-operations": {
    durationMinutes: 3,
    cards: [
      {
        type: "concept",
        title: "Expressões automatizam cálculos",
        body:
          "Operadores são power-ups: com eles você estima tempo, soma recursos e desbloqueia decisões em segundos.",
      },
      {
        type: "code",
        title: "Planejando ciclos",
        snippet: "ciclos = int(input('Quantos ciclos executar? '))\ntempo_estimado = ciclos * 8\nprint(f'Rodada levará {tempo_estimado} segundos')",
        explanation: "Transforme a entrada do usuário em inteiro antes de multiplicar.",
      },
      {
        type: "quiz",
        prompt: "Qual expressão calcula a média?",
        choices: ["valor1 + valor2 / 2", "(valor1 + valor2) / 2", "valor1 + valor2 * 2"],
        answer: "(valor1 + valor2) / 2",
        feedback: "Use parênteses para garantir a ordem correta.",
      },
    ],
  },
  "lesson-python-conditionals": {
    durationMinutes: 4,
    cards: [
      {
        type: "concept",
        title: "If/else evitam panes",
        body:
          "If/else é o momento do julgamento: como num checkpoint do Duolingo, você decide se segue ou recomeça antes de perder streak.",
      },
      {
        type: "code",
        title: "Decidindo ações",
        snippet:
          "if temperatura_media > 30:\n    print('Ativar resfriamento')\nelse:\n    print('Tudo estável')",
        explanation: "Sempre alinhe a indentação. O bloco else roda apenas quando a condição é falsa.",
      },
      {
        type: "quiz",
        prompt: "Qual condição verifica se um log começa com 'ALERTA'?",
        choices: ["log.startsWith('ALERTA')", "log.startswith('ALERTA')", "log.first('ALERTA')"],
        answer: "log.startswith('ALERTA')",
        feedback: "startswith é o método python para strings.",
      },
      {
        type: "arrange",
        prompt: "Ordene o fluxo para validar nível de bateria.",
        blocks: ["    print('Recarregar agora')", "if bateria < 20:", "else:", "    print('Nível seguro')"],
        solution: ["if bateria < 20:", "    print('Recarregar agora')", "else:", "    print('Nível seguro')"],
        feedback: "Garanta 4 espaços dentro de cada bloco.",
      },
    ],
  },
};

module.exports = { academyPath, lessonContent };
