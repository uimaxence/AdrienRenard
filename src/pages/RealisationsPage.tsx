import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { contentfulClient } from '../lib/contentful'
import { slugify } from '../lib/slug'

type Realisation = {
  id: string
  title: string
  slug: string
  category: string
  description?: string
  coverUrl?: string
}

function getAssetUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url
  if (!url) return undefined
  return url.startsWith('//') ? `https:${url}` : url
}

export default function RealisationsPage({ navHeight }: { navHeight: number }) {
  const [items, setItems] = useState<Realisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('Tous')

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setLoading(true)
        setError(null)
        if (!contentfulClient) {
          throw new Error(
            'Contentful n’est pas configuré. Renseignez VITE_CONTENTFUL_SPACE_ID et VITE_CONTENTFUL_DELIVERY_TOKEN.',
          )
        }

        const res = await contentfulClient.getEntries({
          content_type: 'realisation',
          include: 2,
          order: ['-sys.createdAt'],
        })

        const mapped: Realisation[] = (res.items ?? []).map((it: any) => ({
          id: it.sys.id,
          title: it.fields?.title ?? 'Réalisation',
          slug: it.fields?.slug ?? slugify(it.fields?.title ?? 'realisation'),
          category: it.fields?.category ?? 'Autre',
          description: it.fields?.description,
          coverUrl: getAssetUrl(it.fields?.coverImage ?? it.fields?.image),
        }))

        if (!cancelled) setItems(mapped)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Erreur lors du chargement.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const map = new Map<string, number>()
    items.forEach((it) => map.set(it.category, (map.get(it.category) ?? 0) + 1))
    const cats = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }))
    return [{ name: 'Tous', count: items.length }, ...cats]
  }, [items])

  const filtered = useMemo(() => {
    if (activeCategory === 'Tous') return items
    return items.filter((it) => it.category === activeCategory)
  }, [items, activeCategory])

  return (
    <main style={{ paddingTop: navHeight }}>
      <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Réalisations
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Découvrez quelques chantiers réalisés. Filtrez par catégorie pour
            retrouver rapidement le type de projet qui vous inspire.
          </p>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = cat.name === activeCategory
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(cat.name)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                  <span className={`ml-2 text-xs ${active ? 'text-white/90' : 'text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8">
            {loading && (
              <p className="text-sm text-slate-600">Chargement des réalisations…</p>
            )}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <p className="text-sm text-slate-600">
                Aucune réalisation dans cette catégorie pour le moment.
              </p>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((it) => (
                  <article
                    key={it.id}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  >
                    <div className="h-48 w-full bg-slate-100">
                      <Link to={`/realisations/${it.slug}`} className="block h-full w-full">
                        {it.coverUrl ? (
                          <img
                            src={it.coverUrl}
                            alt={it.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </Link>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {it.category}
                      </p>
                      <h2 className="mt-2 text-lg font-bold text-slate-900">
                        <Link to={`/realisations/${it.slug}`} className="hover:underline">
                          {it.title}
                        </Link>
                      </h2>
                      {it.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {it.description}
                        </p>
                      ) : null}
                      <p className="mt-4">
                        <Link
                          to={`/realisations/${it.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-900 underline-offset-4 hover:text-primary hover:decoration-primary"
                        >
                          Voir le détail
                        </Link>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

