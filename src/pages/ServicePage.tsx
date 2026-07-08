import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { contentfulClient, cfImage } from '../lib/contentful'
import { slugify } from '../lib/slug'
import { getService } from '../data/services'
import SEO from '../components/SEO'
import Button from '../components/Button'

const SITE_URL = 'https://www.adrienrenard.fr'

type MiniReal = { title: string; slug: string; category: string; coverUrl?: string }

function getAssetUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url
  if (!url) return undefined
  return url.startsWith('//') ? `https:${url}` : url
}

export default function ServicePage({ navHeight }: { navHeight: number }) {
  const { slug } = useParams<{ slug: string }>()
  const service = getService(slug)
  const [realisations, setRealisations] = useState<MiniReal[]>([])

  useEffect(() => {
    if (!service || !contentfulClient) return
    let cancelled = false
    contentfulClient
      .getEntries({ content_type: 'realisation', include: 2, order: ['-sys.createdAt'] })
      .then((res: any) => {
        if (cancelled) return
        const mapped: MiniReal[] = (res.items ?? [])
          .map((it: any) => ({
            title: it.fields?.title ?? 'Réalisation',
            slug: it.fields?.slug ?? slugify(it.fields?.title ?? 'realisation'),
            category: it.fields?.category ?? '',
            coverUrl: getAssetUrl(it.fields?.coverImage ?? it.fields?.image),
          }))
          .filter((r: MiniReal) => service.categories.includes(r.category))
        setRealisations(mapped)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [service])

  const jsonLd = useMemo(() => {
    if (!service) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.h1,
      description: service.seoDescription,
      serviceType: service.h1,
      provider: { '@type': 'GeneralContractor', name: 'R.A.R — Adrien Renard Rénovation', '@id': `${SITE_URL}/#business` },
      areaServed: [
        { '@type': 'City', name: 'Angers' },
        { '@type': 'AdministrativeArea', name: 'Maine-et-Loire (49)' },
      ],
      url: `${SITE_URL}/services/${service.slug}`,
    }
  }, [service])

  if (!service) {
    return (
      <main style={{ paddingTop: navHeight }}>
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Service introuvable</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Retour à l'accueil
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: navHeight }}>
      <SEO
        path={`/services/${service.slug}`}
        title={service.seoTitle}
        description={service.seoDescription}
      />
      {jsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}

      {/* En-tête */}
      <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Accueil
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-700">Services</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {service.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            {service.lead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as="a" href="/#contact">
              Demander un devis gratuit
            </Button>
            <a
              href="tel:0652212017"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ou appelez le 06 52 21 20 17
            </a>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Mes prestations
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              >
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations liées */}
      {realisations.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/50 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Réalisations en {service.h1.split(' à ')[0].toLowerCase()}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {realisations.map((r) => (
                <Link
                  key={r.slug}
                  to={`/realisations/${r.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <div className="h-48 w-full overflow-hidden bg-slate-100">
                    {r.coverUrl ? (
                      <img
                        src={cfImage(r.coverUrl, 600)}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {r.category}
                    </p>
                    <h3 className="mt-1 font-bold text-slate-900 group-hover:text-primary">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/realisations"
              className="mt-8 inline-block text-sm font-semibold text-slate-900 underline decoration-slate-900 underline-offset-4 hover:text-primary hover:decoration-primary"
            >
              Voir toutes les réalisations
            </Link>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Un projet à Angers ou en Maine-et-Loire ?
          </h2>
          <p className="mt-3 text-slate-600">
            Je vous réponds sous 48h avec un devis gratuit, clair et sans engagement.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button as="a" href="/#contact">
              Demander mon devis gratuit
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
