import { useEffect, useRef, useState } from 'react'
import elec1 from '../assets/elec-1.jpg'
import int1 from '../assets/int-1.jpg'
import int2 from '../assets/int-2.jpg'

const services = [
  {
    id: 'travaux-interieurs',
    title: 'Travaux intérieurs',
    image: int1,
    description:
      'Cloisons, revêtements de sol, peinture, isolation. Je rénove vos espaces pour les rendre plus beaux et plus confortables.',
    href: '#services-travaux',
    icon: (
      <svg
        className="h-10 w-10 text-slate-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    id: 'electricite',
    title: 'Électricité',
    image: elec1,
    description:
      'Mise aux normes, création ou modification de tableau électrique, installation de systèmes modernes. Travaux certifiés.',
    href: '#services-electricite',
    icon: (
      <svg
        className="h-10 w-10 text-slate-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    id: 'amenagement',
    title: 'Aménagement sur-mesure',
    image: int2,
    description:
      'Cuisine, salle de bain, chambre… Je conçois et réalise des espaces adaptés à vos envies et à votre mode de vie.',
    href: '#services-amenagement',
    icon: (
      <svg
        className="h-10 w-10 text-slate-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
]

const horizontalOffset = ['lg:-translate-x-4', 'lg:translate-x-0', 'lg:translate-x-4']
const stairOffset = ['lg:mt-0', 'lg:mt-8', 'lg:mt-16']
const staggerDelay = ['delay-0', 'delay-75', 'delay-150']

export default function ServicesSection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="border-t border-slate-100 bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ce que je fais pour vous
          </h2>
        </header>

        <div className="mt-12 grid items-start gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className={`group relative flex h-[28rem] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                horizontalOffset[index]
              } ${stairOffset[index]} ${
                visible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              } ${staggerDelay[index]}`}
            >
              <div className="h-56 w-full shrink-0 overflow-hidden rounded-t-xl">
                <img
                  src={service.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className="absolute left-8 top-[12.5rem] z-10 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                aria-hidden
              >
                {service.icon}
              </div>
              <div className="flex min-h-0 flex-1 flex-col px-8 pb-10 pt-10">
                <h3 className="text-lg font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <a
                  href={service.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-900 underline-offset-4 transition-colors group-hover:text-primary group-hover:decoration-primary"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white transition-colors group-hover:bg-primary group-hover:text-white">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  Découvrir ce service
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
