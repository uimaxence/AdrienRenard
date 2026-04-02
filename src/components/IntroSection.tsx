import { useCallback, useRef, useState } from 'react'
import adrien from '../assets/photo_renard.webp'

const COLS = 48
const ROWS = 32

export default function IntroSection() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null)

  const points: [number, number][] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      points.push([i, j])
    }
  }

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS - 1; i++) {
      lines.push({ x1: i, y1: j, x2: i + 1, y2: j })
    }
  }
  for (let j = 0; j < ROWS - 1; j++) {
    for (let i = 0; i < COLS; i++) {
      lines.push({ x1: i, y1: j, x2: i, y2: j + 1 })
    }
  }

  const cells: [number, number][] = []
  for (let j = 0; j < ROWS - 1; j++) {
    for (let i = 0; i < COLS - 1; i++) {
      cells.push([i, j])
    }
  }

  const getCellFromMouse = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const scale = Math.max(rect.width / COLS, rect.height / ROWS)
    const offsetX = (rect.width - COLS * scale) / 2
    const offsetY = (rect.height - ROWS * scale) / 2
    const sx = (clientX - rect.left - offsetX) / scale
    const sy = (clientY - rect.top - offsetY) / scale
    if (sx < 0 || sy < 0 || sx >= COLS || sy >= ROWS) return null
    const cx = Math.min(Math.floor(sx), COLS - 2)
    const cy = Math.min(Math.floor(sy), ROWS - 2)
    return { x: cx, y: cy }
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const cell = getCellFromMouse(e.clientX, e.clientY)
      setHoveredCell((prev) =>
        prev && cell && prev.x === cell.x && prev.y === cell.y ? prev : cell
      )
    },
    [getCellFromMouse],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null)
  }, [])

  return (
    <section
      id="apropos"
      className="relative overflow-hidden border-t border-slate-100 bg-slate-50/50 py-16 md:py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grille de points et liens qui brillent (très discret) + suivi souris */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
        aria-hidden
      >
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="intro-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.08" result="blur" />
              <feFlood floodColor="rgb(218, 110, 48)" floodOpacity="0.45" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#intro-glow)" className="text-primary">
            {/* Intérieur des carrés : opacité 0.1, puis 0.5 au survol */}
            {cells.map(([i, j]) => (
              <rect
                key={`c-${i}-${j}`}
                x={i}
                y={j}
                width={1}
                height={1}
                fill="currentColor"
                opacity={hoveredCell && hoveredCell.x === i && hoveredCell.y === j ? 0.5 : 0.1}
                style={{ transition: 'opacity 0.22s ease-out' }}
              />
            ))}
            {/* Liens : opacité 0.1 → 0.3, décalage aléatoire */}
            {lines.map((line, k) => (
              <line
                key={`l-${k}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeWidth="0.06"
                strokeLinecap="round"
                strokeOpacity="1"
                className="animate-intro-line-pulse"
                style={{
                  animationDelay: `${((k * 17) % 2800) / 1000}s`,
                  animationDuration: `${2.2 + ((k * 7) % 11) * 0.1}s`,
                }}
              />
            ))}
            {/* Points : scintillement décalé */}
            {points.map(([x, y], k) => (
              <circle
                key={`p-${k}`}
                cx={x}
                cy={y}
                r="0.06"
                fill="currentColor"
                className="animate-intro-point-glow"
                style={{
                  animationDelay: `${((k * 37 + 13) % 3200) / 1000}s`,
                  animationDuration: `${2 + (k % 7) * 0.35}s`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative lg:min-w-[340px] lg:max-w-[400px]">
          <img
            src={adrien}
            alt="Adrien Renard, artisan en rénovation et électricité"
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Bienvenue chez R.A.R, votre partenaire en rénovation
          </h2>
          <div className="mt-6 space-y-4 text-slate-600">
            <p className="leading-relaxed">
              Vous avez un projet de rénovation ? Que ce soit pour moderniser une
              pièce, refaire votre installation électrique ou repenser entièrement
              votre intérieur, je suis là pour vous accompagner de A à Z.
            </p>
            <p className="leading-relaxed">
              En tant qu'artisan indépendant, je suis votre interlocuteur unique du
              premier contact jusqu'à la réception du chantier. Pas d'intermédiaire,
              pas de mauvaise surprise.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
