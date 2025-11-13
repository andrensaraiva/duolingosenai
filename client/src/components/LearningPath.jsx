import { Link } from 'react-router-dom'

const statusCopy = {
  locked: 'Bloqueado',
  available: 'Disponível',
  completed: 'Concluído',
}

const iconForNode = (node) => {
  if (node.type === 'checkpoint') {
    return '🏰'
  }
  if (node.status === 'completed') {
    return '👑'
  }
  if (node.status === 'locked') {
    return '⚪'
  }
  return '🟢'
}

export default function LearningPath({ nodes = [] }) {
  return (
    <div className="learning-path">
      {nodes.map((node, index) => (
        <div key={node.id} className={`path-node ${node.type} ${node.status}`}>
          <div className="node-marker">
            <span className="node-icon" aria-hidden>
              {iconForNode(node)}
            </span>
            {index < nodes.length - 1 && <span className="node-line" />}
          </div>
          <div className="node-content">
            <p className="node-skill">{node.skill}</p>
            <h3>{node.title}</h3>
            <p className="node-status">{statusCopy[node.status]}</p>
            {node.type === 'lesson' && node.status === 'available' && (
              <Link className="pill-button" to={`/lesson/${node.id}`}>
                Continuar lição
              </Link>
            )}
            {node.type === 'lesson' && node.status === 'locked' && <span className="pill ghost">Complete a anterior</span>}
            {node.type === 'checkpoint' &&
              (node.status === 'locked' ? (
                <span className="pill ghost">Complete as lições anteriores</span>
              ) : (
                <Link className="pill-button" to="/arena">
                  Resolver na Arena
                </Link>
              ))}
            <p className="node-xp">+{node.rewardXp} XP</p>
          </div>
        </div>
      ))}
    </div>
  )
}
