const academyPath = [
  {
    id: "lesson-python-hello",
    type: "lesson",
    title: "Primeiro contato",
    skill: "print & comentários",
    icon: "circle",
    rewardXp: 10,
    themes: {
      games: {
        title: "Callouts da raid",
        skill: "chat do clã",
      },
      sports: {
        title: "Chamada de vestiário",
        skill: "voz do capitão",
      },
    },
  },
  {
    id: "lesson-python-variables",
    type: "lesson",
    title: "Variáveis que contam histórias",
    skill: "variáveis",
    icon: "circle",
    rewardXp: 15,
    themes: {
      games: {
        title: "Inventário inteligente",
        skill: "slots & buffs",
      },
      sports: {
        title: "Planilha do treinador",
        skill: "estatísticas de quadra",
      },
    },
  },
  {
    id: "lesson-python-types",
    type: "lesson",
    title: "Tipos e strings úteis",
    skill: "tipos",
    icon: "circle",
    rewardXp: 20,
    themes: {
      games: {
        title: "Drops lendários legíveis",
        skill: "loots & conversões",
      },
      sports: {
        title: "Scout instantâneo",
        skill: "combinações numéricas",
      },
    },
  },
  {
    id: "lesson-python-operations",
    type: "lesson",
    title: "Operações e entrada",
    skill: "expressões",
    icon: "circle",
    rewardXp: 25,
    themes: {
      games: {
        title: "Teoria do DPS",
        skill: "cálculos críticos",
      },
      sports: {
        title: "Tática combinada",
        skill: "ritmo de jogo",
      },
    },
  },
  {
    id: "lesson-python-conditionals",
    type: "lesson",
    title: "Tomando decisões",
    skill: "if/else",
    icon: "circle",
    rewardXp: 30,
    themes: {
      games: {
        title: "Checks de boss",
        skill: "rotas táticas",
      },
      sports: {
        title: "VAR do código",
        skill: "leitura de campo",
      },
    },
  },
  {
    id: "checkpoint-python-foundations",
    type: "checkpoint",
    title: "Fundamentos Python liberados",
    skill: "Arena",
    icon: "checkpoint",
    rewardXp: 80,
    unlocksChallenge: "challenge-automation-lab",
    themes: {
      games: {
        title: "Passe livre da guilda",
        skill: "Arena Arcade",
      },
      sports: {
        title: "Passe dos playoffs",
        skill: "Arena Pro",
      },
    },
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
    themes: {
      games: {
        cards: [
          {
            title: "Narrador da raid",
            body:
              "print() vira seu callout oficial. Cada mensagem mantém a party sincronizada durante as mecânicas e evita wipes desnecessários.",
          },
          {
            title: "Status do clã em tela",
            snippet: "# callouts da raid\nprint('Buff na lane central!')\nprint('Boss avistado na fase 2')",
            explanation: "Comentários descrevem mecânicas, prints avisam o squad. Use os dois para manter a raid alinhada.",
          },
          {
            prompt: "Qual comando manda Boss spotted! para o chat?",
            choices: ["echo('Boss spotted!')", "print('Boss spotted!')", "console.log('Boss spotted!')"],
            answer: "print('Boss spotted!')",
            feedback: "Python usa print(). echo é do shell e console.log é do JavaScript.",
          },
        ],
      },
      sports: {
        cards: [
          {
            title: "Coach de banco",
            body:
              "print() é o quadro eletrônico portátil. Ele garante que toda a equipe ouça o ajuste tático antes da próxima posse.",
          },
          {
            title: "Chamadas no placar",
            snippet: "# instruções do técnico\nprint('Pressione a saída de bola!')\nprint('Troca defensiva agora')",
            explanation: "Comentários contam a história para o analista, enquanto print() projeta o comando para todo o elenco.",
          },
          {
            prompt: "Qual comando exibe Pronto para o treino no telão?",
            choices: ["echo('Pronto para o treino')", "print('Pronto para o treino')", "console.log('Pronto para o treino')"],
            answer: "print('Pronto para o treino')",
            feedback: "Só print() conversa com o painel Python. Os outros comandos pertencem a ambientes diferentes.",
          },
        ],
      },
    },
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
    themes: {
      games: {
        cards: [
          {
            title: "Inventário inteligente",
            body:
              "Cada variável é um slot raro. Quando você nomeia bem, sabe exatamente quais buffs ativar durante a raid.",
          },
          {
            title: "Status da party",
            snippet: "energia = 78\ncombo_pronto = True\nmensagem = f'Combo ativo: {combo_pronto}'",
            explanation: "Use = para guardar recursos. Strings com f'' permitem narrar a build sem concatenar manualmente.",
          },
          {
            prompt: "Complete para salvar o nickname do healer.",
            codeBefore: "healer = ",
            codeAfter: "",
            choices: ["nickname", "'SeivaLuz'", "squad.nickname"],
            answer: "'SeivaLuz'",
            feedback: "Sem aspas o Python procura uma variável; queremos um texto literal.",
          },
        ],
      },
      sports: {
        cards: [
          {
            title: "Planilha do treinador",
            body:
              "Variáveis são estatísticas portáteis. Elas ajudam a combinar minutagem, energia e anotações táticas sem travar o jogo.",
          },
          {
            title: "Capturando scout",
            snippet: "pontuacao = 86\nfadiga = False\nrelato = f'Pontuação atual: {pontuacao}'",
            explanation: "Atribuições claras tornam fácil compartilhar dados com comissão e atletas.",
          },
          {
            prompt: "Complete para guardar o nome do capitão.",
            codeBefore: "capitao = ",
            codeAfter: "",
            choices: ["Joana", "'Joana'", "time.capitao"],
            answer: "'Joana'",
            feedback: "Aspas indicam literal de texto; sem elas o Python procuraria outra variável.",
          },
        ],
      },
    },
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
    themes: {
      games: {
        cards: [
          {
            title: "Loots equilibrados",
            body:
              "Drops chegam como texto, número e até emoji. Converter cedo evita que a guilda perca dano por causa de tipos quebrados.",
          },
          {
            title: "Normalizando recompensas",
            snippet: "drop = '42'\nraridade = int(drop)\nstatus = f'Lutas vencidas: {raridade}'",
            explanation: "Transforme o loot antes de combinar com outros valores para fugir de erros de tipo.",
          },
          {
            prompt: "Organize os blocos para exibir o nível da run.",
            blocks: ["relato = f'Run nível: {nivel}'", "nivel = int(dado)", "dado = '78'"],
            solution: ["dado = '78'", "nivel = int(dado)", "relato = f'Run nível: {nivel}'"],
            feedback: "Primeiro definimos o texto, depois convertemos e só então montamos a mensagem.",
          },
        ],
      },
      sports: {
        cards: [
          {
            title: "Scout instantâneo",
            body:
              "Sensores enviam números e strings. Fazer o casting certo garante comparações justas entre atletas.",
          },
          {
            title: "Dashboard da comissão",
            snippet: "parcial = '19'\npontos = int(parcial)\nplacar = f'Placar oficial: {pontos}'",
            explanation: "Converta antes de calcular. Assim você evita somar texto com número e travar o painel.",
          },
          {
            prompt: "Ordene para gerar o relatório da súmula.",
            blocks: ["resumo = f'Tentativas: {total}'", "dados = '32'", "total = int(dados)"],
            solution: ["dados = '32'", "total = int(dados)", "resumo = f'Tentativas: {total}'"],
            feedback: "A súmula só faz sentido depois de converter a string em inteiro.",
          },
        ],
      },
    },
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
    themes: {
      games: {
        cards: [
          {
            title: "Burst calculado",
            body:
              "Operadores funcionam como teoria de DPS: combiná-los define o tempo de cada wave e de cada ultimate.",
          },
          {
            title: "Estimando waves",
            snippet: "waves = int(input('Quantas waves restam? '))\ntempo = waves * 8\nprint(f'Próxima fase em {tempo} segundos')",
            explanation: "Converta a entrada do shotcaller para inteiro antes de multiplicar pelo tempo médio.",
          },
          {
            prompt: "Qual expressão calcula a média de dano das últimas duas lutas?",
            choices: ["valor1 + valor2 / 2", "(valor1 + valor2) / 2", "valor1 + valor2 * 2"],
            answer: "(valor1 + valor2) / 2",
            feedback: "Agrupe com parênteses para somar antes de dividir.",
          },
        ],
      },
      sports: {
        cards: [
          {
            title: "Tática combinada",
            body:
              "Operadores são jogadas ensaiadas: multiplicam treinos, dividem esforços e mostram projeções claras para a comissão.",
          },
          {
            title: "Planejando séries",
            snippet: "series = int(input('Quantas séries faltam? '))\ntempo = series * 6\nprint(f'Sessão encerra em {tempo} minutos')",
            explanation: "Entrada do atleta chega como texto. Transforme em inteiro antes de calcular o tempo total.",
          },
          {
            prompt: "Qual expressão calcula a média de velocidade em duas parciais?",
            choices: ["parcial1 + parcial2 / 2", "(parcial1 + parcial2) / 2", "parcial1 + parcial2 * 2"],
            answer: "(parcial1 + parcial2) / 2",
            feedback: "A média só faz sentido somando as parciais antes de dividir por 2.",
          },
        ],
      },
    },
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
    themes: {
      games: {
        cards: [
          {
            title: "Checks de boss",
            body:
              "If/else decide se você empurra a fase final ou faz reset. É seu árbitro tático para evitar wipes inesperados.",
          },
          {
            title: "Chamadas de fase",
            snippet:
              "if vida_boss < 30:\n    print('Ative ultimates agora')\nelse:\n    print('Segure recursos e mantenha DPS')",
            explanation: "Indentação mantém o código legível. O else só roda quando a condição é falsa.",
          },
          {
            prompt: "Qual método confere se um log começa com ALERTA na central da guilda?",
            choices: ["log.startsWith('ALERTA')", "log.startswith('ALERTA')", "log.first('ALERTA')"],
            answer: "log.startswith('ALERTA')",
            feedback: "startswith é o método correto em Python.",
          },
          {
            prompt: "Ordene o fluxo para liberar ultimates só quando o cooldown passou.",
            blocks: ["else:", "if cooldown > 90:", "    print('Segure ultimates')", "    print('Pode soltar habilidades')"],
            solution: ["if cooldown > 90:", "    print('Segure ultimates')", "else:", "    print('Pode soltar habilidades')"],
            feedback: "Condição primeiro, depois as ações de cada ramo.",
          },
        ],
      },
      sports: {
        cards: [
          {
            title: "VAR do código",
            body:
              "If/else é o árbitro que decide se o time acelera ou chama tempo. Sem ele, você não controla risco.",
          },
          {
            title: "Monitor biométrico",
            snippet:
              "if batimentos > 185:\n    print('Substituir atleta agora')\nelse:\n    print('Pode continuar em quadra')",
            explanation: "Condição verdadeira dispara alerta médico, caso contrário a mensagem mantém o ritmo.",
          },
          {
            prompt: "Qual método verifica se o registro começa com ALERTA na sala do VAR?",
            choices: ["registro.startsWith('ALERTA')", "registro.startswith('ALERTA')", "registro.first('ALERTA')"],
            answer: "registro.startswith('ALERTA')",
            feedback: "Em Python usamos startswith() com s minúsculo.",
          },
          {
            prompt: "Ordene o cheque defensivo.",
            blocks: ["    print('Refrescar marcação')", "if faltas >= 5:", "    print('Manter intensidade')", "else:"],
            solution: ["if faltas >= 5:", "    print('Refrescar marcação')", "else:", "    print('Manter intensidade')"],
            feedback: "Mesmo padrão: condição, bloco true, else e bloco false.",
          },
        ],
      },
    },
  },
};

module.exports = { academyPath, lessonContent };
