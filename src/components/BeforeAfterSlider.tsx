import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
  className = '',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50) // 0–100, part visible de l'image "avant" (à gauche)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      handleMove(e.clientX)
      const onMove = (e: PointerEvent) => handleMove(e.clientX)
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        target.releasePointerCapture?.(e.pointerId)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      target.setPointerCapture?.(e.pointerId)
    },
    [handleMove],
  )

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 ${className}`}
      role="img"
      aria-label={`Comparaison avant-après : ${beforeLabel} et ${afterLabel}`}
    >
      {/* Image "après" (fond, à droite) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Image "avant" (à gauche, masque selon position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Poignée verticale */}
      <div
        className="absolute top-0 bottom-0 z-10 w-1 cursor-ew-resize touch-none select-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        onPointerDown={onPointerDown}
      >
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md" />
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white shadow-sm" />
      </div>
    </div>
  )
}
