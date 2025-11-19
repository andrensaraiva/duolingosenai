const missionsCatalog = [
  {
    id: "mission-variables-reset",
    title: "Reiniciar contador",
    concept: "variáveis",
    difficulty: "easy",
    prompt: "Para reiniciar o contador de logs antes de um novo loop, qual linha funciona em Python?",
    scenario: "O painel precisa zerar a contagem antes de cada rodada para evitar números inflados.",
    choices: ["contador_logs == 0", "contador_logs = 0", "reset(contador_logs)"],
    answer: "contador_logs = 0",
    rewardXp: 8,
    rewardCurrency: 6,
    rewardBooster: "turboFarm",
    themes: {
      games: {
        title: "Reset do placar do clã",
        scenario: "O dashboard da raid precisa zerar o placar geral para iniciar a próxima onda sem lixo de dados.",
        prompt: "Qual comando reinicia o contador da partida antes da próxima call?",
      },
      sports: {
        title: "Zerar scout da rodada",
        scenario: "A equipe de análise quer limpar a contagem antes de registrar o próximo período do jogo.",
        prompt: "Como reiniciar o contador de scout para o próximo quarto?",
      },
    },
  },
  {
    id: "mission-types-cast",
    title: "Normalizar leitura",
    concept: "tipos",
    difficulty: "easy",
    prompt: "Você recebeu a string '37'. Qual opção converte para inteiro mantendo o valor na variável leitura?",
    scenario: "Sem converter, a divisão para calcular médias quebra.",
    choices: ["int(leitura)", "leitura = int(leitura)", "leitura = str(leitura)"],
    answer: "leitura = int(leitura)",
    rewardXp: 10,
    rewardCurrency: 7,
    rewardBooster: "heartShield",
    themes: {
      games: {
        title: "Converter loot",
        scenario: "Só dá para subir o upgrade se o valor vier como número — strings bugam o painel da guilda.",
        prompt: "Como transformar a leitura '37' em inteiro antes de distribuir o loot?",
      },
      sports: {
        title: "Normalizar métrica",
        scenario: "Os analistas precisam da leitura em número para calcular a média do atleta em tempo real.",
        prompt: "Qual comando converte a string '37' em inteiro mantendo o valor na variável leitura?",
      },
    },
  },
  {
    id: "mission-conditions-alert",
    title: "Gerar alerta",
    concept: "if/else",
    difficulty: "medium",
    prompt: "Complete a condição que dispara alerta quando a temperatura passa de 35 graus.",
    scenario: "Somente quando está acima do limite o robô deve piscar a luz vermelha.",
    choices: ["if temperatura >= 35:", "if temperatura > 35:", "if temperatura => 35:"],
    answer: "if temperatura > 35:",
    rewardXp: 12,
    rewardCurrency: 9,
    rewardBooster: "turboFarm",
    themes: {
      games: {
        title: "Trigger de boss",
        scenario: "Quando o servidor passa de 35° o boss desperta e o clã precisa de alerta imediato.",
        prompt: "Complete a condição que dispara o alarme assim que o termômetro passa do limite.",
      },
      sports: {
        title: "Alerta biométrico",
        scenario: "Acima de 35° o staff médico precisa receber aviso para resfriar o equipamento do atleta.",
        prompt: "Qual condição ativa o alerta somente quando o sensor passa do teto?",
      },
    },
  },
  {
    id: "mission-loops-scan",
    title: "Varra sensores",
    concept: "loops",
    difficulty: "medium",
    prompt: "Qual estrutura percorre a lista sensores capturando cada item em sensor?",
    scenario: "Você precisa iterar sensor a sensor para checar limites de forma sequencial.",
    choices: ["for sensor in sensores:", "for sensores in sensor:", "for sensores:"],
    answer: "for sensor in sensores:",
    rewardXp: 15,
    rewardCurrency: 10,
    rewardBooster: "insightRadar",
    themes: {
      games: {
        title: "Patrulha dos drones",
        scenario: "Você precisa varrer cada drone da arena holo para identificar bugs antes da final.",
        prompt: "Qual estrutura percorre a lista sensores atribuindo cada item à variável sensor?",
      },
      sports: {
        title: "Ronda de telemetria",
        scenario: "O centro de análise precisa revisar sensor a sensor para alimentar o painel dos técnicos.",
        prompt: "Qual loop garante a leitura sequencial da lista sensores?",
      },
    },
  },
  {
    id: "mission-strings-fstring",
    title: "Mensagem formatada",
    concept: "strings",
    difficulty: "hard",
    prompt: "Se nome_sensor = 'S2' e temperatura = 34, qual opção monta 'S2 -> 34°C'?",
    scenario: "A central precisa dessa mensagem para enviar notificações rápidas.",
    choices: [
      "'{} -> {}°C'.format(nome_sensor, temperatura)",
      "f\"{nome_sensor} -> {temperatura}°C\"",
      "nome_sensor + ' -> ' + temperatura",
    ],
    answer: "'{} -> {}°C'.format(nome_sensor, temperatura)",
    acceptedAnswers: [
      "'{} -> {}°C'.format(nome_sensor, temperatura)",
      "f\"{nome_sensor} -> {temperatura}°C\"",
    ],
    rewardXp: 18,
    rewardCurrency: 14,
    rewardBooster: "turboFarm",
    themes: {
      games: {
        title: "Broadcast da raid",
        scenario: "O shoutcaster precisa anunciar cada sensor como se fosse nickname do player.",
        prompt: "Como montar uma string no formato 'S2 -> 34°C' para o overlay da transmissão?",
      },
      sports: {
        title: "Ticker da arena",
        scenario: "O telão só aceita mensagens prontas com sensor e temperatura.",
        prompt: "Qual opção rende 'S2 -> 34°C' usando nome_sensor e temperatura?",
      },
    },
  },
];

const boosterCatalog = {
  turboFarm: {
    label: "Turbo Farm",
    description: "+25% pontos/seg por 15 min",
    durationMinutes: 15,
    type: "rate",
  },
  heartShield: {
    label: "Escudo de Corações",
    description: "Recupera 1 coração imediatamente",
    type: "instant",
  },
  insightRadar: {
    label: "Radar de Insights",
    description: "Exibe uma dica extra quando uma simulação falha na Arena",
    type: "hint",
  },
};

const missionModifiers = [
  {
    id: "stealth-output",
    codename: "Operação Ruído Zero",
    rule: "Evite prints dentro do loop principal para manter os sensores silenciosos.",
    flavor: "A central está monitorando ruídos. Economia de logs rende bônus extra.",
    bonusXp: 4,
    bonusCurrency: 3,
  },
  {
    id: "double-check",
    codename: "Protocolo Dupla Checagem",
    rule: "Valide a entrada antes de processar dados. Inclua uma verificação simples.",
    flavor: "Engenharia pediu validações redundantes para evitar panes na madrugada.",
    bonusXp: 5,
    bonusCurrency: 4,
  },
  {
    id: "loop-patrol",
    codename: "Patrulha Sequencial",
    rule: "Precisa usar pelo menos um loop completo para percorrer todos os sensores.",
    flavor: "O time quer garantir que ninguém esteja pulando etapas de varredura.",
    bonusXp: 6,
    bonusCurrency: 5,
  },
  {
    id: "string-brief",
    codename: "Relatório Relâmpago",
    rule: "Formate a mensagem final em uma única string antes de enviá-la.",
    flavor: "O painel só aceita strings pré-formatadas — nada de concatenação avulsa.",
    bonusXp: 5,
    bonusCurrency: 6,
  },
];

module.exports = { missionsCatalog, boosterCatalog, missionModifiers };
