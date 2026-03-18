import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'
import { contentfulClient } from '../lib/contentful'
import { slugify } from '../lib/slug'

type RealisationDetail = {
  id: string
  title: string
  slug: string
  category: string
  description?: string
  content?: Document
  coverUrl?: string
  photos: { url: string; title?: string }[]
}

function getAssetUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url
  if (!url) return undefined
  return url.startsWith('//') ? `https:${url}` : url
}

function getAssetTitle(asset: any): string | undefined {
  return asset?.fields?.title
}

export default function RealisationDetailPage({ navHeight }: { navHeight: number }) {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<RealisationDetail | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setLoading(true)
        setError(null)
        setItem(null)

        if (!slug) throw new Error('Réalisation introuvable.')
        if (!contentfulClient) {
          throw new Error(
            'Contentful n’est pas configuré. Renseignez VITE_CONTENTFUL_SPACE_ID et VITE_CONTENTFUL_DELIVERY_TOKEN.',
          )
        }

        // Chemin "propre" si vous ajoutez un champ slug dans Contentful
        const res: any = await contentfulClient.getEntries({
          content_type: 'realisation',
          include: 3,
          limit: 1,
          'fields.slug': slug,
        } as any)

        let entry: any | undefined = res?.items?.[0]

        // Fallback si vous n’avez pas encore de champ slug : on fait un match sur title slugifié
        if (!entry) {
          const all: any = await contentfulClient.getEntries({
            content_type: 'realisation',
            include: 3,
            limit: 200,
          })
          entry = (all?.items ?? []).find(
            (it: any) => slugify(String(it?.fields?.title ?? '')) === slug,
          )
        }

        if (!entry) throw new Error('Réalisation introuvable.')

        const fields: any = entry.fields ?? {}
        const title = typeof fields.title === 'string' ? fields.title : 'Réalisation'
        const slugValue = typeof fields.slug === 'string' ? fields.slug : slugify(title)
        const category = typeof fields.category === 'string' ? fields.category : 'Autre'
        const description =
          typeof fields.description === 'string' ? fields.description : undefined
        const content = (fields.contenu ?? fields.content) as Document | null | undefined

        const cover = getAssetUrl(fields.coverImage ?? fields.image)
        const photosRaw = (fields.photos ?? fields.gallery ?? []) as any[]
        const photos = (Array.isArray(photosRaw) ? photosRaw : [])
          .map((a) => {
            const url = getAssetUrl(a)
            if (!url) return null
            return { url, title: getAssetTitle(a) }
          })
          .filter(Boolean) as { url: string; title?: string }[]

        const mapped: RealisationDetail = {
          id: entry.sys.id,
          title,
          slug: slugValue,
          category,
          description,
          content: content ?? undefined,
          coverUrl: cover,
          photos,
        }

        if (!cancelled) setItem(mapped)
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
  }, [slug])

  const pageTitle = useMemo(() => item?.title ?? 'Réalisation', [item])

  return (
    <main style={{ paddingTop: navHeight }}>
      <section className="border-b border-slate-100 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-6">
          <Link to="/realisations" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Retour aux réalisations
          </Link>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-6">
          {loading && <p className="text-sm text-slate-600">Chargement…</p>}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && item && (
            <>
              <header className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {item.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {pageTitle}
                </h1>
                {item.description ? (
                  <p className="mt-4 text-slate-600">{item.description}</p>
                ) : null}
              </header>

              {item.coverUrl ? (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="h-[340px] w-full object-cover sm:h-[420px]"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* Contenu (Rich Text Contentful) */}
              {item.content ? (
                <div className="mt-10 max-w-3xl">
                  <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-primary prose-a:underline prose-a:decoration-primary/40 hover:prose-a:decoration-primary">
                    {documentToReactComponents(item.content)}
                  </div>
                </div>
              ) : null}

              {/* Photos (champ Contentful recommandé : photos [Media, many]) */}
              <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900">Photos</h2>
                {item.photos.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">
                    Ajoutez des photos à cette réalisation dans Contentful pour les afficher ici.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {item.photos.map((p, idx) => (
                      <figure
                        key={`${p.url}-${idx}`}
                        className="overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                      >
                        <img
                          src={p.url}
                          alt={p.title ?? `${item.title} — photo ${idx + 1}`}
                          className="h-52 w-full object-cover"
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

