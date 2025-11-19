import { useEffect, useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext'

const difficultyCopy = {
  easy: { label: 'Base operacional', color: 'easy' },
  medium: { label: 'Campo avançado', color: 'medium' },
  hard: { label: 'Missão crítica', color: 'hard' },
}

const boosterCopy = {
  turboFarm: {
    label: 'Turbo Farm',
    description: '+25% pontos/seg por 15 min',
    icon: '⚡',
  },
  heartShield: {
    label: 'Escudo de Corações',
    description: 'Recupera 1 coração',
    icon: '🛡️',
  },
  insightRadar: {
    label: 'Radar de Insights',
    description: 'Entrega 1 dica extra',
    icon: '🛰️',
  },
}

const formatCountdown = (seconds) => {
  const clamped = Math.max(0, seconds)
  const hours = Math.floor(clamped / 3600)
  const minutes = Math.floor((clamped % 3600) / 60)
  const secs = clamped % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

function MissionCard({ mission, onAnswer, busy }) {
  const difficulty = difficultyCopy[mission.difficulty] ?? difficultyCopy.easy
  const booster = boosterCopy[mission.rewardBooster]
  const disabled = mission.status === 'completed'
  const bonusXp = mission.bonus?.xp ?? 0
  const bonusCurrency = mission.bonus?.currency ?? 0

  return (
    <article className={`mission-card ${mission.status}`}>
      <header>
        <div>
          <p className={`mission-difficulty ${difficulty.color}`}>{difficulty.label}</p>
          <h3>{mission.title}</h3>
          <p className="mission-concept">Conceito-chave: {mission.concept}</p>
          <div className="mission-tags">
            {booster && (
              <div className="booster-tag">
                <span aria-hidden>{booster.icon}</span>
                <div>
                  <p>{booster.label}</p>
                  <small>{booster.description}</small>
                </div>
              </div>
            )}
            {mission.modifier && (
              <div className="modifier-pill">
                <span>🎯</span>
                <div>
                  <p>{mission.modifier.codename}</p>
                  <small>{mission.modifier.rule}</small>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mission-rewards">
          <div>
            <p>XP</p>
            <strong>+{mission.rewardXp}</strong>
            {bonusXp > 0 && <small className="bonus-text">+{bonusXp} XP diário</small>}
          </div>
          <div>
            <p>Moedas</p>
            <strong>+{mission.rewardCurrency}</strong>
            {bonusCurrency > 0 && <small className="bonus-text">+{bonusCurrency} diário</small>}
          </div>
        </div>
      </header>
      {mission.modifier && (
        <div className="mission-modifier">
          <p className="modifier-title">{mission.modifier.codename}</p>
          <p className="modifier-rule">{mission.modifier.rule}</p>
          <small>{mission.modifier.flavor}</small>
        </div>
      )}
      <p className="mission-scenario">{mission.scenario}</p>
      <p className="mission-prompt">{mission.prompt}</p>
      <div className="mission-choices">
        {mission.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={disabled || busy === mission.id}
            onClick={() => onAnswer(mission.id, choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {mission.status === 'completed' ? (
        <p className="mission-status success">Missão diária concluída · aguarde o próximo reset</p>
      ) : (
        <p className="mission-status available">Valendo bônus diário e booster exclusivo</p>
      )}
    </article>
  )
}

export default function MissionsPage() {
  const { academy, missions, completeMission, theme } = useAppData()
  const { rotation, loading, error, refreshing } = missions
  const profile = academy.profile ?? {}
  const boosters = profile.boosters ?? {}
  const weekly = profile.weekly ?? { missionsCompleted: 0, goal: 5 }
  const [submitting, setSubmitting] = useState(null)
  const [localError, setLocalError] = useState(null)
  const [countdown, setCountdown] = useState(rotation?.remainingSeconds ?? 0)

  useEffect(() => {
    setCountdown(rotation?.remainingSeconds ?? 0)
  }, [rotation?.remainingSeconds])

  useEffect(() => {
    if (!rotation?.expiresAt) return undefined
    const updateCountdown = () => {
      setCountdown(Math.max(0, Math.floor((rotation.expiresAt - Date.now()) / 1000)))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [rotation?.expiresAt])

  const weeklyProgress = useMemo(() => {
    const percent = weekly.goal ? Math.min(100, Math.round((weekly.missionsCompleted / weekly.goal) * 100)) : 0
    return { percent, label: `${weekly.missionsCompleted}/${weekly.goal} missões da semana` }
  }, [weekly.goal, weekly.missionsCompleted])

  const rotationStats = useMemo(() => {
    if (!rotation) return { label: '---', remaining: null }
    const remaining = Math.max(0, (rotation.total ?? 0) - (rotation.completed ?? 0))
    return {
      label: `${rotation.completed ?? 0}/${rotation.total ?? 0} missões do dia concluídas`,
      remaining,
    }
  }, [rotation])

  const missionHero = theme?.selected?.hero?.missions ?? {}
  const heroSubtitle = missionHero.subtitle ?? 'Laboratório de Missões'
  const heroTitle = missionHero.title ?? 'Operações especiais para reforçar Python'
  const heroDescription =
    missionHero.description ??
    'Receba um novo briefing diariamente. Cada missão vem com restrições táticas e bônus extra — conclua todas antes do relógio zerar.'

  const handleAnswer = async (missionId, choice) => {
    try {
      setLocalError(null)
      setSubmitting(missionId)
      await completeMission(missionId, choice)
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <section className="page-section missions-page">
        <h2>Carregando laboratório de missões...</h2>
        <div className="skeleton" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section missions-page">
        <p className="error">{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </section>
    )
  }

  return (
    <section className="page-section missions-page">
      <header className="page-hero">
        <div>
          <p className="subtitle">{heroSubtitle}</p>
          <h1>{heroTitle}</h1>
          <p>{heroDescription}</p>
          <div className="rotation-meta">
            <span className="pill ghost">Reset em {formatCountdown(countdown)}</span>
            <span className="pill ghost">{rotationStats.label}</span>
            {refreshing && <span className="pill ghost">Sincronizando...</span>}
          </div>
        </div>
        <div className="currency-card">
          <p>Moedas do Lab</p>
          <strong>{profile.currency ?? 0}</strong>
          <small>A cada missão você recebe XP + inventário</small>
        </div>
      </header>

      <div className="missions-summary">
        <div className="weekly-card">
          <p>Meta semanal</p>
          <div className="weekly-progress">
            <strong>{weeklyProgress.label}</strong>
            <div className="progress-bar">
              <span style={{ width: `${weeklyProgress.percent}%` }} />
            </div>
          </div>
          <small>Complete {weekly.goal} missões para garantir bônus fixo no fim da semana.</small>
        </div>
        <div className="booster-inventory">
          {Object.entries(boosterCopy).map(([key, meta]) => (
            <div key={key} className="inventory-pill">
              <span aria-hidden>{meta.icon}</span>
              <div>
                <p>{meta.label}</p>
                <strong>{boosters[key] ?? 0}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {localError && <p className="error">{localError}</p>}

      {rotationStats.remaining === 0 && rotation ? (
        <div className="all-cleared">
          <p>Você encerrou todas as missões do dia. Volte após o reset para novos incidentes.</p>
        </div>
      ) : (
        <div className="mission-grid">
          {(rotation?.missions ?? []).map((mission) => (
            <MissionCard key={mission.id} mission={mission} onAnswer={handleAnswer} busy={submitting} />
          ))}
        </div>
      )}
    </section>
  )
}
