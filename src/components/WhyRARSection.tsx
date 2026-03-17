import { useEffect, useRef, useState } from 'react'

const argumentsList = [
  {
    id: 'sur-mesure',
    title: 'Un accompagnement sur-mesure',
    description:
      'Un seul interlocuteur du devis à la livraison, à l\'écoute de vos besoins et de votre budget.',
  },
  {
    id: 'qualifie',
    title: 'Un artisan qualifié',
    description:
      'Certifié en électricité et charpente bois, je travaille avec des matériaux durables et dans le respect des normes.',
  },
  {
    id: 'delais',
    title: 'Des délais tenus',
    description:
      'Je m\'engage sur un planning clair dès le départ. Chantier propre, suivi régulier, résultat impeccable.',
  },
  {
    id: 'transparence',
    title: 'Transparence totale',
    description:
      'Devis détaillé et sans surprise. Vous êtes informé à chaque étape de l\'avancement des travaux.',
  },
]

const VIEWPORT_CENTER_THRESHOLD = 140

export default function WhyRARSection() {
  const refs = useRef<(HTMLElement | null)[]>([])
  const [visible, setVisible] = useState<boolean[]>([false, false, false, false])
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev]
              next[i] = true
              return next
            })
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -60px 0px' },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  useEffect(() => {
    function updateCentered() {
      const vh = window.innerHeight / 2
      let bestIndex: number | null = null
      let bestDistance = VIEWPORT_CENTER_THRESHOLD
      refs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const distance = Math.abs(cardCenter - vh)
        if (distance < bestDistance && rect.top < window.innerHeight && rect.bottom > 0) {
          bestDistance = distance
          bestIndex = i
        }
      })
      setCenteredIndex((prev) => (prev === bestIndex ? prev : bestIndex))
    }
    updateCentered()
    window.addEventListener('scroll', updateCentered, { passive: true })
    window.addEventListener('resize', updateCentered)
    return () => {
      window.removeEventListener('scroll', updateCentered)
      window.removeEventListener('resize', updateCentered)
    }
  }, [])

  return (
    <section className="overflow-hidden px-6 py-16 lg:py-24" aria-labelledby="engagement-title">
      <div className="mx-auto max-w-4xl">
        <h2
          id="engagement-title"
          className="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          L'engagement qualité R.A.R
        </h2>

        <div className="mt-14 flex flex-col items-stretch gap-12 sm:gap-16">
          {argumentsList.map((arg, index) => {
            const fromLeft = index % 2 === 0
            const isVisible = visible[index]
            return (
              <article
                key={arg.id}
                ref={(el) => {
                  refs.current[index] = el
                }}
                className={`flex justify-center transition-all duration-700 ease-out ${
                  fromLeft ? 'items-start' : 'items-end'
                } ${isVisible ? 'opacity-100 translate-x-0' : fromLeft ? 'opacity-0 -translate-x-12 sm:-translate-x-20' : 'opacity-0 translate-x-12 sm:translate-x-20'}`}
              >
                <div
                  className={`w-full max-w-lg rounded-xl border bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 sm:p-8 ${
                    fromLeft ? 'sm:mr-auto' : 'sm:ml-auto'
                  } ${
                    centeredIndex === index
                      ? 'border-primary/20 shadow-[0_2px_12px_rgba(218,110,48,0.06)]'
                      : 'border-slate-100'
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {arg.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {arg.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
