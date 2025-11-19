import { useMemo } from 'react'
import { useAppData } from '../context/AppDataContext'

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useAppData()
  const options = theme?.options ?? []
  const activeId = theme?.selected?.id

  const helperCopy = useMemo(() => {
    if (theme?.updating) return 'Sincronizando tema...'
    if (theme?.error) return theme.error
    return 'Escolha o contexto que mais combina com você'
  }, [theme?.updating, theme?.error])

  if (!options.length) return null

  return (
    <section className="theme-switcher" aria-label="Selecionar tema narrativo">
      <header>
        <div>
          <p className="hud-label">Tema ativo</p>
          <strong>{theme?.selected?.label ?? 'Carregando tema...'}</strong>
        </div>
        <small>{helperCopy}</small>
      </header>
      <div className="theme-card-grid">
        {options.map((option) => {
          const isActive = option.id === activeId
          return (
            <button
              type="button"
              key={option.id}
              className={`theme-card ${isActive ? 'active' : ''}`}
              onClick={() => changeTheme(option.id)}
              disabled={isActive || theme?.updating}
            >
              <span className="theme-chip">{option.chip}</span>
              <div className="theme-card-copy">
                <strong>{option.label}</strong>
                <p>{option.description}</p>
              </div>
              {isActive && <span className="theme-check">Ativo</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
