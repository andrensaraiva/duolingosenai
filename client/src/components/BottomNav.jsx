import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { id: 'academy', label: 'Academia', to: '/', icon: '📚' },
  { id: 'arena', label: 'Arena', to: '/arena', icon: '⚔️' },
]

export default function BottomNav() {
  const location = useLocation()
  const active = location.pathname.startsWith('/arena') ? 'arena' : 'academy'

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <Link key={tab.id} to={tab.to} className={`nav-item ${active === tab.id ? 'active' : ''}`}>
          <span className="nav-icon" aria-hidden>
            {tab.icon}
          </span>
          <span className="nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
