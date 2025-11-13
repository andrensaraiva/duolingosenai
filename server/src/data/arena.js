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
  },
];

module.exports = { arenaChallenges };
