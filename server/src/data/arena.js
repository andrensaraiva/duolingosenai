const arenaChallenges = [
  {
    id: "challenge-automation-lab",
    title: "Laboratório de Automação IA",
    description:
      "Construa um script que percorre leituras de sensores, valida limites e dispara alertas inteligentes.",
    checkpointId: "checkpoint-python-foundations",
    goals: {
      resources: 12,
      maxTime: 75,
    },
    scenario:
      "Você recebeu uma planilha com sensores de uma linha de produção. Seu script deve higienizar dados, classificar risco e reagrupar as máquinas fora do padrão.",
    tips:
      "Variáveis claras + if/else dominam as regras. Para ganhar eficiência, envolva listas e loops for para iterar sem repetir código.",
    context: {
      briefing:
        "O laboratório precisa de um orquestrador capaz de higienizar leituras IoT e acionar squads em segundos. Você decide quais blocos compõem o fluxo.",
      focus: [
        "Normalizar e priorizar até 12 sensores por rodada",
        "Detectar anomalias reais e reduzir falsos positivos",
        "Roteamento eficiente de alertas para cada célula",
      ],
      constraints: [
        "Latência máxima de 2,5s entre leitura e alerta",
        "Não desperdice ciclos com etapas redundantes",
        "Mantenha o script legível para o squad de manutenção",
      ],
      telemetry: [
        "3 células industriais · 12 sensores cada",
        "Ruído em ~8% das leituras",
        "Alertas precisam trazer contexto do operador",
      ],
    },
    themes: {
      games: {
        title: "Raid dos Servidores Fantasma",
        description:
          "Vá de analista a líder de guilda: otimize sensores como se fossem mobs e mantenha o placar do clã impecável.",
        scenario:
          "Um campeonato eSports sofre ataques de lag. Você monta uma build que pesque leituras bugadas e envia buffs para cada máquina.",
        tips:
          "Use combos (loops + listas) para limpar mobs em área e liberar ultimate rapidamente.",
        context: {
          briefing:
            "Seu squad é o suporte da arena. Colete drops em tempo recorde e entregue alertas como se fossem power-ups.",
          focus: [
            "Balancear recursos entre lanes (setores)",
            "Detectar glitches que derrubam FPS",
            "Distribuir boosts apenas para quem precisa",
          ],
          constraints: [
            "Cada ciclo dura 90s antes do próximo spawn",
            "Evite spam para não ativar anti-cheat",
            "Narrativa in-game precisa continuar imersiva",
          ],
          telemetry: [
            "Matchmaking de 3 arenas simultâneas",
            "Drops lendários valem 3x pontos",
            "Alertas exibem ícones inspirados em power-ups",
          ],
        },
      },
      sports: {
        title: "Centro de Comando da Liga Pró",
        description:
          "Monitore atletas como se fossem sensores biométricos e direcione técnicos em tempo real.",
        scenario:
          "Uma liga nacional quer prever fadiga antes do apito. Você organiza dados de quadra, ajusta limites e envia alertas ao banco.",
        tips:
          "Planilhas viram táticas: loops revisitam cada atleta e condicionais sinalizam cartões amarelos de fadiga.",
        context: {
          briefing:
            "Você lidera a sala de performance. Transforme telemetria em instruções táticas sem atrasar o cronômetro.",
          focus: [
            "Sincronizar dados com relógio oficial",
            "Priorizar atletas decisivos em playoffs",
            "Gerar alertas que o técnico entenda em 2s",
          ],
          constraints: [
            "Timeouts de 60s limitam ajustes",
            "Evite falsos positivos que queimem substituições",
            "Mensagens devem citar jogador e estatística",
          ],
          telemetry: [
            "3 quadras conectadas em tempo real",
            "Sensores capturam batimentos e aceleração",
            "Alertas disparam tablets dos assistentes",
          ],
        },
      },
    },
    blueprint: {
      maxPipelineLength: 4,
      baselinePipeline: ["stream-ingest", "smart-clean", "priority-router"],
      modules: [
        {
          id: "stream-ingest",
          label: "Ingestor em tempo real",
          category: "entrada",
          description: "Consome leituras contínuas e aplica carimbos de tempo confiáveis.",
          resourceBoost: 2,
          efficiencyBoost: 2,
          timeImpact: -4,
        },
        {
          id: "edge-buffer",
          label: "Buffer inteligente",
          category: "entrada",
          description: "Agrupa micro-lotes e reduz ruído antes do processamento.",
          resourceBoost: 1,
          efficiencyBoost: 1.5,
          timeImpact: 2,
        },
        {
          id: "smart-clean",
          label: "Higienização IA",
          category: "processamento",
          description: "Remove outliers, corrige limites e padroniza unidades.",
          resourceBoost: 2,
          efficiencyBoost: 3,
          timeImpact: -3,
        },
        {
          id: "anomaly-brain",
          label: "Detector preditivo",
          category: "processamento",
          description: "Modela padrões históricos e prioriza riscos reais.",
          resourceBoost: 3,
          efficiencyBoost: 4,
          timeImpact: -2,
        },
        {
          id: "priority-router",
          label: "Roteador de alertas",
          category: "resposta",
          description: "Direciona cada máquina fora do padrão para o squad correto.",
          resourceBoost: 1,
          efficiencyBoost: 2,
          timeImpact: -1,
        },
        {
          id: "cooldown-guard",
          label: "Guardião de cooldown",
          category: "resposta",
          description: "Evita alertas duplicados, respeitando janelas de silêncio.",
          resourceBoost: 0,
          efficiencyBoost: 1,
          timeImpact: 2,
        },
        {
          id: "human-loop",
          label: "Human-in-the-loop",
          category: "resposta",
          description: "Escala apenas casos críticos para revisão humana.",
          resourceBoost: 0,
          efficiencyBoost: 1.5,
          timeImpact: 3,
        },
      ],
    },
  },
];

module.exports = { arenaChallenges };
