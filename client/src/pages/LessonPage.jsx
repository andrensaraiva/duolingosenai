import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { useAppData } from '../context/AppDataContext'

const cardTitles = {
  concept: 'Conceito',
  code: 'Exemplo',
  quiz: 'Prática Rápida',
  arrange: 'Ordene os blocos',
}

const MAX_HEARTS = 3
const STREAK_BONUS_THRESHOLD = 3
const HEART_RECOVERY_THRESHOLD = 4
const praiseMessages = ['Ótimo ritmo! ⭐', 'Combo perfeito! 🔥', 'Você está voando! 🚀']
const retryMessages = ['Respira e tenta de novo. 💪', 'Quase lá, revise o enunciado.', 'Sem pânico! Ajuste e continue.']

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { completeLesson } = useAppData()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [arrangements, setArrangements] = useState({})
  const [completion, setCompletion] = useState(null)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [streak, setStreak] = useState(1)
  const [combo, setCombo] = useState(0)
  const [motivation, setMotivation] = useState('Vamos começar a missão!')
  const [bonusBadge, setBonusBadge] = useState(null)

  const triggerBonus = (message) => {
    setBonusBadge({ id: Date.now(), message })
  }

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true)
    const { data } = await api.get(`/academy/lessons/${lessonId}`)
    setLesson(data)
    setCardIndex(0)
    setAnswers({})
    setArrangements({})
    setCompletion(null)
    setHearts(MAX_HEARTS)
    setStreak(1)
    setCombo(0)
    setMotivation('Vamos começar a missão!')
    setBonusBadge(null)
      } catch (err) {
        setError(err.response?.data?.message ?? err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId])

  useEffect(() => {
    if (!bonusBadge) return undefined
    const timer = setTimeout(() => setBonusBadge(null), 2800)
    return () => clearTimeout(timer)
  }, [bonusBadge])

  const card = useMemo(() => lesson?.cards?.[cardIndex], [lesson, cardIndex])
  const totalCards = lesson?.cards?.length ?? 0
  const requiredSteps = useMemo(() => {
    if (!lesson?.cards) return []
    return lesson.cards.reduce((acc, current, index) => {
      if (current.type === 'quiz' || current.type === 'arrange') {
        acc.push(index)
      }
      return acc
    }, [])
  }, [lesson])

  const progress = totalCards ? ((cardIndex + 1) / totalCards) * 100 : 0
  const correctRequiredSteps = requiredSteps.filter((index) => answers[index]?.correct).length
  const xpPreview = lesson?.rewardXp
    ? Math.round(((requiredSteps.length ? correctRequiredSteps / requiredSteps.length : 0) * lesson.rewardXp))
    : 0
  const xpPercent = lesson?.rewardXp ? Math.min(100, Math.round((xpPreview / lesson.rewardXp) * 100)) : 0
  const heartsArray = Array.from({ length: MAX_HEARTS })
  const outOfHearts = hearts === 0
  const heartDanger = hearts === 1

  const handleNext = () => {
    if (cardIndex + 1 < totalCards) {
      setCardIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex((prev) => prev - 1)
    }
  }

  const markAnswer = (isCorrect, extra = {}) => {
    setAnswers((prev) => ({
      ...prev,
      [cardIndex]: { correct: isCorrect, timestamp: Date.now(), ...extra },
    }))
    if (isCorrect) {
      setCombo((prev) => {
        const next = prev + 1
        const bonusMessages = []
        if (next % STREAK_BONUS_THRESHOLD === 0) {
          setStreak((prevStreak) => prevStreak + 1)
          bonusMessages.push('🔥 +1 streak!')
        }
        if (next % HEART_RECOVERY_THRESHOLD === 0) {
          let recoveredHeart = false
          setHearts((prevHearts) => {
            if (prevHearts < MAX_HEARTS) {
              recoveredHeart = true
              return prevHearts + 1
            }
            return prevHearts
          })
          if (recoveredHeart) {
            bonusMessages.push('💖 Coração recuperado')
          }
        }
        if (bonusMessages.length) {
          triggerBonus(bonusMessages.join(' · '))
        }
        return next
      })
      setMotivation(praiseMessages[Math.floor(Math.random() * praiseMessages.length)])
    } else {
      setCombo(0)
      setHearts((prev) => {
        const next = Math.max(prev - 1, 0)
        if (next === 0) {
          triggerBonus('💤 Sem corações — revise um card anterior!')
        }
        return next
      })
      setMotivation(retryMessages[Math.floor(Math.random() * retryMessages.length)])
    }
  }

  const handleQuizChoice = (choice) => {
    const isCorrect = choice === card.answer
    markAnswer(isCorrect, { choice })
  }

  const arrangement = arrangements[cardIndex] ?? card?.blocks ?? []

  const updateArrangement = (index, direction) => {
    setArrangements((prev) => {
      const current = [...(prev[cardIndex] ?? card.blocks)]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= current.length) return prev
      ;[current[index], current[target]] = [current[target], current[index]]
      return { ...prev, [cardIndex]: current }
    })
  }

  const checkArrangement = () => {
    const current = arrangements[cardIndex] ?? card.blocks
    const isCorrect = current.join('||') === card.solution.join('||')
    markAnswer(isCorrect)
  }

  const allCardsReviewed = cardIndex === totalCards - 1
  const readyToFinish = requiredSteps.every((index) => answers[index]?.correct)

  const finishLesson = async () => {
    try {
      const data = await completeLesson(lessonId, { heartsLeft: hearts, streak })
      setCompletion({
        xp: data.profile?.xp ?? data.progress?.xp ?? 0,
        message: data.message,
        heartsLeft: hearts,
        streak,
      })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <section className="page-section">
        <p>Carregando lição...</p>
        <div className="skeleton" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <p className="error">{error}</p>
        <Link to="/">Voltar</Link>
      </section>
    )
  }

  if (!lesson) return null

  return (
    <section className="page-section lesson-page">
      <header className="lesson-header">
        <button type="button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <div>
          <p className="subtitle">{lesson.skill}</p>
          <h2>{lesson.title}</h2>
          <p>Duração média: {lesson.durationMinutes} min</p>
        </div>
      </header>
      <div className="lesson-gamification">
        <div className="hearts">
          {heartsArray.map((_, index) => (
            <span key={`heart-${lessonId}-${index}`} className={index < hearts ? 'full' : 'empty'} aria-hidden>
              {index < hearts ? '❤️' : '🖤'}
            </span>
          ))}
          <small>{hearts} corações</small>
          {heartDanger && <small className="warning-text">Último coração!</small>}
        </div>
        <div className="streak-card">
          <p>Streak</p>
          <strong>{streak} 🔥</strong>
        </div>
        <div className="xp-meter">
          <div className="xp-progress" style={{ width: `${xpPercent}%` }} />
          <span>
            {xpPreview}/{lesson.rewardXp} XP
          </span>
        </div>
      </div>
      <div className="motivation-stack">
        <p className="motivation">{motivation}</p>
        {combo > 1 && <span className="combo-pill">Combo x{combo}</span>}
        {bonusBadge && <span key={bonusBadge.id} className="bonus-badge">{bonusBadge.message}</span>}
      </div>
      <div className="progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      {completion ? (
        <div className="lesson-complete">
          <h3>Lição concluída!</h3>
          <p>{completion.message}</p>
          <p>
            Total XP agora: <strong>{completion.xp}</strong>
          </p>
          <p>
            Corações restantes: <strong>{completion.heartsLeft}</strong> · Streak atual: <strong>{completion.streak} dias</strong>
          </p>
          <div className="complete-actions">
            <Link className="pill-button" to="/">
              Voltar à trilha
            </Link>
            <Link className="pill-button ghost" to="/arena">
              Ir para Arena
            </Link>
          </div>
        </div>
      ) : (
        <article className={`lesson-card type-${card?.type}`}>
          <p className="card-label">{cardTitles[card?.type]}</p>
          {card?.type === 'concept' && (
            <>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </>
          )}
          {card?.type === 'code' && (
            <>
              <h3>{card.title}</h3>
              <pre>
                <code>{card.snippet}</code>
              </pre>
              <p>{card.explanation}</p>
            </>
          )}
          {card?.type === 'quiz' && (
            <div className="quiz">
              <p>{card.prompt}</p>
              {card.codeBefore && (
                <pre className="inline-code">
                  <code>
                    {card.codeBefore}
                    <span className="blank">___</span>
                    {card.codeAfter}
                  </code>
                </pre>
              )}
              <div className="quiz-options">
                {card.choices.map((choice) => {
                  const answered = answers[cardIndex]?.choice === choice
                  const isCorrect = choice === card.answer
                  return (
                    <button
                      type="button"
                      key={choice}
                      className={`pill-button ${answered ? (isCorrect ? 'success' : 'danger') : ''}`}
                      onClick={() => handleQuizChoice(choice)}
                    >
                      {choice}
                    </button>
                  )
                })}
              </div>
              {answers[cardIndex] && (
                <p className={answers[cardIndex].correct ? 'success' : 'danger'}>
                  {answers[cardIndex].correct ? 'Boa! 👏' : card.feedback}
                </p>
              )}
            </div>
          )}
          {card?.type === 'arrange' && (
            <div className="arrange">
              <p>{card.prompt}</p>
              <ul>
                {arrangement.map((block, idx) => (
                  <li key={block + idx}>
                    <span>{block}</span>
                    <div>
                      <button type="button" onClick={() => updateArrangement(idx, 'up')}>
                        ↑
                      </button>
                      <button type="button" onClick={() => updateArrangement(idx, 'down')}>
                        ↓
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className="pill-button" onClick={checkArrangement}>
                Verificar ordem
              </button>
              {answers[cardIndex] && (
                <p className={answers[cardIndex].correct ? 'success' : 'danger'}>
                  {answers[cardIndex].correct ? 'Perfeito! 👑' : card.feedback}
                </p>
              )}
            </div>
          )}
          <footer className="lesson-footer">
            <button type="button" onClick={handlePrev} disabled={cardIndex === 0}>
              Anterior
            </button>
            <div>
              {allCardsReviewed ? (
                <button type="button" className="pill-button" onClick={finishLesson} disabled={!readyToFinish}>
                  Concluir lição
                </button>
              ) : (
                <button type="button" className="pill-button" onClick={handleNext}>
                  Próximo
                </button>
              )}
              {outOfHearts && <p className="warning">Sem corações! Volte alguns cards, acerte em sequência e recupere um coração bônus.</p>}
            </div>
          </footer>
        </article>
      )}
    </section>
  )
}
