import { useCallback, useEffect } from 'react'
import { cfImage } from '../lib/contentful'

export type LightboxPhoto = { url: string; alt: string }

interface LightboxProps {
  photos: LightboxPhoto[]
  index: number | null
  onClose: () => void
  onIndexChange: (i: number) => void
}

export default function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null

  const prev = useCallback(() => {
    if (index === null) return
    onIndexChange((index - 1 + photos.length) % photos.length)
  }, [index, photos.length, onIndexChange])

  const next = useCallback(() => {
    if (index === null) return
    onIndexChange((index + 1) % photos.length)
  }, [index, photos.length, onIndexChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    // bloque le scroll de la page en arrière-plan
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, prev, next])

  if (!open || index === null) return null
  const photo = photos[index]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
    >
      {/* Fermer */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Photo précédente"
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Photo suivante"
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <figure className="flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={cfImage(photo.url, 1600)}
          alt={photo.alt}
          className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
        />
        <figcaption className="mt-3 text-center text-sm text-white/70">
          {photos.length > 1 && (
            <span className="mr-2 tabular-nums">
              {index + 1} / {photos.length}
            </span>
          )}
          {photo.alt}
        </figcaption>
      </figure>
    </div>
  )
}
