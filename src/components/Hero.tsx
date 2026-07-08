import heroPhoto from '../assets/hero-photo.webp'
import Button from './Button'

export default function Hero() {
  return (
    <section className="relative flex min-h-[56vh] items-center overflow-hidden bg-slate-900">
      {/* Photo de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroPhoto})` }}
      />
      {/* Filtre sombre pour garder le contenu lisible par-dessus */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-slate-950/75" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 py-14 text-center">
        <p className="text-sm font-medium text-white/80">
          Adrien Renard Rénovation
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Rénovation & électricité à Angers
          <br />
          et en Maine-et-Loire
        </h1>

        <p className="max-w-lg text-base text-white/90">
          Artisan qualifié, je transforme votre intérieur avec soin, dans les
          délais et selon votre budget.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button as="a" href="#contact">
            Demander un devis
          </Button>
          <Button
            as="a"
            href="#realisations"
            variant="secondary"
            className="text-white hover:text-white/80"
          >
            Voir mes réalisations
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-0 text-[12px] text-white/70">
          <span>Artisan qualifié en charpente & électricité</span>
          <span className="mx-3 inline-block h-3 w-px bg-white/30" />
          <span>Devis gratuit sous 48h</span>
          <span className="mx-3 inline-block h-3 w-px bg-white/30" />
          <span>Basé en Maine-et-Loire (49)</span>
        </div>
      </div>
    </section>
  )
}
