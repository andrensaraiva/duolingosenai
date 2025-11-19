import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

const defaultHero = {
  subtitle: 'Arena · Automação completa',
  title: 'Laboratório vivo',
  description: 'Transfira o que aprendeu sobre Python para um script de sensores real e mostre sua eficiência.',
}

export default function ArenaPage() {
  const { arena, theme } = useAppData()
  const { challenges, loading, error, refreshing } = arena
  const hero = theme?.selected?.hero?.arena ?? defaultHero

  if (loading) {
    return (
      <section className="page-section">
        <h2>Carregando desafios...</h2>
        <div className="skeleton" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <p className="error">{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Atualizar
        </button>
      </section>
    )
  }

  return (
    <section className="page-section">
      <header className="page-hero">
        <div>
          <p className="subtitle">{hero.subtitle}</p>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </div>
      </header>
      {refreshing && <p className="pill ghost">Sincronizando com backend...</p>}
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <article key={challenge.id} className={`challenge-card ${challenge.status}`}>
            <header>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
            </header>
            <div className="challenge-meta">
              <p>Rotinas alvo: {challenge.goals.resources} · Execução desejada: {challenge.goals.maxTime}s</p>
              {challenge.scenario && <p>{challenge.scenario}</p>}
              {challenge.checkpointStatus !== 'completed' && (
                <p className="info">
                  Checkpoint ainda em progresso — completar a trilha rende bônus extras, mas você já pode competir agora.
                </p>
              )}
              {challenge.bestResult ? (
                <p>
                  Melhor tempo: <strong>{challenge.bestResult.time}s</strong>
                </p>
              ) : (
                <p>Nenhum resultado enviado ainda.</p>
              )}
              {challenge.ranking && (
                <p>
                  Ranking: #{challenge.ranking.position} / {challenge.ranking.totalPlayers}
                </p>
              )}
              {challenge.context && (
                <div className="challenge-context">
                  {challenge.context.briefing && <p className="context-briefing">{challenge.context.briefing}</p>}
                  <div className="context-grid">
                    {Array.isArray(challenge.context.focus) && challenge.context.focus.length > 0 && (
                      <div>
                        <p className="context-heading">Foco tático</p>
                        <ul>
                          {challenge.context.focus.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(challenge.context.constraints) && challenge.context.constraints.length > 0 && (
                      <div>
                        <p className="context-heading">Restrições</p>
                        <ul>
                          {challenge.context.constraints.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(challenge.context.telemetry) && challenge.context.telemetry.length > 0 && (
                      <div>
                        <p className="context-heading">Telemetria</p>
                        <ul>
                          {challenge.context.telemetry.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link className="pill-button" to={`/arena/${challenge.id}`}>
              Abrir workspace
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
