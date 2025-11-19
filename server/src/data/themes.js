const themeOptions = [
  {
    id: "default",
    label: "Modo Operações",
    description: "Visual clássico do laboratório futurista com foco em clareza e leitura técnica.",
    chip: "Padrão",
    hero: {
      academy: {
        subtitle: "Trilha Python · variáveis até if/else",
        title: "Fundamentos para IA aplicada",
        description: "Domine a base em blocos de 5 minutos e prepare-se para automatizar processos inteiros.",
      },
      arena: {
        subtitle: "Arena · Automação completa",
        title: "Laboratório vivo",
        description: "Transfira o que aprendeu para um script de sensores real e mostre sua eficiência.",
      },
      missions: {
        subtitle: "Laboratório de Missões",
        title: "Operações especiais para reforçar Python",
        description:
          "Receba briefings diários com restrições táticas, bônus extras e valide fundamentos antes do reset.",
      },
    },
    tokens: {
      surface: "#0c1323",
      "surface-alt": "#111b32",
      accent: "#7ed957",
      "accent-strong": "#53c41c",
      "text-muted": "#8c96b7",
      success: "#6de3a6",
      danger: "#ff6b6b",
      warning: "#f2c94c",
      "background-gradient": "radial-gradient(circle at top, rgba(47, 103, 255, 0.25), transparent 55%), #060a13",
    },
  },
  {
    id: "games",
    label: "Modo Jogos",
    description: "Neon inspirado em eSports com narrativa de guilda e raids cooperativas.",
    chip: "Arcade",
    hero: {
      academy: {
        subtitle: "Trilha Python · modo arcade",
        title: "Domine a raid dos dados",
        description: "Aprenda Python como se montasse builds: cartas rápidas, combos e muita callout épica.",
      },
      arena: {
        subtitle: "Arena · Guilda em campo",
        title: "Servidor fantasma",
        description: "Otimize sensores como mobs e mantenha o placar do clã impecável em cada rodada.",
      },
      missions: {
        subtitle: "Guilda · Briefings diários",
        title: "Chamados para manter o clã no topo",
        description: "Receba incursões com modificadores, farme boosters raros e cumpra objetivos antes do wipe diário.",
      },
    },
    tokens: {
      surface: "#0b061f",
      "surface-alt": "#1b0f33",
      accent: "#ff9af4",
      "accent-strong": "#f176ff",
      "text-muted": "#d3c4ff",
      success: "#84f5ff",
      danger: "#ff7b7b",
      warning: "#f6d06f",
      "background-gradient": "radial-gradient(circle at top, rgba(255, 90, 196, 0.28), rgba(6, 4, 20, 0.96))",
    },
  },
  {
    id: "sports",
    label: "Modo Esportes",
    description: "Estética de centro de comando profissional com foco em telemetria esportiva.",
    chip: "Liga Pro",
    hero: {
      academy: {
        subtitle: "Trilha Python · sala do coach",
        title: "Quartel tático de dados",
        description: "Treine Python como quem ajusta o playbook: leitura rápida, estatísticas claras e decisões ao vivo.",
      },
      arena: {
        subtitle: "Arena · Centro de comando",
        title: "Liga pró conectada",
        description: "Monitore atletas como sensores biométricos e oriente técnicos em tempo real.",
      },
      missions: {
        subtitle: "Centro de desempenho",
        title: "Briefings para o staff tático",
        description:
          "Ganhe missões inspiradas em scouting profissional, lide com restrições e acumule bônus antes da próxima rodada.",
      },
    },
    tokens: {
      surface: "#061018",
      "surface-alt": "#0f1f2b",
      accent: "#ffc857",
      "accent-strong": "#ff8e2b",
      "text-muted": "#a5bacd",
      success: "#8ce6c1",
      danger: "#ff8f8f",
      warning: "#ffd166",
      "background-gradient": "radial-gradient(circle at top, rgba(255, 166, 77, 0.25), rgba(3, 9, 15, 0.96))",
    },
  },
];

const defaultThemeId = "default";

module.exports = { themeOptions, defaultThemeId };
