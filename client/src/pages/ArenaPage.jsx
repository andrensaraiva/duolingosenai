import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export default function ArenaPage() {
  const { arena } = useAppData()
  const { challenges, loading, error, refreshing } = arena

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
          <p className="subtitle">Arena · Automação completa</p>
          <h1>Laboratório vivo</h1>
          <p>Transfira o que aprendeu sobre Python para um script de sensores real e mostre sua eficiência.</p>
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
                <p className="warning">
                  Dica: finalize a trilha Python para dominar as práticas recomendadas antes de competir na Arena.
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
