import { useEffect, useMemo, useState } from 'react'

const speeds = [1, 2, 4]

export default function SimulationViewer({ path = [], metrics = {} }) {
  const safePath = useMemo(() => (path.length ? path : [{ x: 0, y: 0 }]), [path])
  const [frame, setFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrame(0)
    setIsPlaying(false)
  }, [safePath])

  useEffect(() => {
    if (!isPlaying) return
    const id = setTimeout(() => {
      setFrame((prev) => (prev + 1 < safePath.length ? prev + 1 : prev))
    }, 600 / speed)
    return () => clearTimeout(id)
  }, [frame, isPlaying, speed, safePath.length])

  const grid = useMemo(() => {
    const bounds = safePath.reduce(
      (acc, point) => ({
        minX: Math.min(acc.minX, point.x),
        maxX: Math.max(acc.maxX, point.x),
        minY: Math.min(acc.minY, point.y),
        maxY: Math.max(acc.maxY, point.y),
      }),
      { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    )

    const width = bounds.maxX - bounds.minX + 1
    const height = bounds.maxY - bounds.minY + 1

    const cells = []
    for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
      for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
        cells.push({ x, y })
      }
    }

    return { width, height, cells, bounds }
  }, [safePath])

  const current = safePath[frame]

  return (
    <div className="simulation-viewer">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${grid.width}, 1fr)` }}>
        {grid.cells.map((cell) => {
          const visitedIndex = safePath.findIndex((point) => point.x === cell.x && point.y === cell.y)
          const isVisited = visitedIndex !== -1
          const isCurrent = current?.x === cell.x && current?.y === cell.y
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className={`grid-cell ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''}`}
            >
              {isCurrent ? '🤖' : ''}
            </div>
          )
        })}
      </div>
      <div className="sim-controls">
        <button type="button" onClick={() => setIsPlaying((prev) => !prev)}>
          {isPlaying ? 'Pausar' : '▶ Rodar'}
        </button>
        <button type="button" onClick={() => setFrame(0)} disabled={frame === 0}>
          Reiniciar
        </button>
        <div className="speed-selector">
          {speeds.map((value) => (
            <button key={value} type="button" className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)}>
              {value}x
            </button>
          ))}
        </div>
      </div>
      <div className="sim-metrics">
        <p>
          Tempo de execução: <strong>{metrics.time ?? '--'}s</strong>
        </p>
        <p>
          Rotinas automatizadas: <strong>{metrics.resourcesCollected ?? '--'}</strong>
        </p>
        <p>
          Eficiência: <strong>{metrics.efficiency ?? '--'}%</strong>
        </p>
        {typeof metrics.loopsUsed === 'number' && (
          <p>
            Loops detectados: <strong>{metrics.loopsUsed}</strong>
          </p>
        )}
        {metrics.insights && (
          <div className="insights">
            <p>
              Variáveis: <strong>{metrics.insights.assignments ?? 0}</strong>
            </p>
            <p>
              Condicionais: <strong>{metrics.insights.conditionals ?? 0}</strong>
            </p>
            <p>
              Loops: <strong>{metrics.insights.loops ?? 0}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
