import { useEffect, useMemo, useState } from 'react'

const speeds = [1, 2, 4]
const stagePalette = ['#7ed957', '#64b5f6', '#ffb74d', '#ba68c8', '#4db6ac', '#ff8a80']

export default function SimulationViewer({ path = [], metrics = {}, onInsightsChange }) {
  const safePath = useMemo(() => (path.length ? path : [{ x: 0, y: 0 }]), [path])
  const [frame, setFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const stageColors = useMemo(() => {
    const map = {}
    const layout = metrics?.pipeline?.layout ?? []
    layout.forEach((stage, index) => {
      map[stage.id] = stagePalette[index % stagePalette.length]
    })
    return map
  }, [metrics?.pipeline?.layout])

  const visitedMap = useMemo(() => {
    const map = new Map()
    safePath.forEach((point, index) => {
      const key = `${point.x}-${point.y}`
      if (!map.has(key)) {
        map.set(key, { index, stageId: point.stageId ?? null })
      }
    })
    return map
  }, [safePath])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrame(0)
    setIsPlaying(false)
  }, [safePath])

  useEffect(() => {
    if (onInsightsChange) {
      onInsightsChange(metrics)
    }
  }, [metrics, onInsightsChange])

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
          const visitMeta = visitedMap.get(`${cell.x}-${cell.y}`)
          const isVisited = Boolean(visitMeta)
          const isCurrent = current?.x === cell.x && current?.y === cell.y
          const stageId = visitMeta?.stageId ?? null
          let cellStyle = stageId && stageColors[stageId] ? { backgroundColor: stageColors[stageId], borderColor: stageColors[stageId] } : {}
          if (isCurrent) {
            cellStyle = { ...cellStyle, boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.85)' }
          }
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className={`grid-cell ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''}`}
              style={cellStyle}
            >
              {isCurrent ? '🤖' : ''}
            </div>
          )
        })}
      </div>
      {metrics?.pipeline?.layout?.length > 0 && (
        <div className="stage-legend">
          {metrics.pipeline.layout.map((stage) => (
            <span key={stage.id} className="stage-chip" style={{ '--stage-color': stageColors[stage.id] || '#7ed957' }}>
              <i style={{ backgroundColor: stageColors[stage.id] || '#7ed957' }} />
              {stage.label}
            </span>
          ))}
        </div>
      )}
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
