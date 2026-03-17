import heroBg from '../assets/bg-hero.png'
import Button from './Button'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-slate-50">
      {/* Image de fond, opacité réduite */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          opacity: 0.1,
        }}
      />
      {/* Zone pour photos flottantes (à venir) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <p className="text-sm font-medium text-slate-500">
          Adrien Renard Rénovation
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Rénovation & électricité à Angers
          <br />
          et en Maine-et-Loire
        </h1>

        <p className="max-w-lg text-base text-slate-600">
          Artisan qualifié, je transforme votre intérieur avec soin, dans les
          délais et selon votre budget.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button as="a" href="#contact">
            Demander un devis
          </Button>
          <Button as="a" href="#realisations" variant="secondary">
            Voir mes réalisations
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-0 text-[12px] text-slate-500">
          <span>Artisan qualifié en charpente & électricité</span>
          <span className="mx-3 inline-block h-3 w-px bg-slate-300" />
          <span>Devis gratuit sous 48h</span>
          <span className="mx-3 inline-block h-3 w-px bg-slate-300" />
          <span>Basé en Maine-et-Loire (49)</span>
        </div>
      </div>
    </section>
  )
}
