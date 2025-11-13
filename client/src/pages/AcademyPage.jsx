import { Link } from 'react-router-dom'
import LearningPath from '../components/LearningPath'
import { useAppData } from '../context/AppDataContext'

const MAX_LIVES = 3

export default function AcademyPage() {
  const { academy } = useAppData()
  const { path, profile, loading, error, refreshing } = academy
  const lives = profile?.lives ?? MAX_LIVES
  const streak = profile?.streak ?? 1
  const hearts = Array.from({ length: MAX_LIVES })

  if (loading) {
    return (
      <section className="page-section">
        <h2>Carregando trilha...</h2>
        <div className="skeleton" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <p className="error">{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </section>
    )
  }

  return (
    <section className="page-section">
      <header className="page-hero">
        <div>
          <p className="subtitle">Trilha Python · variáveis até if/else</p>
          <h1>Fundamentos para IA aplicada</h1>
          <p>Domine a base em blocos de 5 minutos e prepare-se para automatizar processos inteiros.</p>
        </div>
        <div className="xp-card">
          <p>Total XP</p>
          <strong>{profile?.xp ?? 0}</strong>
          <span>
            {profile?.completedLessons ?? 0} lições · {profile?.completedCheckpoints ?? 0} checkpoints
          </span>
          <div className="profile-gamification">
            <div className="profile-card hearts">
              <p>Corações</p>
              <div className="heart-row">
                {hearts.map((_, index) => (
                  <span key={`profile-heart-${index}`} className={index < lives ? 'full' : 'empty'} aria-hidden>
                    {index < lives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
              <small>
                {lives}/{MAX_LIVES}
              </small>
            </div>
            <div className="profile-card streak">
              <p>Streak</p>
              <strong>{streak} 🔥</strong>
              <small>Maior combo nas lições</small>
            </div>
          </div>
        </div>
      </header>
      {refreshing && <p className="pill ghost">Atualizando progresso...</p>}
      <LearningPath nodes={path} />
      <div className="future-banner">
        <p>
          Próximas trilhas: Dados para IA, Visão Computacional e NLP. Completar Python garante acesso antecipado quando elas chegarem.
        </p>
      </div>
      <footer className="page-footer">
        <p>
          Complete toda a trilha Python para liberar o Laboratório de Automação – nosso primeiro desafio completo de IA prática.
        </p>
        <Link to="/arena" className="pill-button ghost">
          Ver Arena
        </Link>
      </footer>
    </section>
  )
}
