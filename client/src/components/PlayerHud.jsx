import { useMemo } from 'react'
import { useAppData } from '../context/AppDataContext'

export default function PlayerHud() {
  const { academy, missions } = useAppData()
  const profile = academy.profile ?? {}
  const boosters = profile.boosters ?? {}
  const activeBoosters = profile.activeBoosters ?? {}
  const rotation = missions.rotation

  const hearts = useMemo(() => {
    const current = Math.max(0, Math.min(3, profile.lives ?? 3))
    return Array.from({ length: 3 }, (_value, index) => (index < current ? '❤️' : '🖤'))
  }, [profile.lives])

  const boosterBadges = useMemo(() => {
    return (
      Object.entries(boosters)
        .filter(([, count]) => count > 0)
        .map(([key, count]) => ({ key, count, icon: key === 'turboFarm' ? '⚡' : key === 'heartShield' ? '🛡️' : '🛰️' }))
        .slice(0, 3)
    )
  }, [boosters])

  return (
    <header className="player-hud">
      <div className="hud-column">
        <p className="hud-label">Piloto</p>
        <strong className="hud-value">{profile.codename ?? 'Operador Python'}</strong>
        <small>Combo atual: {profile.streak ?? 1} 🔥</small>
      </div>
      <div className="hud-column">
        <p className="hud-label">XP total</p>
        <strong className="hud-value">{profile.xp ?? 0}</strong>
        <small>{profile.completedLessons ?? 0} lições · {profile.completedCheckpoints ?? 0} checkpoints</small>
      </div>
      <div className="hud-column hearts">
        <p className="hud-label">Corações</p>
        <div className="heart-row">
          {hearts.map((heart, index) => (
            <span key={heart + index}>{heart}</span>
          ))}
        </div>
        {activeBoosters.heartShield && <small>Escudo ativo ✅</small>}
      </div>
      <div className="hud-column">
        <p className="hud-label">Moedas</p>
        <strong className="hud-value">{profile.currency ?? 0}</strong>
        <small>{rotation ? `${rotation.completed ?? 0}/${rotation.total ?? 0} missões do dia` : 'Sincronizando...'}</small>
      </div>
      <div className="hud-column boosters">
        <p className="hud-label">Boosters</p>
        {boosterBadges.length ? (
          <div className="booster-row">
            {boosterBadges.map((booster) => (
              <span key={booster.key} className="booster-chip">
                {booster.icon} ×{booster.count}
              </span>
            ))}
          </div>
        ) : (
          <small>Nenhum disponível</small>
        )}
        {activeBoosters.turboFarm && <small>Turbo ativo ⚡</small>}
      </div>
    </header>
  )
}
