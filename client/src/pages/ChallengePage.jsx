import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SmartKeyboard from '../components/SmartKeyboard'
import SimulationViewer from '../components/SimulationViewer'
import { useAppData } from '../context/AppDataContext'

const boosterMeta = {
  turboFarm: { label: 'Turbo Farm', description: '+25% pontos/seg por 15 min', icon: '⚡' },
  heartShield: { label: 'Escudo de Corações', description: 'Recupera 1 coração', icon: '🛡️' },
  insightRadar: { label: 'Radar de Insights', description: 'Libera 1 dica poderosa', icon: '🛰️' },
}

const emptyBlueprint = {
  modules: [],
  baselinePipeline: [],
  maxPipelineLength: 0,
}

const guideSteps = [
  {
    id: 'scan',
    title: '1. Explorar dados',
    description: 'Liste sensores, tempos e limites para entender o cenário.',
    tip: 'Use loops com print() para visualizar rapidamente.',
    snippet: 'for sensor in sensores:\n    print(sensor)\n',
  },
  {
    id: 'detect',
    title: '2. Detectar padrões',
    description: 'Crie condicionais para achar valores fora do limite.',
    tip: 'Combine operadores >, < e igualdade.',
    snippet: "if sensor['temperatura'] > limite:\n    alertas.append(sensor['nome'])\n",
  },
  {
    id: 'act',
    title: '3. Registrar ações',
    description: 'Monte mensagens claras para cada alerta.',
    tip: 'F-strings ajudam a formatar respostas.',
    snippet: "print(f'Alerta: {sensor['nome']} fora do limite!')\n",
  },
  {
    id: 'refine',
    title: '4. Refinar e otimizar',
    description: 'Garanta eficiência e cumpra o tempo máximo.',
    tip: 'Ajuste listas, funções e evite código duplicado.',
    snippet: `def registrar_alerta(sensor):
    return f"\${sensor['nome']} acima do limite"
`,
  },
]

const challengeMods = [
  {
    id: 'noLoops',
    label: 'Sem loops',
    description: 'Resolva sem usar for/while explícitos.',
    multiplier: 0.2,
    badge: 'Desafio lógico',
  },
  {
    id: 'efficiency90',
    label: 'Eficiência ≥ 90%',
    description: 'Aceita apenas execuções acima de 90% de eficiência.',
    multiplier: 0.15,
    badge: 'Precisão',
  },
  {
    id: 'compactCode',
    label: 'Máx. 12 linhas',
    description: 'Mantenha o script extremamente enxuto.',
    multiplier: 0.1,
    badge: 'Minimalista',
  },
]

const templateBlueprints = [
  {
    id: 'monitoramento',
    title: 'Monitoramento contínuo',
    level: 'iniciante',
    description: 'Varre sensores, normaliza valores e gera alertas textuais.',
    snippet: `sensores = obter_sensores()
alertas = []

for sensor in sensores:
    if sensor['valor'] > sensor['limite']:
        alertas.append(f"{sensor['nome']} acima do limite")

if alertas:
    print('⚠️ Alertas encontrados:')
    for alerta in alertas:
        print(' -', alerta)
else:
    print('Tudo estável por aqui!')
`,
  },
  {
    id: 'alocacao',
    title: 'Alocação inteligente',
    level: 'intermediário',
    description: 'Distribui tarefas conforme capacidade e evita sobrecarga.',
    snippet: `filas = {'prioritaria': [], 'normal': []}

for tarefa in tarefas:
    destino = 'prioritaria' if tarefa['criticidade'] > 7 else 'normal'
    filas[destino].append(tarefa)

print('Resumo da alocação:')
for fila, itens in filas.items():
    print(f"{fila}: {len(itens)} tarefa(s)")
`,
  },
  {
    id: 'relatorio',
    title: 'Relatório com insights',
    level: 'avançado',
    description: 'Gera KPIs e destaca anomalias em formato tabular.',
    snippet: `def gerar_relatorio(sensores):
    totais = {'ok': 0, 'alerta': 0}
    linhas = []
    for sensor in sensores:
        status = 'alerta' if sensor['valor'] > sensor['limite'] else 'ok'
        totais[status] += 1
        linhas.append(f"{sensor['nome']} | {sensor['valor']} | {status}")
    print('nome | valor | status')
    print('\n'.join(linhas))
    print('KPIs:', totais)

gerar_relatorio(sensores)
`,
  },
]

