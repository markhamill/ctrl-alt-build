import moraleData from '../data/morale.json'

interface DataPoint {
  date: string
  score: number | null
}

function getSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

export default function MoraleChart() {
  const rawHistory: DataPoint[] = moraleData.history || []
  const history = rawHistory.filter(
    (item): item is { date: string; score: number } =>
      typeof item.score === 'number' && item.score !== null && !isNaN(item.score)
  )
  
  // Dimensions and paddings (ultra-compact squashed height without left legend)
  const svgWidth = 700
  const svgHeight = 75
  const padLeft = 15
  const padRight = 15
  const padTop = 10
  const padBottom = 20

  const chartWidth = svgWidth - padLeft - padRight
  const chartHeight = svgHeight - padTop - padBottom

  // Score mapping: +2 (top) to -2 (bottom)
  const mapY = (score: number) => {
    const clamped = Math.max(-2, Math.min(2, score))
    // normalized 0 at bottom (-2), 1 at top (+2)
    const norm = (clamped - (-2)) / (2 - (-2))
    return padTop + chartHeight - norm * chartHeight
  }

  const mapX = (index: number) => {
    if (history.length <= 1) return padLeft + chartWidth / 2
    return padLeft + (index / (history.length - 1)) * chartWidth
  }

  const points = history.map((item, idx) => ({
    x: mapX(idx),
    y: mapY(item.score)
  }))

  const linePath = getSmoothPath(points)

  // Area path for gradient under line
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`
    : ''

  const yTicks = [
    { score: 2 },
    { score: 1 },
    { score: 0 },
    { score: -1 },
    { score: -2 }
  ]

  return (
    <div className="border border-gray-800/80 bg-brutal-panel p-4 mb-6 rounded-none">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-3">
        <h3 className="text-[11px] font-bold text-white tracking-widest uppercase">
          {moraleData.title}
        </h3>
        <span className="text-[11px] text-gray-500 font-mono">
          {moraleData.subtitle}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto min-w-[500px]"
          aria-label="Morale Index Trend Line Chart"
        >
          <defs>
            <linearGradient id="moraleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4a00" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff4a00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, idx) => {
            const y = mapY(tick.score)
            return (
              <line 
                key={idx}
                x1={padLeft} 
                y1={y} 
                x2={svgWidth - padRight} 
                y2={y} 
                stroke={tick.score === 0 ? "#3b3b3b" : "#222222"} 
                strokeDasharray={tick.score === 0 ? "none" : "3 3"}
                strokeWidth={tick.score === 0 ? 1.5 : 1}
              />
            )
          })}

          {/* Area fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#moraleAreaGrad)" />
          )}

          {/* Smooth trend curve */}
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="#ff4a00" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}

          {/* Data points and date labels */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle 
                cx={pt.x} 
                cy={pt.y} 
                r="3" 
                fill="#ff4a00" 
                stroke="#0a0a0a" 
                strokeWidth="1.5" 
              />
              <text 
                x={pt.x} 
                y={padTop + chartHeight + 14} 
                textAnchor="middle" 
                className="fill-gray-500 font-mono text-[9px]"
              >
                {formatDate(history[idx].date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
