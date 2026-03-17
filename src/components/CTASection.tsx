import BeforeAfterSlider from './BeforeAfterSlider'
import Button from './Button'

import cuisineBefore from '../assets/cuisine-before.png'
import cuisineAfter from '../assets/cuisine-after.png'

export default function CTASection() {
  return (
    <section
      id="realisations"
      className="border-t border-slate-100 bg-slate-50/50 py-16 md:py-20"
      aria-labelledby="cta-final-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Bloc CTA (à gauche) */}
          <div className="flex flex-1 flex-col items-start text-left lg:max-w-md">
            <h2
              id="cta-final-title"
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Un projet en tête ? Parlons-en.
            </h2>
            <p className="mt-4 max-w-lg text-slate-600">
              Je vous réponds sous 48h et vous propose un devis gratuit, clair et
              sans engagement.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href="#contact"
                variant="primary"
              >
                Demander mon devis gratuit
              </Button>
              <p className="text-sm text-slate-600">
                Ou directement :{' '}
                <a
                  href="tel:0652212017"
                  className="font-medium text-primary hover:underline"
                >
                  06 52 21 20 17
                </a>
              </p>
            </div>
          </div>

          {/* Slider avant / après (à droite, beaucoup plus grand) */}
          <div className="w-full shrink-0 lg:min-w-0 lg:flex-[1.4] lg:basis-0">
            <BeforeAfterSlider
              beforeImage={cuisineBefore}
              afterImage={cuisineAfter}
              beforeLabel="Cuisine avant rénovation"
              afterLabel="Cuisine après rénovation"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