const parameterDefaults = {
  maxTime: 75,
  sensorCount: 5,
  anomalyThreshold: 30,
}

const starterSnippets = {
  'challenge-automation-lab': `sensores = [
    {'nome': 'S1', 'temperatura': 32},
    {'nome': 'S2', 'temperatura': 27},
]

alertas = []

for sensor in sensores:
    if sensor['temperatura'] > 30:
    alertas.append(f"\${sensor['nome']} acima do limite")
    else:
    print(f"\${sensor['nome']} está estável")

print(alertas)
`,
}

export default function ChallengePage() {
  const { challengeId } = useParams()
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const {
    arena,
    simulateChallenge,
    submitChallenge,
    automationFarm,
    startAutomationFarm,
    stopAutomationFarm,
    academy,
    activateBooster,
    farmMultiplier,
  } = useAppData()
  const challenge = arena.challenges.find((item) => item.id === challengeId)
  const checkpointDone = challenge?.checkpointStatus === 'completed'
  const profile = academy.profile ?? {}
  const boosters = profile.boosters ?? {}
  const activeBoosters = profile.activeBoosters ?? {}
  const blueprint = challenge?.blueprint ?? emptyBlueprint
  const blueprintModules = blueprint.modules ?? []
  const blueprintModuleMap = useMemo(
    () =>
      (blueprintModules || []).reduce((acc, module) => {
        acc[module.id] = module
        return acc
      }, {}),
    [blueprintModules]
  )
  const contextInfo = challenge?.context ?? null
  const modsById = useMemo(
    () =>
      challengeMods.reduce((acc, mod) => {
        acc[mod.id] = mod
        return acc
      }, {}),
    []
  )

  const [tab, setTab] = useState('code')
  const [code, setCode] = useState(starterSnippets[challengeId] ?? "print('Iniciando automação')\n")
  const [simulation, setSimulation] = useState(null)
  const [loadingSim, setLoadingSim] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [boosterError, setBoosterError] = useState(null)
  const [activatingBooster, setActivatingBooster] = useState(null)
  const [guideChecklist, setGuideChecklist] = useState(() =>
    guideSteps.reduce((acc, step) => ({ ...acc, [step.id]: false }), {})
  )
  const [activeMods, setActiveMods] = useState([])
  const [pipelineSelection, setPipelineSelection] = useState(() => [...(blueprint.baselinePipeline ?? [])])
  const [paramConfig, setParamConfig] = useState({
    maxTime: challenge?.goals?.maxTime ?? parameterDefaults.maxTime,
    sensorCount: challenge?.goals?.resources ?? parameterDefaults.sensorCount,
    anomalyThreshold: parameterDefaults.anomalyThreshold,
  })
  const [insightAdvice, setInsightAdvice] = useState('')
  const [latestMetrics, setLatestMetrics] = useState(null)
  const pipelineModules = pipelineSelection
    .map((moduleId) => blueprintModuleMap[moduleId])
    .filter(Boolean)
  const pipelineLimit = blueprint.maxPipelineLength && blueprint.maxPipelineLength > 0 ? blueprint.maxPipelineLength : 5
  const pipelineIsFull = pipelineSelection.length >= pipelineLimit
  const farmBelongsToChallenge = automationFarm.challengeId === challengeId
  const farming = farmBelongsToChallenge && automationFarm.isRunning
  const farmPoints = farmBelongsToChallenge ? automationFarm.points : 0
  const farmRate = farmBelongsToChallenge ? automationFarm.rate : 0
  const turboMultiplier = typeof farmMultiplier === 'function' ? farmMultiplier() : 1
  const effectiveFarmRate = farmRate * turboMultiplier
  const modBonusMultiplier = activeMods.reduce((acc, modId) => acc + (modsById[modId]?.multiplier ?? 0), 0)
  const guideCompleted = Object.values(guideChecklist).filter(Boolean).length
  const guideProgress = Math.round((guideCompleted / guideSteps.length) * 100) || 0

  useEffect(() => {
    setCode(starterSnippets[challengeId] ?? "print('Iniciando automação')\n")
  }, [challengeId])

  useEffect(() => {
    setSimulation(null)
  }, [code])

  useEffect(() => {
    setGuideChecklist(guideSteps.reduce((acc, step) => ({ ...acc, [step.id]: false }), {}))
    setActiveMods([])
    setParamConfig({
      maxTime: challenge?.goals?.maxTime ?? parameterDefaults.maxTime,
      sensorCount: challenge?.goals?.resources ?? parameterDefaults.sensorCount,
      anomalyThreshold: parameterDefaults.anomalyThreshold,
    })
    setInsightAdvice('')
    setLatestMetrics(null)
    setPipelineSelection([...(blueprint.baselinePipeline ?? [])])
  }, [challengeId, challenge])

  useEffect(() => {
    if (!challenge && !arena.loading) {
      setError('Desafio não encontrado ou ainda bloqueado.')
    }
  }, [challenge, arena.loading])

  const computeFarmRate = (sim) => {
    if (!sim) return 0
    const base = sim.resourcesCollected || 1
    const efficiencyBoost = Math.max(1, sim.efficiency / 25)
    return Number((base * efficiencyBoost) / 5)
  }

  const insertSnippet = (snippet) => {
    if (farmBelongsToChallenge) {
      stopAutomationFarm({ reset: true })
    }
    const editor = editorRef.current
    if (!editor) {
      setCode((prev) => prev + snippet)
      return
    }
    const { selectionStart, selectionEnd } = editor
    setCode((prev) => prev.slice(0, selectionStart) + snippet + prev.slice(selectionEnd))
    requestAnimationFrame(() => {
      const cursor = selectionStart + snippet.length
      editor.selectionStart = cursor
      editor.selectionEnd = cursor
      editor.focus()
    })
  }

  const addModuleToPipeline = (moduleId) => {
    if (!moduleId || !blueprintModuleMap[moduleId]) return
    setPipelineSelection((prev) => {
      const limit = blueprint.maxPipelineLength || 5
      if (prev.length >= limit) return prev
      return [...prev, moduleId]
    })
  }

  const removePipelineModule = (index) => {
    setPipelineSelection((prev) => prev.filter((_, idx) => idx !== index))
  }

  const movePipelineModule = (index, direction) => {
    setPipelineSelection((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) {
        return prev
      }
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const clearPipeline = () => {
    setPipelineSelection([])
  }

  const applyTemplate = (template) => {
    if (!template?.snippet) return
    if (farmBelongsToChallenge) {
      stopAutomationFarm({ reset: true })
    }
    setCode(template.snippet)
    setTab('code')
    setGuideChecklist((prev) => ({ ...prev, scan: true }))
  }

  const toggleGuideStep = (stepId) => {
    setGuideChecklist((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  const toggleMod = (modId) => {
    setActiveMods((prev) => (prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]))
  }

  const handleParamChange = (field, value) => {
    setParamConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleInsightsChange = (metrics) => {
    if (!metrics) return
    setLatestMetrics(metrics)
  }

  useEffect(() => {
    if (!latestMetrics) return
    setGuideChecklist((prev) => ({
      ...prev,
      detect: prev.detect || Boolean(latestMetrics.insights?.conditionals),
      act: prev.act || Boolean(latestMetrics.insights?.loops ?? latestMetrics.loopsUsed),
      refine: prev.refine || (latestMetrics.efficiency ?? 0) >= 85,
    }))
    const loops = latestMetrics.insights?.loops ?? latestMetrics.loopsUsed ?? 0
    const conditionals = latestMetrics.insights?.conditionals ?? 0
    const resources = latestMetrics.resourcesCollected ?? 0
    const advice = (() => {
      if (loops === 0) return 'Você ainda não usou loops. Experimente repetir leituras automaticamente.'
      if (conditionals === 0) return 'Adicione um if/else para reagir a limites e desbloquear mais pontos.'
      if (latestMetrics.time > paramConfig.maxTime) return 'O tempo passou do limite configurado. Otimize ou reduza operações.'
      if (resources < paramConfig.sensorCount) return 'Nem todos os sensores virtuais foram usados. Varra toda a lista.'
      return 'Excelente! Ative um mod ou aumente sensores para elevar a dificuldade.'
    })()
    setInsightAdvice(advice)
  }, [latestMetrics, paramConfig.maxTime, paramConfig.sensorCount])

  const handleCodeChange = (event) => {
    if (farmBelongsToChallenge) {
      stopAutomationFarm({ reset: true })
    }
    setCode(event.target.value)
  }

  const handleSimulate = async () => {
    try {
      setLoadingSim(true)
      const sim = await simulateChallenge(challengeId, code, {
        params: paramConfig,
        mods: activeMods,
        layout: pipelineSelection,
      })
      setSimulation(sim)
      setTab('simulation')
      setLatestMetrics(sim)
      const rate = computeFarmRate(sim) * (1 + modBonusMultiplier)
      startAutomationFarm(challengeId, { rate, label: challenge?.title, resetPoints: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSim(false)
    }
  }

  const handleResumeFarm = () => {
    if (!simulation) return
    const rate = computeFarmRate(simulation) * (1 + modBonusMultiplier)
    startAutomationFarm(challengeId, { rate, label: challenge?.title, resetPoints: false })
  }

  const handleStopFarm = () => {
    stopAutomationFarm()
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const data = await submitChallenge(challengeId, code, {
        params: paramConfig,
        mods: activeMods,
        layout: pipelineSelection,
      })
      setResult(data)
      setSimulation(data.simulation)
      setTab('simulation')
      setLatestMetrics(data.simulation)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUseBooster = async (type) => {
    if (!activateBooster) return
    setBoosterError(null)
    setActivatingBooster(type)
    try {
      await activateBooster(type)
    } catch (err) {
      setBoosterError(err.message)
    } finally {
      setActivatingBooster(null)
    }
  }

  const bestResult = useMemo(() => challenge?.bestResult ?? result?.bestResult, [challenge, result])

  if (arena.loading) {
    return (
      <section className="page-section">
        <p>Carregando desafio...</p>
      </section>
    )
  }

  if (!challenge) {
    return (
      <section className="page-section">
        <p className="error">{error ?? 'Desafio indisponível no momento.'}</p>
        <Link to="/arena">Voltar</Link>
      </section>
    )
  }

  return (
    <section className="page-section challenge-page">
      <div className="challenge-layout">
        <aside className="challenge-guide">
          <div className="guide-header">
            <div>
              <p className="subtitle">Modo assistido</p>
              <h3>Construa em etapas</h3>
            </div>
            <small>{guideCompleted}/{guideSteps.length} etapas</small>
          </div>
          <div className="guide-progress">
            <div className="guide-progress-bar" style={{ width: `${guideProgress}%` }} />
          </div>
          <ul className="guide-steps">
            {guideSteps.map((step) => (
              <li key={step.id} className={guideChecklist[step.id] ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={guideChecklist[step.id]} onChange={() => toggleGuideStep(step.id)} />
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </label>
                <div className="guide-actions">
                  <button type="button" onClick={() => insertSnippet(step.snippet)}>
                    Inserir dica
                  </button>
                  <small>{step.tip}</small>
                </div>
              </li>
            ))}
          </ul>
          <section className="template-section">
            <div className="section-heading">
              <p>Blueprints rápidos</p>
              <small>Carregue uma base e personalize</small>
            </div>
            {templateBlueprints.map((template) => (
              <article key={template.id} className="template-card">
                <header>
                  <p>{template.title}</p>
                  <span>{template.level}</span>
                </header>
                <p>{template.description}</p>
                <div className="template-actions">
                  <button type="button" className="pill-button" onClick={() => applyTemplate(template)}>
                    Clonar base
                  </button>
                  <button type="button" className="pill-button ghost" onClick={() => insertSnippet(template.snippet)}>
                    Inserir trecho
                  </button>
                </div>
              </article>
            ))}
          </section>
          <section className="mods-section">
            <div className="section-heading">
              <p>Mods opcionais</p>
              <small>Aumente o multiplicador de farm</small>
            </div>
            <div className="mods-grid">
              {challengeMods.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  className={`mod-chip ${activeMods.includes(mod.id) ? 'active' : ''}`}
                  onClick={() => toggleMod(mod.id)}
                >
                  <strong>{mod.label}</strong>
                  <p>{mod.description}</p>
                  <small>
                    {mod.badge} · +{Math.round(mod.multiplier * 100)}% pts/s
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section className="params-section">
            <div className="section-heading">
              <p>Parâmetros da simulação</p>
              <small>Brinque com limites e sensores</small>
            </div>
            <label>
              Tempo máximo (s)
              <input
                type="number"
                min="10"
                max="300"
                value={paramConfig.maxTime}
                onChange={(event) => handleParamChange('maxTime', Number(event.target.value))}
              />
            </label>
            <label>
              Sensores virtuais
              <input
                type="number"
                min="1"
                max="20"
                value={paramConfig.sensorCount}
                onChange={(event) => handleParamChange('sensorCount', Number(event.target.value))}
              />
            </label>
            <label>
              Limite crítico
              <input
                type="number"
                min="10"
                max="120"
                value={paramConfig.anomalyThreshold}
                onChange={(event) => handleParamChange('anomalyThreshold', Number(event.target.value))}
              />
            </label>
          </section>
          {insightAdvice && (
            <div className="insight-advice">
              <strong>Radar de insights</strong>
              <p>{insightAdvice}</p>
            </div>
          )}
        </aside>
        <div className="challenge-workspace">
          <header className="challenge-header">
            <button type="button" onClick={() => navigate(-1)}>
              ← Arena
            </button>
            <div>
              <p className="subtitle">{challenge.title}</p>
              <h2>{challenge.description}</h2>
              <p>
                Objetivo: automatizar {challenge.goals.resources} rotinas em até {challenge.goals.maxTime}s
              </p>
              {challenge.scenario && <p className="info">Contexto: {challenge.scenario}</p>}
              {!checkpointDone && (
                <p className="warning">
                  Você já pode testar a Arena! Completar a trilha Python, porém, vai te deixar muito mais eficiente.
                </p>
              )}
            </div>
          </header>
          {error && <p className="error">{error}</p>}
          {contextInfo && (
            <section className="context-board">
              <div>
                <h4>Briefing</h4>
                <p>{contextInfo.briefing ?? challenge.scenario}</p>
              </div>
              <div className="context-grid">
                {contextInfo.focus && contextInfo.focus.length > 0 && (
                  <div>
                    <p className="label">Focos principais</p>
                    <ul>
                      {contextInfo.focus.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {contextInfo.constraints && contextInfo.constraints.length > 0 && (
                  <div>
                    <p className="label">Restrições</p>
                    <ul>
                      {contextInfo.constraints.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {contextInfo.telemetry && contextInfo.telemetry.length > 0 && (
                  <div>
                    <p className="label">Telemetria</p>
                    <ul>
                      {contextInfo.telemetry.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
          {blueprintModules.length > 0 && (
            <section className="flow-builder">
              <div className="section-heading">
                <div>
                  <p>Flow builder</p>
                  <small>Posicione módulos para otimizar o desafio</small>
                </div>
                <small>
                  {pipelineSelection.length}/{pipelineLimit} estágios
                </small>
              </div>
              <div className="flow-available">
                {blueprintModules.map((module) => {
                  const disabled = pipelineIsFull
                  return (
                    <button
                      key={module.id}
                      type="button"
                      className="module-pill"
                      disabled={disabled}
                      onClick={() => addModuleToPipeline(module.id)}
                    >
                      <div>
                        <strong>{module.label}</strong>
                        <p>{module.description ?? 'Configuração customizável.'}</p>
                      </div>
                      <small>
                        +{module.resourceBoost ?? 0} recursos · {module.efficiencyBoost ?? 0}% eficiência · {module.timeImpact ?? 0}s
                      </small>
                    </button>
                  )
                })}
              </div>
              <div className="pipeline-board">
                {pipelineModules.length === 0 ? (
                  <p>Adicione módulos para definir o fluxo de produção.</p>
                ) : (
                  <ol>
                    {pipelineModules.map((module, index) => (
                      <li key={`${module.id}-${index}`} className="pipeline-card">
                        <div>
                          <p>
                            Etapa {index + 1}: <strong>{module.label}</strong>
                          </p>
                          <small>{module.category ?? 'custom'}</small>
                        </div>
                        <div className="pipeline-actions">
                          <button type="button" onClick={() => movePipelineModule(index, -1)} disabled={index === 0}>
                            ↑
                          </button>
                          <button type="button" onClick={() => movePipelineModule(index, 1)} disabled={index === pipelineModules.length - 1}>
                            ↓
                          </button>
                          <button type="button" onClick={() => removePipelineModule(index)}>
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="pipeline-toolbar">
                  <button type="button" className="pill-button ghost" onClick={clearPipeline}>
                    Limpar fluxo
                  </button>
                  {blueprint.baselinePipeline && blueprint.baselinePipeline.length > 0 && (
                    <button type="button" className="pill-button ghost" onClick={() => setPipelineSelection([...(blueprint.baselinePipeline ?? [])])}>
                      Restaurar padrão
                    </button>
                  )}
                </div>
                {pipelineIsFull && <small className="info-text">Fluxo completo: remova ou mova etapas para abrir espaço.</small>}
              </div>
            </section>
          )}
          <div className="tab-switch">
            <button type="button" className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>
              Código
            </button>
            <button type="button" className={tab === 'simulation' ? 'active' : ''} onClick={() => setTab('simulation')}>
              Simulação
            </button>
          </div>
          {farmBelongsToChallenge && (
            <div className={`farm-status ${farming ? 'running' : 'paused'}`}>
              <div>
                <p>{farming ? 'Farm de automação ativo' : 'Farm pausado'}</p>
                <strong>{Math.floor(farmPoints)} pts</strong>
                <small>
                  Ritmo efetivo: +{effectiveFarmRate.toFixed(1)} pts/s
                  {turboMultiplier > 1 && <span className="turbo-badge">Turbo +25%</span>}
                  {activeMods.length > 0 && (
                    <span className="mod-badge">Mods +{Math.round(modBonusMultiplier * 100)}%</span>
                  )}
                </small>
              </div>
              <button type="button" className="pill-button ghost" onClick={farming ? handleStopFarm : handleResumeFarm}>
                {farming ? 'Parar farm' : 'Retomar farm'}
              </button>
            </div>
          )}
          <div className="booster-panel">
            <div className="booster-panel-header">
              <p>Boosters & recursos</p>
              <small>Potencialize a simulação antes de enviar</small>
            </div>
            {boosterError && <p className="error">{boosterError}</p>}
            <div className="booster-grid">
              {Object.keys(boosterMeta).map((key) => {
                const meta = boosterMeta[key]
                const count = boosters[key] ?? 0
                const isActive = Boolean(activeBoosters[key])
                const buttonDisabled = count <= 0 || isActive || activatingBooster === key
                let statusText = `Disponível x${count}`
                if (isActive && activeBoosters[key]?.expiresAt) {
                  const remainingMs = activeBoosters[key].expiresAt - Date.now()
                  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000))
                  statusText = `Ativo · ${remainingMinutes} min`
                } else if (isActive && activeBoosters[key]?.charges) {
                  statusText = `Ativo · ${activeBoosters[key].charges} dica(s)`
                } else if (isActive) {
                  statusText = 'Ativo'
                }
                return (
                  <div key={key} className={`booster-card ${isActive ? 'active' : ''}`}>
                    <div className="booster-info">
                      <span className="booster-icon" aria-hidden>
                        {meta.icon}
                      </span>
                      <div>
                        <p>{meta.label}</p>
                        <small>{meta.description}</small>
                      </div>
                    </div>
                    <div className="booster-footer">
                      <small>{statusText}</small>
                      <button type="button" className="pill-button ghost" disabled={buttonDisabled} onClick={() => handleUseBooster(key)}>
                        {isActive ? 'Ativo' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {tab === 'code' && (
            <div className="code-panel">
              <textarea
                ref={editorRef}
                value={code}
                onChange={handleCodeChange}
                spellCheck="false"
                className="code-editor"
              />
              <SmartKeyboard onInsert={insertSnippet} />
              <div className="code-actions">
                <button type="button" className="pill-button" disabled={loadingSim} onClick={handleSimulate}>
                  {loadingSim ? 'Simulando...' : '▶ Simular'}
                </button>
              </div>
              <p className="tip">Dica: {challenge.tips}</p>
              <p className="tip">Bônus: use loops e listas para varrer sensores sem copiar/colar.</p>
            </div>
          )}
          {tab === 'simulation' && (
            <div className="simulation-panel">
              {simulation ? (
                <SimulationViewer path={simulation.path} metrics={simulation} onInsightsChange={handleInsightsChange} />
              ) : (
                <p>Simule seu código para ver o replay.</p>
              )}
              {simulation?.pipeline?.layout?.length > 0 && (
                <div className="pipeline-summary">
                  <p>
                    Fluxo configurado · <strong>{simulation.pipeline.layout.length}</strong> estágio(s)
                  </p>
                  <ul>
                    {simulation.pipeline.layout.map((stage, index) => (
                      <li key={`${stage.id}-${index}`}>
                        <span>
                          {index + 1}. {stage.label}
                        </span>
                        <small>
                          +{stage.effects.resources ?? 0} recursos · {stage.effects.efficiency ?? 0}% · {stage.effects.time ?? 0}s
                        </small>
                      </li>
                    ))}
                  </ul>
                  <small>
                    Bônus total: +{simulation.pipeline.bonus?.resources ?? 0} recursos · +
                    {simulation.pipeline.bonus?.efficiency ?? 0}% eficiência · {simulation.pipeline.bonus?.time ?? 0}s no tempo
                  </small>
                </div>
              )}
              {simulation && (
                <div className="farm-panel">
                  <div>
                    <p>Pontos acumulados</p>
                    <strong>{Math.floor(farmPoints)} pts</strong>
                    <small>
                      Ritmo efetivo: +{effectiveFarmRate.toFixed(1)} pts/s
                      {turboMultiplier > 1 && <span className="turbo-badge">Turbo +25%</span>}
                      {activeMods.length > 0 && (
                        <span className="mod-badge">Mods +{Math.round(modBonusMultiplier * 100)}%</span>
                      )}
                    </small>
                  </div>
                  <div className="farm-buttons">
                    <button type="button" onClick={handleStopFarm} className="pill-button ghost">
                      Parar farm
                    </button>
                    <button type="button" onClick={handleResumeFarm} className="pill-button">
                      {farming ? 'Ajustar código' : 'Retomar farm'}
                    </button>
                  </div>
                </div>
              )}
              <div className="sim-actions">
                <button type="button" onClick={() => setTab('code')}>
                  Voltar ao código
                </button>
                <button type="button" className="pill-button" disabled={!simulation || submitting} onClick={handleSubmit}>
                  {submitting ? 'Enviando...' : 'Submeter resultado'}
                </button>
              </div>
            </div>
          )}
          {bestResult && (
            <div className="result-card">
              <h3>Seu melhor resultado</h3>
              <p>
                Tempo: <strong>{bestResult.time}s</strong>
              </p>
              <p>
                Rotinas: <strong>{bestResult.resourcesCollected}</strong>
              </p>
              <p>
                Eficiência: <strong>{bestResult.efficiency}%</strong>
              </p>
              {result?.meetsGoal ? <p className="success">Checkpoint atualizado!</p> : <p className="info">Continue otimizando para bater o tempo ideal.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
