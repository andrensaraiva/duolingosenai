import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SmartKeyboard from '../components/SmartKeyboard'
import SimulationViewer from '../components/SimulationViewer'
import { useAppData } from '../context/AppDataContext'

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
  const { arena, simulateChallenge, submitChallenge, automationFarm, startAutomationFarm, stopAutomationFarm } = useAppData()
  const challenge = arena.challenges.find((item) => item.id === challengeId)
  const checkpointDone = challenge?.checkpointStatus === 'completed'

  const [tab, setTab] = useState('code')
  const [code, setCode] = useState(starterSnippets[challengeId] ?? "print('Iniciando automação')\n")
  const [simulation, setSimulation] = useState(null)
  const [loadingSim, setLoadingSim] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const farmBelongsToChallenge = automationFarm.challengeId === challengeId
  const farming = farmBelongsToChallenge && automationFarm.isRunning
  const farmPoints = farmBelongsToChallenge ? automationFarm.points : 0
  const farmRate = farmBelongsToChallenge ? automationFarm.rate : 0

  useEffect(() => {
    setCode(starterSnippets[challengeId] ?? "print('Iniciando automação')\n")
  }, [challengeId])

  useEffect(() => {
    setSimulation(null)
  }, [code])

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

  const handleCodeChange = (event) => {
    if (farmBelongsToChallenge) {
      stopAutomationFarm({ reset: true })
    }
    setCode(event.target.value)
  }

  const handleSimulate = async () => {
    try {
      setLoadingSim(true)
      const sim = await simulateChallenge(challengeId, code)
      setSimulation(sim)
      setTab('simulation')
      const rate = computeFarmRate(sim)
      startAutomationFarm(challengeId, { rate, label: challenge?.title, resetPoints: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSim(false)
    }
  }

  const handleResumeFarm = () => {
    if (!simulation) return
    const rate = computeFarmRate(simulation)
    startAutomationFarm(challengeId, { rate, label: challenge?.title, resetPoints: false })
  }

  const handleStopFarm = () => {
    stopAutomationFarm()
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const data = await submitChallenge(challengeId, code)
      setResult(data)
      setSimulation(data.simulation)
      setTab('simulation')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
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
              <small>+{farmRate.toFixed(1)} pts/s</small>
            </div>
            <button type="button" className="pill-button ghost" onClick={farming ? handleStopFarm : handleResumeFarm}>
              {farming ? 'Parar farm' : 'Retomar farm'}
            </button>
          </div>
        )}
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
            <SimulationViewer path={simulation.path} metrics={simulation} />
          ) : (
            <p>Simule seu código para ver o replay.</p>
          )}
          {simulation && (
            <div className="farm-panel">
              <div>
                <p>Pontos acumulados</p>
                <strong>{Math.floor(farmPoints)} pts</strong>
                <small>Ritmo atual: +{farmRate.toFixed(1)} pts/s</small>
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
    </section>
  )
}
